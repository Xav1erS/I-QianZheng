"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types";

interface ChatPanelProps {
  consultationId: string;
  initialCredits: number;
}

export default function ChatPanel({ consultationId, initialCredits }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [credits, setCredits] = useState(initialCredits);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 加载历史对话
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("messages")
      .select("*")
      .eq("consultation_id", consultationId)
      .order("created_at", { ascending: true })
      .limit(20)
      .then(({ data }) => {
        if (data) setMessages(data as Message[]);
      });
  }, [consultationId]);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending || credits <= 0) return;

    setInput("");
    setIsSending(true);

    // 乐观更新：立即显示用户消息
    const optimisticUserMsg: Message = {
      id: `temp-${Date.now()}`,
      consultation_id: consultationId,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);

    try {
      const res = await fetch(`/api/chat/${consultationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const err = await res.json();
        // 移除乐观消息，显示错误
        setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMsg.id));
        setInput(text);
        alert(err.error ?? "发送失败，请重试");
        return;
      }

      // 流式读取 AI 回复
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setStreamingText(reply);
      }

      // 流结束：把完整 AI 消息加入列表，清空 streaming
      const assistantMsg: Message = {
        id: `temp-assistant-${Date.now()}`,
        consultation_id: consultationId,
        role: "assistant",
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingText("");
      setCredits((c) => c - 1);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMsg.id));
      setInput(text);
      alert("网络错误，请重试");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">继续追问</h3>
            <p className="text-xs text-gray-400">AI 顾问已了解您的报告，可直接提问</p>
          </div>
        </div>
        <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          credits <= 0
            ? "bg-red-50 text-red-600 border border-red-100"
            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
        }`}>
          剩余 {credits} 次积分
        </div>
      </div>

      {/* 消息列表 */}
      <div className="px-5 py-4 space-y-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && !streamingText && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">有任何疑问，都可以直接问我</p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {["这个签证需要哪些语言证书？", "如果被拒签了怎么办？", "能同时申请多个国家吗？"].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full hover:bg-primary-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <svg className="w-3.5 h-3.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary-600 text-white rounded-br-sm"
                  : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 流式中的 AI 回复 */}
        {streamingText && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
              <svg className="w-3.5 h-3.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-sm bg-gray-50 border border-gray-100 text-sm text-gray-800 leading-relaxed">
              <p className="whitespace-pre-wrap">{streamingText}<span className="inline-block w-0.5 h-4 bg-primary-500 animate-pulse ml-0.5 align-text-bottom" /></p>
            </div>
          </div>
        )}

        {/* 等待响应动画 */}
        {isSending && !streamingText && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
              <svg className="w-3.5 h-3.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-50 border border-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
        {credits <= 0 ? (
          <div className="text-center py-2 text-sm text-red-500">
            积分已用完，请联系客服充值后继续使用
          </div>
        ) : (
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的问题... (Enter 发送，Shift+Enter 换行)"
              maxLength={500}
              rows={1}
              disabled={isSending}
              className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:opacity-50 min-h-[42px] max-h-32 overflow-y-auto"
              style={{ height: "auto" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 128) + "px";
              }}
            />
            <button
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="flex-shrink-0 w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
              title="发送 (Enter)"
            >
              {isSending ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1.5 text-right">{input.length}/500 · 每次追问消耗 1 积分</p>
      </div>
    </div>
  );
}
