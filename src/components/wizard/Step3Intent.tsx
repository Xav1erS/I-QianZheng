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

function CardOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
        selected
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {selected && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {label}
    </button>
  );
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
    <div>
      {/* 步骤标题头部 */}
      <div className="px-5 sm:px-8 pt-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl">🌏</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">移民意向</h2>
            <p className="text-sm text-gray-500 mt-0.5">了解您的目标和预算，筛选最合适的路径</p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6 space-y-7">
        {/* 主要目的 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            移民主要目的 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {PURPOSE_OPTIONS.map((opt) => (
              <CardOption
                key={opt.value}
                label={opt.label}
                selected={data.purpose === opt.value}
                onClick={() => onChange({ purpose: opt.value })}
              />
            ))}
          </div>
        </div>

        {/* 预算范围 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            可用预算范围 <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-3">人民币，含签证费和中介费</p>
          <div className="space-y-2">
            {BUDGET_OPTIONS.map((opt) => (
              <CardOption
                key={opt.value}
                label={opt.label}
                selected={data.budget === opt.value}
                onClick={() => onChange({ budget: opt.value })}
              />
            ))}
          </div>
        </div>

        {/* 是否考虑投资移民 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            是否考虑投资移民项目 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {WILL_INVEST_OPTIONS.map((opt) => (
              <CardOption
                key={opt.value}
                label={opt.label}
                selected={data.willInvest === opt.value}
                onClick={() => onChange({ willInvest: opt.value })}
              />
            ))}
          </div>
        </div>

        {/* 积分提示 */}
        {credits <= 0 ? (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            积分已用完，暂时无法生成报告
          </div>
        ) : (
          <p className="text-gray-400 text-xs text-right">
            本次消耗 1 次积分 · 剩余 <span className="font-semibold text-gray-600">{credits}</span> 次
          </p>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="px-5 sm:px-8 pb-8 flex gap-3">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-3.5 px-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all text-sm"
        >
          ← 上一步
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid || isLoading || credits <= 0}
          className="flex-[2] py-3.5 px-4 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI 分析中...
            </>
          ) : credits <= 0 ? (
            "积分不足"
          ) : (
            "生成评估报告 →"
          )}
        </button>
      </div>
    </div>
  );
}
