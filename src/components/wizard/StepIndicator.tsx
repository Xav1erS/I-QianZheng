"use client";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "基本信息", icon: "👤" },
  { number: 2, title: "职业背景", icon: "💼" },
  { number: 3, title: "移民意向", icon: "🌏" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-xl mx-auto px-4 py-4">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;

            return (
              <div key={step.number} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-primary-600 text-white ring-4 ring-primary-100"
                          : "bg-gray-100 text-gray-400"
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
                  <span
                    className={`text-sm font-medium truncate hidden sm:block transition-colors ${
                      isActive ? "text-primary-700" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 mx-3">
                    <div className={`h-0.5 rounded-full transition-colors duration-500 ${isCompleted ? "bg-green-400" : "bg-gray-200"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
