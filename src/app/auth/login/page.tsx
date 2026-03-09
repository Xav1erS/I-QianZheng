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

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="至少 6 位字符"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 transition"
          />
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
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white">移·前程</h1>
            <p className="text-primary-300 text-sm mt-1">AI 签证路径评估平台</p>
          </Link>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl p-8 text-center text-gray-400">加载中...</div>}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-primary-300 text-sm mt-6">
          <Link href="/" className="hover:text-white transition">← 返回首页</Link>
        </p>
      </div>
    </div>
  );
}
