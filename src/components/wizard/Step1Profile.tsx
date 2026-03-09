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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">用户画像</h2>
        <p className="text-gray-500 mt-1">告诉我们您的基本信息，帮助我们提供更精准的分析</p>
      </div>

      {/* 国籍 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          您的国籍 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.nationality}
          onChange={(e) => onChange({ nationality: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition"
        >
          <option value="">请选择国籍</option>
          {NATIONALITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 目标国家（多选） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          目标移民国家/地区 <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">（可多选）</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TARGET_COUNTRY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleCountryToggle(opt.value)}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                data.targetCountries.includes(opt.value)
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {data.targetCountries.length === 0 && (
          <p className="text-gray-400 text-xs mt-1">请至少选择一个目标国家</p>
        )}
      </div>

      {/* 年龄 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          您的年龄 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={18}
          max={99}
          value={data.age || ""}
          onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
          placeholder="请输入年龄（18-99岁）"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 transition"
        />
      </div>

      {/* 最高学历 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          最高学历 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EDUCATION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.education === opt.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="education"
                value={opt.value}
                checked={data.education === opt.value}
                onChange={(e) => onChange({ education: e.target.value })}
                className="text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 下一步按钮 */}
      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full py-4 px-6 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all text-base"
        >
          下一步：职业背景 →
        </button>
      </div>
    </div>
  );
}
