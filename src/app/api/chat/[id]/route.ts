import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { buildChatSystemPrompt } from "@/lib/prompts";
import { WizardFormData } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const KIMI_BASE_URL = "https://api.moonshot.cn/v1";
const KIMI_MODEL = process.env.KIMI_MODEL || "kimi-k2.5";

export async function POST(
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

    // 2. 解析请求体
    const body = await request.json();
    const userMessage: string = (body.message ?? "").trim().slice(0, 500);
    if (!userMessage) {
      return NextResponse.json({ error: "消息不能为空" }, { status: 400 });
    }

    // 3. 查询积分
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

    // 4. 查询咨询记录（获取上下文）
    const { data: consultation, error: fetchError } = await supabase
      .from("consultations")
      .select("input_data, ai_response")
      .eq("id", consultationId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !consultation) {
      return NextResponse.json({ error: "找不到该报告" }, { status: 404 });
    }

    if (!consultation.ai_response) {
      return NextResponse.json(
        { error: "报告尚未生成完成，请稍后再试" },
        { status: 400 }
      );
    }

    // 5. 加载历史对话（最多20条）
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("consultation_id", consultationId)
      .order("created_at", { ascending: true })
      .limit(20);

    // 6. 保存用户消息
    const adminSupabase = createAdminClient();
    await adminSupabase.from("messages").insert({
      consultation_id: consultationId,
      role: "user",
      content: userMessage,
    });

    // 7. 调用 Kimi API（流式）
    if (!process.env.KIMI_API_KEY) {
      return NextResponse.json({ error: "AI 服务未配置" }, { status: 500 });
    }

    const inputData = consultation.input_data as WizardFormData & { tier?: string };
    const { tier: _, ...formData } = inputData; // eslint-disable-line @typescript-eslint/no-unused-vars
    const systemPrompt = buildChatSystemPrompt(formData as WizardFormData, consultation.ai_response);

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userMessage },
    ];

    const kimiResponse = await fetch(KIMI_BASE_URL + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KIMI_API_KEY}`,
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        max_tokens: 2000,
        stream: true,
        messages,
      }),
    });

    if (!kimiResponse.ok) {
      const errText = await kimiResponse.text();
      console.error("Kimi Chat API 错误:", kimiResponse.status, errText);
      return NextResponse.json(
        { error: "AI 服务暂时不可用，请稍后重试" },
        { status: 500 }
      );
    }

    // 8. 转发流式内容，结束后保存回复并扣积分
    const encoder = new TextEncoder();
    let fullReply = "";

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
                  fullReply += text;
                  controller.enqueue(encoder.encode(text));
                }
              } catch {
                // 忽略解析错误的 SSE 行
              }
            }
          }

          // 保存 assistant 回复并扣积分
          if (fullReply) {
            await Promise.all([
              adminSupabase.from("messages").insert({
                consultation_id: consultationId,
                role: "assistant",
                content: fullReply,
              }),
              adminSupabase
                .from("users")
                .update({ credits: userProfile.credits - 1 })
                .eq("id", user.id),
            ]);
          }

          controller.close();
        } catch (err) {
          console.error("Chat 流式处理错误:", err);
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
    console.error("Chat API 错误:", err);
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}
