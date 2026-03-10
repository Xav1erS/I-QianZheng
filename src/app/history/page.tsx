import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Consultation, WizardFormData } from "@/types";
import DeleteButton from "./DeleteButton";

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 30) return `${days} 天前`;
  return new Date(dateStr).toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" });
}

const COUNTRY_FLAGS: Record<string, string> = {
  "美国": "🇺🇸",
  "加拿大": "🇨🇦",
  "澳大利亚": "🇦🇺",
  "英国": "🇬🇧",
  "新加坡": "🇸🇬",
  "新西兰": "🇳🇿",
  "日本": "🇯🇵",
  "德国": "🇩🇪",
  "法国": "🇫🇷",
  "荷兰": "🇳🇱",
  "葡萄牙": "🇵🇹",
  "西班牙": "🇪🇸",
  "瑞典": "🇸🇪",
  "丹麦": "🇩🇰",
  "香港": "🇭🇰",
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: consultations, error } = await supabase
    .from("consultations")
    .select("id, created_at, visa_type, input_data, ai_response, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const records = (consultations || []) as Consultation[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面顶部 header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">我的评估报告</h1>
              <p className="text-gray-500 mt-1 text-sm">
                {records.length > 0
                  ? `共 ${records.length} 份历史报告`
                  : "AI 签证路径评估，结果永久保存"}
              </p>
            </div>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition text-sm shadow-sm hover:shadow-md flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              新建评估
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-red-500 mb-4">加载记录失败，请刷新页面重试</p>
            <a href="/history" className="text-sm text-primary-600 hover:text-primary-700 underline">
              刷新页面
            </a>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无评估记录</h3>
            <p className="text-gray-400 mb-8 text-sm">完成向导，AI 将为您生成专属签证路径方案</p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition shadow-sm"
            >
              立即开始评估
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const inputData = record.input_data as WizardFormData & { tier?: string };
              const targetCountries: string[] = inputData?.targetCountries || [];
              const reportTier = inputData?.tier === "detailed" ? "detailed" : "brief";
              const rawStatus = record.status ?? (record.ai_response ? "completed" : "pending");
              const ageMin = (Date.now() - new Date(record.created_at).getTime()) / 60000;
              const status = rawStatus === "pending" && ageMin > 10 ? "failed" : rawStatus;
              const absoluteDate = new Date(record.created_at).toLocaleString("zh-CN");

              const statusConfig =
                status === "completed"
                  ? {
                      label: "已生成",
                      textColor: "text-emerald-700",
                      bg: "bg-emerald-50",
                      bar: "bg-emerald-500",
                      dot: "bg-emerald-500",
                    }
                  : status === "pending"
                  ? {
                      label: "生成中",
                      textColor: "text-amber-700",
                      bg: "bg-amber-50",
                      bar: "bg-amber-400",
                      dot: "bg-amber-500",
                    }
                  : {
                      label: "生成失败",
                      textColor: "text-red-600",
                      bg: "bg-red-50",
                      bar: "bg-red-400",
                      dot: "bg-red-500",
                    };

              return (
                <div
                  key={record.id}
                  className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  {/* 左侧状态色条 */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.bar}`} />

                  <div className="pl-6 pr-5 pt-5 pb-5">
                    {/* 顶栏：状态 + 时间 + 删除 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.textColor}`}
                        >
                          {status === "pending" ? (
                            <span className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          )}
                          {statusConfig.label}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                            reportTier === "detailed"
                              ? "bg-violet-50 text-violet-700 border-violet-200"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }`}
                        >
                          {reportTier === "detailed" ? "详细版" : "简要版"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400" title={absoluteDate}>
                          {relativeTime(record.created_at)}
                        </span>
                        <DeleteButton id={record.id} />
                      </div>
                    </div>

                    {/* 目标国家（主标题级别） */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {targetCountries.length > 0 ? (
                        targetCountries.map((country, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl"
                          >
                            <span className="text-base">{COUNTRY_FLAGS[country] ?? "🌍"}</span>
                            {country}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">未选择目标国家</span>
                      )}
                    </div>

                    {/* 元数据标签 */}
                    <div className="flex items-center gap-2 flex-wrap mb-5">
                      {[
                        { icon: "🎯", value: inputData?.purpose },
                        { icon: "🎓", value: inputData?.education },
                        { icon: "💼", value: inputData?.career },
                      ]
                        .filter((t) => t.value)
                        .map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs text-gray-500 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg"
                          >
                            <span>{tag.icon}</span>
                            {tag.value}
                          </span>
                        ))}
                    </div>

                    {/* 底栏：签证类型 + 操作按钮 */}
                    <div className="flex items-center justify-between">
                      <div>
                        {record.visa_type && status === "completed" && (
                          <span className="text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full">
                            {record.visa_type}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/result/${record.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                      >
                        查看报告
                        <svg
                          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
