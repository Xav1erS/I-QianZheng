"use client";

import {
  WizardFormData,
  NATIONALITY_OPTIONS,
  TARGET_COUNTRY_OPTIONS,
  EDUCATION_OPTIONS,
} from "@/types";

interface Step1Props {
  data: WizardFormData;
  onChange: (data: Partial<WizardFormData>) => void;
  onNext: () => void;
}

const EDUCATION_ICONS: Record<string, string> = {
  "高中及以下": "🏫",
  "大专/职业教育": "🎓",
  "本科": "📘",
  "硕士": "🎓",
  "博士": "🔬",
};

export default function Step1Profile({ data, onChange, onNext }: Step1Props) {
  const handleCountryToggle = (country: string) => {
    const current = data.targetCountries;
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    onChange({ targetCountries: updated });
  };

  const isValid =
    data.nationality &&
    data.targetCountries.length > 0 &&
    data.age > 0 &&
    data.age < 100 &&
    data.education;

  return (
    <div>
      {/* 步骤标题头部 */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl">👤</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">基本信息</h2>
            <p className="text-sm text-gray-500 mt-0.5">填写您的基础背景，帮助 AI 精准分析</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-7">
        {/* 国籍 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            您的国籍 <span className="text-red-500">*</span>
          </label>
          <select
            value={data.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition text-sm appearance-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          >
            <option value="">请选择国籍</option>
            {NATIONALITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 目标国家（多选卡片） */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            目标移民国家/地区 <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-3">可多选</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {TARGET_COUNTRY_OPTIONS.map((opt) => {
              const selected = data.targetCountries.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCountryToggle(opt.value)}
                  className={`relative px-3 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 text-left ${
                    selected
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {selected && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <span className="text-base leading-none block mb-1">{opt.label.split(" ")[0]}</span>
                  <span className="text-xs text-gray-500 font-normal">{opt.label.split(" ").slice(1).join(" ")}</span>
                </button>
              );
            })}
          </div>
          {data.targetCountries.length === 0 && (
            <p className="text-amber-500 text-xs mt-2 flex items-center gap-1">
              <span>⚠</span> 请至少选择一个目标国家
            </p>
          )}
        </div>

        {/* 年龄 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            您的年龄 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min={18}
              max={99}
              value={data.age || ""}
              onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
              placeholder="请输入年龄"
              className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 transition text-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">岁</span>
          </div>
        </div>

        {/* 最高学历（卡片选择） */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            最高学历 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {EDUCATION_OPTIONS.map((opt) => {
              const selected = data.education === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ education: opt.value })}
                  className={`px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 text-left ${
                    selected
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base block mb-1">{EDUCATION_ICONS[opt.value] ?? "📄"}</span>
                  <span className="text-xs leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-8 pb-8">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
        >
          下一步：职业背景 →
        </button>
      </div>
    </div>
  );
}
