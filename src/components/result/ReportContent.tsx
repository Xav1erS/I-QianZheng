"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReportContentProps {
  content: string;
  isStreaming?: boolean;
}

export default function ReportContent({
  content,
  isStreaming = false,
}: ReportContentProps) {
  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
              {children}
            </h3>
          ),
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
      {isStreaming && (
        <span className="inline-block w-2 h-5 bg-primary-600 animate-pulse ml-1 align-middle" />
      )}
    </div>
  );
}
