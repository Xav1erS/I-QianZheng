"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/wizard";

  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message.includes("Invalid login credentials") ? "邮箱或密码错误，请重试" : error.message);
          return;
        }
        toast.success("登录成功！");
        router.push(redirect);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("该邮箱已注册，请直接登录");
            setMode("login");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("注册成功！请查收验证邮件完成验证后登录。", { duration: 6000 });
        setMode("login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      {/* 模式切换 */}
      <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === m ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "login" ? "登录" : "注册"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱地址</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="至少 6 位字符"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-all mt-2 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              处理中...
            </>
          ) : mode === "login" ? "登录" : "注册账号（赠 3 次免费评估）"}
        </button>
      </form>

      {mode === "signup" && (
        <p className="text-center text-gray-400 text-xs mt-4">注册即表示您同意我们的服务条款和隐私政策</p>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* 左栏：品牌 + 价值主张（仅桌面端） */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex-col justify-between p-12 text-white">
        <div>
          <Link href="/" className="inline-block group">
            <h1 className="text-3xl font-bold group-hover:text-primary-200 transition">问签</h1>
            <p className="text-primary-300 text-sm mt-1">你的 AI 签证顾问</p>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold leading-snug mb-3">
              签证路径，3步搞清楚
            </h2>
            <p className="text-primary-300 text-base leading-relaxed">
              填写背景信息，AI 60秒内生成专属签证路径报告，覆盖材料清单、费用预估和时间线
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { icon: "🤖", text: "Claude AI 驱动，分析精准" },
              { icon: "🔒", text: "无需上传任何证件，隐私优先" },
              { icon: "⚡", text: "60 秒出报告，即填即得" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-primary-100 text-sm font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-primary-500 text-sm">注册即赠 3 次免费评估 · 无需信用卡</p>
      </div>

      {/* 右栏：登录表单 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
        {/* 移动端 Logo */}
        <div className="md:hidden text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-900">问签</h1>
            <p className="text-gray-500 text-sm mt-1">你的 AI 签证顾问</p>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <Suspense fallback={<div className="bg-white rounded-2xl p-8 text-center text-gray-400">加载中...</div>}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-gray-400 text-sm mt-6">
            <Link href="/" className="hover:text-gray-600 transition">← 返回首页</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
