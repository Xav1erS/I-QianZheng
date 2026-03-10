"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

function toId(text: string): string {
  return (
    text
      .replace(/[^\w\u4e00-\u9fff\s]/g, " ")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()
      .slice(0, 50) || "section"
  );
}

function extractText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  return "";
}

interface ReportContentProps {
  content: string;
  isStreaming?: boolean;
}

export default function ReportContent({
  content,
  isStreaming = false,
}: ReportContentProps) {
  // 流式生成期间用纯文本显示，避免不完整 markdown 块渲染异常
  if (isStreaming) {
    return (
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans text-base">
        {content}
        <span className="inline-block w-2 h-5 bg-primary-600 animate-pulse ml-0.5 align-middle rounded-sm" />
      </div>
    );
  }

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const id = toId(extractText(children));
            return (
              <h2 id={id} className="scroll-mt-20 text-xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200 first:mt-0">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = toId(extractText(children));
            return (
              <h3 id={id} className="scroll-mt-20 text-lg font-semibold text-gray-800 mt-6 mb-3">
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 mb-4 pl-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-4 pl-1 list-decimal list-inside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-gray-700">
              <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-300 pl-4 py-1 bg-primary-50 rounded-r-lg my-4 text-gray-600 italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          // 支持 GFM 任务列表
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-primary-50 text-primary-800">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-100">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-semibold whitespace-nowrap border-b border-primary-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-gray-700 align-top">{children}</td>
          ),
          input: ({ type, checked }) =>
            type === "checkbox" ? (
              <input
                type="checkbox"
                checked={checked}
                readOnly
                className="mr-2 accent-primary-600"
              />
            ) : null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
