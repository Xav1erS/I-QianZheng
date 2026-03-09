"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
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
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setCredits(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-primary-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl hover:text-primary-200 transition"
        >
          <span>移·前程</span>
          <span className="hidden sm:inline text-primary-400 text-sm font-normal">
            AI 签证顾问
          </span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/wizard"
                className="text-primary-200 hover:text-white transition text-sm font-medium"
              >
                开始评估
              </Link>
              <Link
                href="/history"
                className="text-primary-200 hover:text-white transition text-sm font-medium"
              >
                我的报告
              </Link>
              {credits !== null && (
                <span className="bg-primary-700 text-primary-200 px-3 py-1 rounded-full text-xs">
                  剩余 <span className="text-white font-bold">{credits}</span>{" "}
                  次
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-primary-300 hover:text-white transition text-sm"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-primary-200 hover:text-white transition text-sm font-medium"
              >
                登录
              </Link>
              <Link
                href="/auth/login?mode=signup"
                className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                免费注册
              </Link>
            </>
          )}
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="菜单"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-800 border-t border-primary-700 px-4 py-3 space-y-2">
          {user ? (
            <>
              {credits !== null && (
                <p className="text-primary-300 text-sm py-2">
                  剩余积分：<span className="text-white font-bold">{credits}</span> 次
                </p>
              )}
              <Link
                href="/wizard"
                className="block py-2 text-primary-200 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                开始评估
              </Link>
              <Link
                href="/history"
                className="block py-2 text-primary-200 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                我的报告
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="block py-2 text-primary-400 hover:text-white transition w-full text-left"
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block py-2 text-primary-200 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                登录
              </Link>
              <Link
                href="/auth/login"
                className="block py-2 text-accent-400 hover:text-accent-300 font-semibold transition"
                onClick={() => setIsMenuOpen(false)}
              >
                免费注册（赠 3 次）
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
