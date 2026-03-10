import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { buildSystemPrompt, buildUserPrompt, buildUserPromptBrief } from "@/lib/prompts";
import { WizardFormData } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const KIMI_BASE_URL = "https://api.moonshot.cn/v1";
const KIMI_MODEL = process.env.KIMI_MODEL || "kimi-k2.5";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultationId = params.id;

    // 1. 验证用户身份
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
    }

    // 2. 查询咨询记录
    const { data: consultation, error: fetchError } = await supabase
      .from("consultations")
      .select("*")
      .eq("id", consultationId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !consultation) {
      return NextResponse.json({ error: "找不到该报告" }, { status: 404 });
    }

    // 3. 如果已有 AI 响应，直接返回
    if (consultation.ai_response) {
      return new Response(consultation.ai_response, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // 4. 获取用户积分
    const { data: userProfile } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!userProfile || userProfile.credits <= 0) {
      return NextResponse.json(
        { error: "积分不足，请联系客服充值" },
        { status: 402 }
      );
    }

    // 5. 调用 Kimi API（流式）
    if (!process.env.KIMI_API_KEY) {
      console.error("KIMI_API_KEY 未配置");
      return NextResponse.json({ error: "AI 服务未配置，请联系管理员" }, { status: 500 });
    }

    const inputData = consultation.input_data as WizardFormData & { tier?: string };
    const { tier, ...formData } = inputData;
    const userPrompt =
      tier === "detailed"
        ? buildUserPrompt(formData as WizardFormData)
        : buildUserPromptBrief(formData as WizardFormData);

    const kimiResponse = await fetch(KIMI_BASE_URL + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KIMI_API_KEY}`,
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        max_tokens: 8000,
        stream: true,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    // 6. 将 Kimi 的 SSE 流转发给前端，完成后保存并扣积分
    const adminSupabase = createAdminClient();

    if (!kimiResponse.ok) {
      const errText = await kimiResponse.text();
      console.error("Kimi API 错误:", kimiResponse.status, errText);
      await adminSupabase
        .from("consultations")
        .update({ status: "failed" })
        .eq("id", consultationId);
      return NextResponse.json(
        { error: `AI 服务暂时不可用，请稍后重试` },
        { status: 500 }
      );
    }
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
          if (fullResponse) {
            await Promise.all([
              adminSupabase
                .from("consultations")
                .update({
                  ai_response: fullResponse,
                  visa_type: extractVisaType(fullResponse),
                  status: "completed",
                })
                .eq("id", consultationId),

              adminSupabase
                .from("users")
                .update({ credits: userProfile.credits - 1 })
                .eq("id", user.id),
            ]);
          } else {
            // 流结束但内容为空，标记为失败
            await adminSupabase
              .from("consultations")
              .update({ status: "failed" })
              .eq("id", consultationId);
          }

          controller.close();
        } catch (err) {
          console.error("AI 流式处理错误:", err);
          await adminSupabase
            .from("consultations")
            .update({ status: "failed" })
            .eq("id", consultationId);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Stream API 错误:", err);
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}

const VISA_TYPE_BLOCKLIST = ["attorney", "agent", "lawyer", "mara", "律师", "顾问", "代理", "licensed", "immigration consultant"];

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
      if (match && match.length < 30) {
        const lower = match.toLowerCase();
        if (!VISA_TYPE_BLOCKLIST.some((w) => lower.includes(w))) return match;
      }
    }
  }
  return "综合评估";
}
