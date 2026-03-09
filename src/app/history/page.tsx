import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Consultation } from "@/types";

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
    .select("id, created_at, visa_type, input_data, ai_response")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: userProfile } = await supabase
    .from("users")
    .select("credits")
    .eq("id", user.id)
    .single();

  const records = (consultations || []) as Consultation[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的评估报告</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {records.length > 0 ? `共 ${records.length} 份报告` : "查看您的历史签证路径评估记录"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`text-sm px-3 py-2 rounded-lg ${
              (userProfile?.credits ?? 0) === 0
                ? "bg-red-50 text-red-700"
                : "text-gray-600 bg-gray-100"
            }`}
          >
            剩余积分：
            <span className={`font-bold ${(userProfile?.credits ?? 0) === 0 ? "text-red-700" : "text-primary-700"}`}>
              {userProfile?.credits ?? 0}
            </span>{" "}
            次
          </div>
          <Link
            href="/wizard"
            className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition text-sm"
          >
            + 新建评估
          </Link>
        </div>
      </div>

      {/* 报告列表 */}
      {error ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-red-500 mb-4">加载记录失败，请刷新页面重试</p>
          <a
            href="/history"
            className="text-sm text-primary-600 hover:text-primary-700 underline"
          >
            刷新页面
          </a>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无评估记录</h3>
          <p className="text-gray-500 mb-6 text-sm">您还没有生成过签证路径评估报告</p>
          <Link
            href="/wizard"
            className="inline-block px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition"
          >
            立即开始评估
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const inputData = record.input_data;
            const targetCountries = inputData?.targetCountries || [];
            const hasResponse = !!record.ai_response;
            const absoluteDate = new Date(record.created_at).toLocaleString("zh-CN");

            return (
              <Link
                key={record.id}
                href={`/result/${record.id}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all p-5 group"
              >
                {/* 国家数量 badge */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex flex-col items-center justify-center border border-primary-100 group-hover:bg-primary-100 transition-colors">
                  <span className="text-primary-700 font-bold text-lg leading-none">
                    {targetCountries.length}
                  </span>
                  <span className="text-primary-400 text-xs leading-none mt-0.5">国家</span>
                </div>

                {/* 主要内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {record.visa_type && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {record.visa_type}
                      </span>
                    )}
                    {!hasResponse && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        <span className="w-2.5 h-2.5 border border-yellow-600 border-t-transparent rounded-full animate-spin" />
                        生成中
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium text-sm truncate">
                    {inputData?.nationality || "—"} → {targetCountries.join("、") || "—"}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">
                    {inputData?.purpose || "—"} · {inputData?.education || "—"} · {inputData?.career || "—"}
                  </p>
                </div>

                {/* 时间 + 箭头 */}
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                  <p
                    className="text-gray-400 text-xs"
                    title={absoluteDate}
                  >
                    {relativeTime(record.created_at)}
                  </p>
                  <span className="text-primary-500 text-sm font-medium group-hover:text-primary-700 transition-colors flex items-center gap-1">
                    查看报告
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
