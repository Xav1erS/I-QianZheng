import type { Metadata } from "next";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "移·前程 | AI 签证路径评估",
  description:
    "专业的 AI 移民签证顾问平台，根据您的背景信息，智能分析最适合的签证路径。3步填写，即刻获取个性化评估报告。",
  keywords: "移民, 签证, AI 顾问, 签证路径, 移民评估, 加拿大签证, 澳大利亚签证, 美国签证",
  openGraph: {
    title: "移·前程 | AI 签证路径评估",
    description: "3步填写，AI 即刻分析最适合您的签证路径",
    url: "https://iqianzheng.com",
    siteName: "移·前程",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main>{children}</main>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
