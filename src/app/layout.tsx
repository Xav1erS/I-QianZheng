import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://iqianzheng.com"),
  title: {
    default: "问签 | 你的 AI 签证顾问",
    template: "%s | 问签",
  },
  description:
    "3步填写背景信息，AI 即刻分析最适合您的签证路径，生成个性化移民评估报告。支持澳洲、加拿大、美国、英国、新西兰等主流移民目的地。",
  keywords:
    "问签, 签证顾问, AI移民顾问, 签证评估, 移民路径, 澳洲签证, 加拿大签证, 美国签证, 英国签证, 技术移民, 移民评估",
  openGraph: {
    title: "问签 | 你的 AI 签证顾问",
    description: "3步填写背景，AI 即刻生成专属签证路径报告",
    url: "https://iqianzheng.com",
    siteName: "问签",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "问签 | 你的 AI 签证顾问",
    description: "3步填写背景，AI 即刻生成专属签证路径报告",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://iqianzheng.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "问签",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
    description: "注册即赠 3 次免费评估",
  },
  description:
    "AI 驱动的签证路径评估平台，3步填写背景信息，即刻生成个性化移民评估报告",
  url: "https://iqianzheng.com",
  inLanguage: "zh-CN",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
