"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import DisclaimerBanner from "@/components/result/DisclaimerBanner";
import ReportContent from "@/components/result/ReportContent";
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 操作栏 */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <Link
              href="/history"
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1 mb-2"
            >
              ← 返回历史报告
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              签证路径评估报告
            </h1>
            {consultation && (
              <p className="text-gray-500 text-sm mt-1">
                生成时间：
                {new Date(consultation.created_at).toLocaleString("zh-CN")}
                {consultation.visa_type && (
                  <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {consultation.visa_type}
                  </span>
                )}
              </p>
            )}
          </div>

          {!isStreaming && streamedContent && (
            <div className="flex items-center gap-2">
              <CopyButton text={streamedContent} />
              <ExportPDFButton targetId="report-content" />
            </div>
          )}
        </div>

        {/* 报告内容 */}
        <div
          id="report-content"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          {isStreaming && !streamedContent && (
            <div className="flex items-center gap-3 text-gray-500 py-8">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <p>AI 正在分析您的信息，请稍候...</p>
            </div>
          )}

          {streamedContent ? (
            <ReportContent
              content={streamedContent}
              isStreaming={isStreaming}
            />
          ) : !isStreaming ? (
            <div className="text-center py-12">
              <p className="text-gray-500">报告内容为空，请</p>
              <button
                onClick={() => router.push("/wizard")}
                className="mt-4 px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition"
              >
                重新生成报告
              </button>
            </div>
          ) : null}
        </div>

        {/* 底部操作 */}
        {!isStreaming && streamedContent && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
