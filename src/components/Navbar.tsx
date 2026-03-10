"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (data) setCredits(data.credits);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setCredits(null);
      else fetchUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setCredits(null);
    router.push("/");
    router.refresh();
  };

  const isOnWizard = pathname.startsWith("/wizard");

  if (pathname.startsWith("/auth")) return null;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="leading-none">
            <span className="font-bold text-gray-900 text-lg block">问签</span>
            <span className="hidden sm:block text-gray-400 text-xs mt-0.5">AI 签证顾问</span>
          </div>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              {!isOnWizard && (
                <Link
                  href="/wizard"
                  className="text-sm font-medium px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  开始评估
                </Link>
              )}
              <Link
                href="/history"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  pathname.startsWith("/history") || pathname.startsWith("/result")
                    ? "text-primary-700 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                我的报告
              </Link>
              {credits !== null && (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ml-1 ${
                    credits === 0
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      credits === 0 ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />
                  剩余{" "}
                  <span className={credits === 0 ? "text-red-700" : "text-emerald-900"}>{credits}</span> 次
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors ml-1"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                登录
              </Link>
              <Link
                href="/auth/login?mode=signup"
                className="ml-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                免费注册
              </Link>
            </>
          )}
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition text-gray-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={isMenuOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 移动端菜单 */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          isMenuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {user ? (
            <>
              {credits !== null && (
                <div className={`text-sm px-3 py-2.5 rounded-lg ${credits === 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                  剩余积分：<span className="font-bold">{credits}</span> 次
                </div>
              )}
              {!isOnWizard && (
                <Link href="/wizard" className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                  开始评估
                </Link>
              )}
              <Link href="/history" className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                我的报告
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors text-sm"
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
                登录
              </Link>
              <Link href="/auth/login?mode=signup" className="block py-2.5 px-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition text-sm">
                免费注册（赠 3 次）
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
