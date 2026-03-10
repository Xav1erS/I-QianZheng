"use client";

interface Props {
  content: string;
}

function parseMetrics(content: string) {
  // 推荐签证路径：匹配"推荐签证"或"首选"或"路径一"后的签证名
  let recommendedVisa = "分析中…";
  const visaPatterns = [
    /首选[：:]\s*([^\n]{4,40})/,
    /推荐签证[路径]*[：:]\s*([^\n]{4,40})/,
    /路径一[（(（][^）)）]+[）)）]?[：:]?\s*([^\n]{4,40})/,
    /###\s*路径一[^：:]*[：:]\s*([^\n]{4,40})/,
    /\*\*首选[推荐]*\*\*[：:]\s*([^\n]{4,40})/,
  ];
  for (const pattern of visaPatterns) {
    const m = content.match(pattern);
    if (m) {
      recommendedVisa = m[1].replace(/\*\*/g, "").trim().slice(0, 20);
      break;
    }
  }

  // 可行性：匹配"可行性评估：高/中/低"
  let feasibility = "—";
  let feasibilityColor = "text-gray-500";
  const feasMatch = content.match(/可行性[评估]*[：:]\s*(高|中|低|较高|较低|一般)/);
  if (feasMatch) {
    feasibility = feasMatch[1];
    if (feasibility.includes("高")) feasibilityColor = "text-green-500";
    else if (feasibility.includes("低")) feasibilityColor = "text-red-400";
    else feasibilityColor = "text-yellow-500";
  }

  // 材料数量：统计 checkbox 列表项
  const materialCount = (content.match(/- \[[ x]\]/g) || []).length;

  // 建议数量：统计个性化建议列表项（数字开头的列表）
  const adviceCount = (content.match(/^\d+\.\s+/gm) || []).length;

  // 推荐路径数量
  const pathCount = (content.match(/###\s*路径[一二三四五]/g) || content.match(/路径\d+/g) || []).length;

  return { recommendedVisa, feasibility, feasibilityColor, materialCount, adviceCount, pathCount };
}

export default function ReportSummaryCards({ content }: Props) {
  if (!content || content.length < 100) return null;

  const { recommendedVisa, feasibility, feasibilityColor, materialCount, adviceCount, pathCount } =
    parseMetrics(content);

  const cards = [
    {
      label: "首选推荐",
      value: recommendedVisa,
      valueClass: "text-base font-bold text-gray-900 leading-snug",
      icon: "🛂",
    },
    {
      label: "总体可行性",
      value: feasibility || "—",
      valueClass: `text-2xl font-extrabold ${feasibilityColor}`,
      icon: "📊",
    },
    {
      label: "推荐路径",
      value: pathCount > 0 ? `${pathCount} 条` : "—",
      valueClass: "text-2xl font-extrabold text-primary-700",
      icon: "🗺️",
    },
    {
      label: "所需材料",
      value: materialCount > 0 ? `${materialCount} 项` : "见报告",
      valueClass: "text-2xl font-extrabold text-primary-700",
      icon: "📋",
    },
    {
      label: "关键建议",
      value: adviceCount > 0 ? `${adviceCount} 条` : "见报告",
      valueClass: "text-2xl font-extrabold text-primary-700",
      icon: "💡",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-gray-100 rounded-xl px-4 py-4 shadow-sm flex flex-col gap-1"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">{card.icon}</span>
            <span className="text-xs text-gray-400 font-medium">{card.label}</span>
          </div>
          <div className={card.valueClass}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
