"use client";

interface Props {
  onSelect: (tier: "brief" | "detailed") => void;
  onClose: () => void;
  credits: number;
  isLoading: boolean;
}

const BRIEF_SECTIONS = [
  "🔴 风险提示",
  "✅ 推荐签证路径（1–3 条）",
  "💡 个性化建议",
];

const DETAILED_SECTIONS = [
  "🔴 风险提示",
  "📊 签证成功率参考（表格）",
  "✅ 推荐签证路径（含拒签风险分析 + 预计周期）",
  "📝 申请材料清单（Checklist）",
  "💰 费用预估（表格）",
  "⏳ 预计时间线",
  "💡 个性化建议",
];

export default function VersionSelectModal({
  onSelect,
  onClose,
  credits,
  isLoading,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">选择报告版本</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            当前剩余积分：
            <span className="font-semibold text-gray-800">{credits}</span> 次
          </p>
        </div>

        {/* Version cards */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {/* Brief */}
          <button
            onClick={() => onSelect("brief")}
            disabled={isLoading || credits < 1}
            className="relative flex flex-col text-left rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-sm p-4 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <div className="font-bold text-base text-gray-900 mb-0.5 group-hover:text-orange-600 transition-colors">
              简要版
            </div>
            <div className="text-xs font-medium text-orange-500 mb-4">
              消耗 1 次积分
            </div>
            <ul className="space-y-1.5 flex-1">
              {BRIEF_SECTIONS.map((s) => (
                <li key={s} className="text-xs text-gray-600 leading-snug">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-4 w-full text-center text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg py-2 transition-colors">
              选择简要版
            </div>
          </button>

          {/* Detailed */}
          <button
            onClick={() => onSelect("detailed")}
            disabled={isLoading || credits < 3}
            className="relative flex flex-col text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-sm p-4 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <div className="font-bold text-base text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">
              详细版
            </div>
            <div className="text-xs font-medium text-blue-500 mb-4">
              消耗 3 次积分
            </div>
            <ul className="space-y-1.5 flex-1">
              {DETAILED_SECTIONS.map((s) => (
                <li key={s} className="text-xs text-gray-600 leading-snug">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-4 w-full text-center text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg py-2 transition-colors">
              选择详细版
            </div>
          </button>
        </div>

        {/* Cancel */}
        <div className="px-6 pb-6 -mt-2 text-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
