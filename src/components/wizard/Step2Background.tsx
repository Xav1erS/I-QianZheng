"use client";

import { WizardFormData, CAREER_OPTIONS, INCOME_OPTIONS } from "@/types";

interface Step2Props {
  data: WizardFormData;
  onChange: (data: Partial<WizardFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Background({
  data,
  onChange,
  onNext,
  onBack,
}: Step2Props) {
  const isValid = data.career && data.income;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">职业与资产背景</h2>
        <p className="text-gray-500 mt-1">职业背景和经济状况是评估签证资格的重要因素</p>
      </div>

      {/* 职业领域 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          职业领域 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.career}
          onChange={(e) => onChange({ career: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition"
        >
          <option value="">请选择职业领域</option>
          {CAREER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 年收入范围 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          年收入范围（人民币） <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {INCOME_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.income === opt.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="income"
                value={opt.value}
                checked={data.income === opt.value}
                onChange={(e) => onChange({ income: e.target.value })}
                className="text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 是否有配偶 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          婚姻状况
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: true, label: "已婚（有配偶）" },
            { value: false, label: "未婚/离异/丧偶" },
          ].map((opt) => (
            <label
              key={String(opt.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.hasSpouse === opt.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="hasSpouse"
                checked={data.hasSpouse === opt.value}
                onChange={() => onChange({ hasSpouse: opt.value })}
                className="text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 是否有子女 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          是否有子女
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: true, label: "有子女" },
            { value: false, label: "无子女" },
          ].map((opt) => (
            <label
              key={String(opt.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.hasChildren === opt.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="hasChildren"
                checked={data.hasChildren === opt.value}
                onChange={() => onChange({ hasChildren: opt.value })}
                className="text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
        >
          ← 上一步
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-2 flex-grow-[2] py-4 px-6 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
        >
          下一步：移民意向 →
        </button>
      </div>
    </div>
  );
}
