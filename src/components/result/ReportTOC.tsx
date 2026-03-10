"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

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

function parseHeadings(content: string): Heading[] {
  return content
    .split("\n")
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => {
      const m = line.match(/^(#{2,3})\s+(.+)/);
      if (!m) return null;
      const text = m[2].trim();
      return { id: toId(text), text, level: m[1].length };
    })
    .filter(Boolean) as Heading[];
}

export default function ReportTOC({ content }: { content: string }) {
  const headings = parseHeadings(content);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-10% 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          目录
        </p>
        <nav className="space-y-0.5">
          {headings.map(({ id, text, level }) => (
            <button
              key={id}
              onClick={() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveId(id);
              }}
              className={`w-full text-left flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 transition-colors ${
                level === 3 ? "pl-4" : ""
              } ${
                activeId === id
                  ? "text-primary-700 bg-primary-50 font-medium"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {activeId === id && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
              )}
              <span className="line-clamp-2 leading-snug">{text}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
