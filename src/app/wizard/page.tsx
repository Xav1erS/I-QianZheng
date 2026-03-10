"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StepIndicator from "@/components/wizard/StepIndicator";
import Step1Profile from "@/components/wizard/Step1Profile";
import Step2Background from "@/components/wizard/Step2Background";
import Step3Intent from "@/components/wizard/Step3Intent";
import { WizardFormData } from "@/types";
import { createClient } from "@/lib/supabase/client";

const initialFormData: WizardFormData = {
  nationality: "中国",
  targetCountries: [],
  age: 0,
  education: "",
  career: "",
  income: "",
  hasSpouse: false,
  hasChildren: false,
  purpose: "",
  budget: "",
  willInvest: "",
};

export default function WizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(3);

  useEffect(() => {
    const fetchCredits = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (data) setCredits(data.credits);
    };
    fetchCredits();
  }, []);

  const handleChange = (updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("请先登录后再生成报告");
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 402) {
          toast.error("积分不足！每次生成消耗 1 次积分，请联系客服充值。");
          return;
        }
        if (response.status === 401) {
          toast.error("登录已过期，请重新登录");
          router.push("/auth/login");
          return;
        }
        const errData = await response.json().catch(() => ({}));
        toast.error(errData.error || "服务暂时不可用，请稍后再试");
        return;
      }

      const { id: consultationId } = await response.json();
      if (!consultationId) {
        toast.error("生成失败，请重试");
        return;
      }

      router.push(`/result/${consultationId}`);
    } catch {
      toast.error("网络错误，请检查网络连接后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StepIndicator currentStep={currentStep} />

      <main className="max-w-xl mx-auto px-4 py-8 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {currentStep === 1 && (
            <Step1Profile
              data={formData}
              onChange={handleChange}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <Step2Background
              data={formData}
              onChange={handleChange}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <Step3Intent
              data={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onBack={() => setCurrentStep(2)}
              isLoading={isLoading}
              credits={credits}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          AI 分析结果仅供参考，不构成法律建议
        </p>
      </main>
    </div>
  );
}
