import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { WizardFormData } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const KIMI_BASE_URL = "https://api.moonshot.cn/v1";
const KIMI_MODEL = process.env.KIMI_MODEL || "moonshot-v1-32k";

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

    // 5. 调用 Kimi API（流式）
    const kimiResponse = await fetch(KIMI_BASE_URL + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KIMI_API_KEY}`,
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        max_tokens: 4096,
        stream: true,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(formData) },
        ],
      }),
    });

    if (!kimiResponse.ok) {
      const errText = await kimiResponse.text();
      console.error("Kimi API 错误:", kimiResponse.status, errText);
      await adminSupabase.from("consultations").delete().eq("id", consultationId);
      return NextResponse.json(
        { error: "AI 服务暂时不可用，请稍后重试" },
        { status: 500 }
      );
    }

    // 6. 将 Kimi 的 SSE 流转发给前端
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        const reader = kimiResponse.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  fullResponse += text;
                  controller.enqueue(encoder.encode(text));
                }
              } catch {
                // 忽略解析错误的 SSE 行
              }
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
    if (
      line.includes("签证") &&
      (line.includes("推荐") || line.includes("适合") || line.includes("建议"))
    ) {
      const match =
        line.match(/[「『【（(]([^」』】）)]+)[」』】）)]/)?.[1] ||
        line.match(/\*\*([^*]+)\*\*/)?.[1];
      if (match && match.length < 50) return match;
    }
  }
  return "综合评估";
}
