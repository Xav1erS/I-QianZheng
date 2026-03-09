"use client";

import { useState } from "react";
import { toast } from "sonner";

interface ExportPDFButtonProps {
  targetId: string;
  filename?: string;
}

export default function ExportPDFButton({
  targetId,
  filename = "移前程-签证评估报告",
}: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // 动态导入，避免 SSR 报错
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById(targetId);

      if (!element) {
        toast.error("找不到报告内容，请刷新页面重试");
        return;
      }

      const opt = {
        margin: [15, 15, 15, 15],
        filename: `${filename}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PDF 导出成功");
    } catch {
      toast.error("PDF 导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-all text-sm font-medium"
    >
      {isExporting ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          导出中...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          导出 PDF
        </>
      )}
    </button>
  );
}
