"use client";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "用户画像", description: "国籍、年龄、学历" },
  { number: 2, title: "职业背景", description: "职业、收入、家庭" },
  { number: 3, title: "移民意向", description: "目的、预算、偏好" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progressPct = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="hidden md:flex flex-col w-60 bg-primary-900 text-white min-h-screen">
      {/* 顶部进度摘要 */}
      <div className="px-6 py-8 border-b border-primary-800">
        <p className="text-primary-400 text-xs font-medium mb-1">当前进度</p>
        <p className="text-white text-lg font-bold">
          步骤 {currentStep}
          <span className="text-primary-400 font-normal text-sm"> / {steps.length}</span>
        </p>
        <div className="mt-3 w-full bg-primary-800 rounded-full h-1.5">
          <div
            className="bg-accent-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPct === 0 ? 8 : progressPct}%` }}
          />
        </div>
      </div>

      {/* 步骤列表 */}
      <nav className="flex-1 px-6 py-6">
        <ol className="relative">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;
            const isPending = currentStep < step.number;
            const isLast = index === steps.length - 1;

            return (
              <li key={step.number} className="relative flex gap-4">
                {/* 连接线 */}
                {!isLast && (
                  <div className="absolute left-[15px] top-8 w-0.5 h-10 transition-colors duration-300"
                    style={{ background: isCompleted ? "rgb(34 197 94)" : "rgb(30 58 95)" }}
                  />
                )}

                {/* 步骤圆圈 */}
                <div className="flex-shrink-0 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-lg shadow-green-900/40"
                        : isActive
                          ? "bg-accent-500 text-white shadow-lg shadow-orange-900/40 ring-4 ring-accent-500/20"
                          : "bg-primary-800 text-primary-500 border border-primary-700"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                </div>

                {/* 文字 */}
                <div className={`pb-10 ${isLast ? "pb-0" : ""}`}>
                  <p
                    className={`text-sm font-semibold leading-tight transition-colors duration-200 ${
                      isActive ? "text-white" : isCompleted ? "text-green-300" : "text-primary-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 transition-colors duration-200 ${
                      isActive ? "text-primary-300" : isPending ? "text-primary-700" : "text-primary-500"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* 底部提示 */}
      <div className="px-6 py-5 border-t border-primary-800">
        <p className="text-primary-600 text-xs leading-relaxed">
          AI 分析结果仅供参考，不构成法律建议
        </p>
      </div>
    </div>
  );
}
