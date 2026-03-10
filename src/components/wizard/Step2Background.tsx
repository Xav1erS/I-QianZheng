"use client";

import { WizardFormData, CAREER_OPTIONS, INCOME_OPTIONS } from "@/types";

interface Step2Props {
  data: WizardFormData;
  onChange: (data: Partial<WizardFormData>) => void;
  onNext: () => void;
  onBack: () => void;
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

export default function Step2Background({ data, onChange, onNext, onBack }: Step2Props) {
  const isValid = data.career && data.income;

  return (
    <div>
      {/* 步骤标题头部 */}
      <div className="px-5 sm:px-8 pt-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl">💼</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">职业背景</h2>
            <p className="text-sm text-gray-500 mt-0.5">职业和收入是签证资格的核心评估因素</p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6 space-y-7">
        {/* 职业领域 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            职业领域 <span className="text-red-500">*</span>
          </label>
          <select
            value={data.career}
            onChange={(e) => onChange({ career: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition text-sm appearance-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          >
            <option value="">请选择职业领域</option>
            {CAREER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 年收入 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            年收入范围（人民币） <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {INCOME_OPTIONS.map((opt) => (
              <CardOption
                key={opt.value}
                label={opt.label}
                selected={data.income === opt.value}
                onClick={() => onChange({ income: opt.value })}
              />
            ))}
          </div>
        </div>

        {/* 婚姻状况 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">婚姻状况</label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { value: true, label: "💑 已婚" },
              { value: false, label: "🙋 未婚/其他" },
            ].map((opt) => (
              <CardOption
                key={String(opt.value)}
                label={opt.label}
                selected={data.hasSpouse === opt.value}
                onClick={() => onChange({ hasSpouse: opt.value })}
              />
            ))}
          </div>
        </div>

        {/* 是否有子女 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">是否有子女</label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { value: true, label: "👨‍👧 有子女" },
              { value: false, label: "✗ 无子女" },
            ].map((opt) => (
              <CardOption
                key={String(opt.value)}
                label={opt.label}
                selected={data.hasChildren === opt.value}
                onClick={() => onChange({ hasChildren: opt.value })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-5 sm:px-8 pb-8 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 px-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
        >
          ← 上一步
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-[2] py-3.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
        >
          下一步：移民意向 →
        </button>
      </div>
    </div>
  );
}
