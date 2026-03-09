"use client";

import { toast } from "sonner";

interface ExportPDFButtonProps {
  targetId: string;
  filename?: string;
}

export default function ExportPDFButton({
  targetId,
}: ExportPDFButtonProps) {
  const handleExport = () => {
    const element = document.getElementById(targetId);
    if (!element) {
      toast.error("找不到报告内容，请刷新页面重试");
      return;
    }
    window.print();
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all text-sm font-medium no-print"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      导出 PDF
    </button>
  );
}
