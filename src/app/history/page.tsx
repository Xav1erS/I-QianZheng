import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Consultation } from "@/types";

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
          <p className="text-gray-500 mt-1">查看您的历史签证路径评估记录</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
            剩余积分：
            <span className="font-bold text-primary-700">
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
        <div className="text-center py-16 text-red-500">
          <p>加载记录失败，请刷新页面重试</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            暂无评估记录
          </h3>
          <p className="text-gray-500 mb-6">
            您还没有生成过签证路径评估报告
          </p>
          <Link
            href="/wizard"
            className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition"
          >
            立即开始评估
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const inputData = record.input_data;
            const targetCountries = inputData?.targetCountries?.join("、") || "—";
            const hasResponse = !!record.ai_response;

            return (
              <Link
                key={record.id}
                href={`/result/${record.id}`}
                className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {record.visa_type && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                          {record.visa_type}
                        </span>
                      )}
                      {!hasResponse && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                          生成中...
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium">
                      {inputData?.nationality || "—"} →{" "}
                      {targetCountries}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      目的：{inputData?.purpose || "—"} ·{" "}
                      {inputData?.education || "—"} ·{" "}
                      {inputData?.career || "—"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-400 text-xs">
                      {new Date(record.created_at).toLocaleDateString(
                        "zh-CN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-primary-600 text-sm mt-1 font-medium">
                      查看报告 →
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
