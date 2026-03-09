"use client";

import {
  WizardFormData,
  PURPOSE_OPTIONS,
  BUDGET_OPTIONS,
  WILL_INVEST_OPTIONS,
} from "@/types";

interface Step3Props {
  data: WizardFormData;
  onChange: (data: Partial<WizardFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  credits: number;
}

export default function Step3Intent({
  data,
  onChange,
  onSubmit,
  onBack,
  isLoading,
  credits,
}: Step3Props) {
  const isValid = data.purpose && data.budget && data.willInvest;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">移民意向</h2>
        <p className="text-gray-500 mt-1">了解您的移民目标和预算，帮助筛选最合适的路径</p>
      </div>

      {/* 主要目的 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          移民主要目的 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {PURPOSE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.purpose === opt.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="purpose"
                value={opt.value}
                checked={data.purpose === opt.value}
                onChange={(e) => onChange({ purpose: e.target.value })}
                className="text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 预算范围 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          可用预算范围（人民币，含签证费和中介费）
          <span className="text-red-500"> *</span>
        </label>
        <div className="space-y-2">
          {BUDGET_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.budget === opt.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="budget"
                value={opt.value}
                checked={data.budget === opt.value}
                onChange={(e) => onChange({ budget: e.target.value })}
                className="text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 是否愿意投资 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          是否考虑投资移民项目 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {WILL_INVEST_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.willInvest === opt.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="willInvest"
                value={opt.value}
                checked={data.willInvest === opt.value}
                onChange={(e) => onChange({ willInvest: e.target.value })}
                className="text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 积分提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-lg">💡</span>
          <div>
            <p className="text-blue-800 font-medium text-sm">生成报告说明</p>
            <p className="text-blue-600 text-sm mt-1">
              点击生成将消耗 1 次积分（当前剩余：
              <span className="font-bold">{credits}</span> 次）。
              AI 将分析您的信息并生成个性化的签证路径评估报告。
            </p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
        >
          ← 上一步
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid || isLoading || credits <= 0}
          className="flex-grow-[2] flex-[2] py-4 px-6 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              AI 分析中...
            </>
          ) : credits <= 0 ? (
            "积分不足，无法生成"
          ) : (
            "🚀 生成评估报告"
          )}
        </button>
      </div>
    </div>
  );
}
