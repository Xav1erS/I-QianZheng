"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import DisclaimerBanner from "@/components/result/DisclaimerBanner";
import ReportContent from "@/components/result/ReportContent";
import ReportSummaryCards from "@/components/result/ReportSummaryCards";
import ReportTOC from "@/components/result/ReportTOC";
import CopyButton from "@/components/result/CopyButton";
import ExportPDFButton from "@/components/result/ExportPDFButton";
import { createClient } from "@/lib/supabase/client";
import { Consultation } from "@/types";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [streamedContent, setStreamedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  // 计时器：仅在 streaming 且尚无内容时运行
  useEffect(() => {
    if (!isStreaming || streamedContent) {
      setElapsed(0);
      return;
    }
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isStreaming, streamedContent]);

  const streamingPhase = elapsed < 8
    ? "AI 正在读取您的信息..."
    : elapsed < 20
    ? "AI 正在分析签证路径..."
    : elapsed < 40
    ? "AI 正在生成完整方案..."
    : "即将完成，请继续等待...";

  useEffect(() => {
    const loadResult = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        toast.error("找不到该报告，可能已被删除");
        router.push("/history");
        return;
      }

      setConsultation(data as Consultation);
      setIsLoading(false);

      // 已有 AI 响应，直接显示
      if (data.ai_response) {
        setStreamedContent(data.ai_response);
        return;
      }

      // 已标记为失败，不再发起请求
      if (data.status === "failed") {
        return;
      }

      // 调用流式端点，实时显示 AI 生成内容
      setIsStreaming(true);
      try {
        const response = await fetch(`/api/stream/${id}`);
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          toast.error(errData.error || "AI 生成失败，请重试");
          setIsStreaming(false);
          return;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let content = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          content += decoder.decode(value, { stream: true });
          setStreamedContent(content);
        }
        toast.success("报告生成完毕！");
      } catch {
        toast.error("网络错误，请刷新页面重试");
      } finally {
        setIsStreaming(false);
      }
    };

    loadResult();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载报告中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部免责声明 */}
      <DisclaimerBanner />

      {/* 页面 header */}
      <div className="no-print bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Link
                href="/history"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-3"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回报告列表
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">签证路径评估报告</h1>
              {consultation && (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-gray-400 text-sm">
                    {new Date(consultation.created_at).toLocaleString("zh-CN")}
                  </span>
                  {consultation.visa_type && (
                    <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold">
                      {consultation.visa_type}
                    </span>
                  )}
                </div>
              )}
            </div>
            {!isStreaming && streamedContent && (
              <div className="flex items-center gap-2">
                <CopyButton text={streamedContent} />
                <ExportPDFButton targetId="report-content" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 生成中：顶部轻提示（有内容时才显示，避免和内容区重复） */}
        {isStreaming && streamedContent && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-primary-50 border border-primary-100 rounded-xl text-primary-600 text-sm">
            <div className="w-3.5 h-3.5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <span>AI 正在继续生成，请勿关闭页面...</span>
          </div>
        )}

        {/* 指标摘要卡片（AI 生成完成后显示） */}
        {!isStreaming && streamedContent && (
          <ReportSummaryCards content={streamedContent} />
        )}

        {/* 报告内容 + 侧边目录 */}
        <div className="flex gap-6 items-start">
          {/* 主内容区 */}
          <div className="flex-1 min-w-0">
        <div
          id="report-content"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          {isStreaming && !streamedContent && (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              {/* 主 spinner */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
                <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
              </div>

              {/* 阶段描述 */}
              <div className="text-center">
                <p className="text-gray-800 font-medium text-base mb-1">{streamingPhase}</p>
                <p className="text-gray-400 text-sm">通常需要 30–60 秒，请耐心等待</p>
              </div>

              {/* 计时 + 进度条 */}
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>已等待 {elapsed} 秒</span>
                  <span>预计约 60 秒</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((elapsed / 60) * 100, 92)}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-300">请勿关闭或刷新页面</p>
            </div>
          )}

          {streamedContent ? (
            <ReportContent
              content={streamedContent}
              isStreaming={isStreaming}
            />
          ) : consultation?.status === "failed" ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">报告生成失败</h3>
              <p className="text-gray-500 text-sm mb-6">AI 服务未能正常返回内容，您的积分未被扣除</p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/history"
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  返回列表
                </Link>
                <Link
                  href="/wizard"
                  className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition text-sm"
                >
                  重新评估
                </Link>
              </div>
            </div>
          ) : !isStreaming ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">报告内容为空</p>
              <button
                onClick={() => router.push("/wizard")}
                className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition"
              >
                重新生成报告
              </button>
            </div>
          ) : null}
        </div>
          </div>{/* end flex-1 */}

          {/* 侧边目录（仅桌面端，报告生成完成后显示） */}
          {!isStreaming && streamedContent && (
            <aside className="hidden lg:block w-52 flex-shrink-0">
              <ReportTOC content={streamedContent} />
            </aside>
          )}
        </div>{/* end flex row */}

        {/* 底部操作 */}
        {!isStreaming && streamedContent && (
          <div className="no-print mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center">
              💡 如需专业帮助，请咨询持牌移民律师
            </p>
            <Link
              href="/wizard"
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition text-sm"
            >
              重新评估
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
