import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { WizardFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户身份
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
    }

    // 2. 检查积分
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "用户信息获取失败" },
        { status: 500 }
      );
    }

    if (userProfile.credits <= 0) {
      return NextResponse.json(
        { error: "积分不足，请联系客服充值" },
        { status: 402 }
      );
    }

    // 3. 解析请求体
    const body = await request.json();
    const { tier, ...formData } = body as WizardFormData & { tier?: string };
    const reportTier = tier === "detailed" ? "detailed" : "brief";
    const creditCost = reportTier === "detailed" ? 3 : 1;

    if (userProfile.credits < creditCost) {
      return NextResponse.json(
        { error: `积分不足，${reportTier === "detailed" ? "详细版需要 3 次积分" : "请联系客服充值"}` },
        { status: 402 }
      );
    }

    if (
      !formData.nationality ||
      !formData.targetCountries?.length ||
      !formData.age ||
      !formData.education ||
      !formData.career ||
      !formData.income ||
      !formData.purpose ||
      !formData.budget ||
      !formData.willInvest
    ) {
      return NextResponse.json(
        { error: "表单数据不完整，请重新填写" },
        { status: 400 }
      );
    }

    // 4. 创建咨询记录（占位），立即返回 ID，AI 生成由结果页发起
    const adminSupabase = createAdminClient();
    const { data: consultation, error: insertError } = await adminSupabase
      .from("consultations")
      .insert({
        user_id: user.id,
        input_data: { ...formData, tier: reportTier },
        ai_response: null,
        visa_type: null,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !consultation) {
      console.error("创建咨询记录失败:", insertError);
      return NextResponse.json(
        { error: "创建记录失败，请重试" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: consultation.id });
  } catch (err) {
    console.error("API 路由错误:", err);
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}
