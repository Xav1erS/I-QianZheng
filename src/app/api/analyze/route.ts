import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { WizardFormData } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

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
    const formData: WizardFormData = await request.json();

    // 基本参数校验
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

    // 4. 先创建咨询记录（占位），获取 ID 返回给前端
    const adminSupabase = createAdminClient();
    const { data: consultation, error: insertError } = await adminSupabase
      .from("consultations")
      .insert({
        user_id: user.id,
        input_data: formData,
        ai_response: null,
        visa_type: null,
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

    const consultationId = consultation.id;

    // 5. 调用 Anthropic API（流式）
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // 创建流式响应
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 4096,
            system: buildSystemPrompt(),
            messages: [
              {
                role: "user",
                content: buildUserPrompt(formData),
              },
            ],
          });

          for await (const chunk of anthropicStream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const text = chunk.delta.text;
              fullResponse += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          // 流结束后保存完整响应并扣积分
          await Promise.all([
            adminSupabase
              .from("consultations")
              .update({
                ai_response: fullResponse,
                visa_type: extractVisaType(fullResponse),
              })
              .eq("id", consultationId),

            adminSupabase
              .from("users")
              .update({ credits: userProfile.credits - 1 })
              .eq("id", user.id),
          ]);

          controller.close();
        } catch (err) {
          console.error("AI 流式处理错误:", err);
          controller.error(err);
          // 如果 AI 出错，删除空记录
          await adminSupabase
            .from("consultations")
            .delete()
            .eq("id", consultationId);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Consultation-Id": consultationId,
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("API 路由错误:", err);
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}

// 从 AI 响应中提取推荐签证类型（简单解析）
function extractVisaType(text: string): string {
  const lines = text.split("\n");
  for (const line of lines) {
    // 尝试找到签证类型关键词
    if (
      line.includes("签证") &&
      (line.includes("推荐") || line.includes("适合") || line.includes("建议"))
    ) {
      // 提取括号或引号中的签证名称
      const match =
        line.match(/[「『【（(]([^」』】）)]+)[」』】）)]/)?.[1] ||
        line.match(/\*\*([^*]+)\*\*/)?.[1];
      if (match && match.length < 50) return match;
    }
  }
  return "综合评估";
}
