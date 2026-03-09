"use client";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
}

const steps: Step[] = [
  { number: 1, title: "用户画像", description: "国籍、年龄、学历" },
  { number: 2, title: "职业背景", description: "职业、收入、家庭" },
  { number: 3, title: "移民意向", description: "目的、预算、偏好" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="hidden md:flex flex-col w-64 bg-primary-900 text-white p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">移·前程</h1>
        <p className="text-primary-200 text-sm mt-1">AI 签证路径评估</p>
      </div>

      <nav className="flex-1">
        <p className="text-primary-300 text-xs font-medium uppercase tracking-wider mb-4">
          评估步骤
        </p>
        <ol className="space-y-4">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <li key={step.number} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-accent-500 text-white"
                          : "bg-primary-700 text-primary-300"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-white"
                        : isCompleted
                          ? "text-green-300"
                          : "text-primary-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${isPending ? "text-primary-600" : "text-primary-400"}`}
                  >
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* 连接线 */}
        <div className="ml-4 mt-2">
          {steps.slice(0, -1).map((step) => (
            <div
              key={`line-${step.number}`}
              className={`w-0.5 h-4 -mt-14 ml-3.5 ${
                currentStep > step.number ? "bg-green-500" : "bg-primary-700"
              }`}
            />
          ))}
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-primary-700">
        <p className="text-primary-400 text-xs">
          ⚠️ AI 分析仅供参考，不构成法律建议
        </p>
      </div>
    </div>
  );
}
