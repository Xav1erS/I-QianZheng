import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "示例报告 | 问签",
  description: "查看问签 AI 生成的真实签证评估报告示例（数据已脱敏）",
};

const MOCK_REPORT_SECTIONS = [
  {
    title: "一、综合评估摘要",
    content: `
**申请人画像：** 中国公民，32岁，软件工程师，年收入 40-60 万人民币，已婚，无子女，目标澳大利亚技术移民，可用资产约 60-100 万人民币。

**总体可行性评估：高**

基于您的背景，澳大利亚技术移民路径可行性较高。您具备以下核心优势：
- IT 职业属于澳大利亚高需求紧缺职业（SOL 名单）
- 年龄处于最优分段（25-32岁），EOI 评分最高
- 学历 + 职业经验组合符合 189/190 签证基本要求
- 英语能力待核实（是关键变量）
    `,
  },
  {
    title: "二、推荐签证路径",
    content: `
### 路径一（首选）：澳大利亚 189 独立技术移民签证

**适合理由：** 无需州担保，可自由选择居住地，永久居留权，配偶可工作学习。

**基本要求：**
- 职业评估：需通过 ACS（澳大利亚计算机协会）职业评估
- EOI 评分：目前 189 签证需 85+ 分（竞争激烈，建议尽量提高分）
- 英语要求：雅思学术类各科 7（总分 7），或同等水平

**您的预估 EOI 评分（初步估算）：**
| 评分项 | 您的情况 | 得分 |
|--------|---------|------|
| 年龄（32岁） | 25-32岁 | 30分 |
| 学历（本科） | 本科 | 15分 |
| 英语（待确认） | 优秀（假设） | 20分 |
| 工作经验（8年以上） | 8-10年经验 | 15分 |
| 小计 | - | **约 80 分** |

> ⚠️ 当前 189 邀请分数线约 85 分。建议通过提升英语成绩或获取州担保（190签证）补足分差。

---

### 路径二（备选）：澳大利亚 190 州担保技术移民

**适合理由：** 比 189 低 5 分即可邀请（+5分州担保加分），但需绑定特定州居住。

**推荐州：** 维多利亚州（IT 职业配额充足）、南澳大利亚州（相对易获提名）

---

### 路径三（长期规划）：加拿大 Express Entry 联邦技术移民

**适合理由：** 作为备用方案，软件工程师 TEER 1 类别，CRS 评分预估约 450-470 分，接近近期邀请分数线（约 470-480）。
    `,
  },
  {
    title: "三、所需材料清单",
    content: `
#### 第一阶段：职业评估（ACS）
- [ ] 学历认证文件（毕业证 + 成绩单，需官方英文版）
- [ ] 工作证明信（前/现雇主出具，含职位、工作内容、时间）
- [ ] 薪资证明（工资单或银行流水）
- [ ] 护照信息页复印件

#### 第二阶段：EOI 提交
- [ ] 有效护照
- [ ] ACS 职业评估通过函
- [ ] 英语成绩单（雅思/托福/PTE）
- [ ] 工作经历证明文件（同上）

#### 第三阶段：签证申请（收到邀请后）
- [ ] 无犯罪记录证明（中国：派出所开具 + 公证认证）
- [ ] 体检报告（澳大利亚指定体检机构）
- [ ] 资产证明（银行存款证明，建议 ≥ 折合 8 万澳元）
- [ ] 婚姻证明（结婚证 + 公证件）
- [ ] 配偶相关材料（护照 + 英语 + 体检等）
    `,
  },
  {
    title: "四、费用预估明细",
    content: `
| 费用项目 | 预估金额 | 说明 |
|---------|---------|------|
| ACS 职业评估费 | AUD 500 | 约 ¥2,400 |
| 雅思考试费（如需） | AUD 390 | 约 ¥1,900 |
| 签证申请费（主申请人） | AUD 4,640 | 约 ¥22,300 |
| 签证申请费（配偶） | AUD 2,320 | 约 ¥11,200 |
| 体检费（2人） | AUD 600 | 约 ¥2,900 |
| 公证翻译费 | AUD 500 | 约 ¥2,400 |
| **合计（不含中介）** | **AUD 8,950** | **约 ¥43,100** |

> 如使用移民律师/中介：额外 AUD 3,000–8,000（约 ¥14,400–38,500）
    `,
  },
  {
    title: "五、申请时间线",
    content: `
\`\`\`
第 1-3 个月    完善英语成绩 → 备考雅思（如未达标）
第 2-4 个月    提交 ACS 职业评估（处理时间约 8-12 周）
第 4-5 个月    ACS 通过后提交 EOI（Skill Select 系统）
第 5-18 个月   等待邀请（EOI 有效期 2 年，按分数轮次邀请）
收到邀请后      60 天内提交完整签证申请
提交申请后      处理时间约 12-24 个月（2024年均值约 14 个月）
\`\`\`

**总计预估时间：18-36 个月**

> 优化建议：若英语已达标、ACS 顺利通过，最快可在 14 个月内获批。
    `,
  },
  {
    title: "六、主要风险与注意事项",
    content: `
**⚠️ 风险一（高）：EOI 评分不足**
当前 189 签证竞争激烈，分数线 85+ 且持续上升。您的预估分约 80 分，建议：
- 提升英语至 PTE/雅思各科 8+（可额外获 10 分 = 90 分）
- 同时申请州担保（190 签证），降低分数要求

**⚠️ 风险二（中）：职业评估复杂度**
ACS 对职业描述要求严格，工作内容需严格匹配 ICT 职业分类（ANZSCO 代码）。建议由有经验的律师协助准备工作证明信。

**⚠️ 风险三（低）：政策变动**
澳大利亚移民政策约 18-24 个月调整一次，建议保持关注 DoHA 官方公告。

**💡 个性化建议**
1. 立即备考英语（PTE 比雅思更稳定，软件工程师推荐 PTE）
2. 整理 8 年工作经历文档（详细的职责描述是 ACS 评估的关键）
3. 同时关注维州（VIC）和南澳（SA）190 项目的开放时间
4. 资产方面：建议准备等值 10 万澳元以上，提升签证通过率
5. 配偶可同时申请职业评估，额外可获 5 分 EOI 加分
    `,
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部横幅：这是示例页 */}
      <div className="bg-accent-600 text-white py-3 px-4 text-center text-sm font-medium">
        <span className="opacity-90">✨ 这是一份真实报告示例（数据已脱敏）—— </span>
        <Link href="/auth/login?mode=signup" className="font-bold underline underline-offset-2 hover:opacity-90 transition">
          免费注册即可生成您的专属报告 →
        </Link>
      </div>

      {/* 免责声明 */}
      <div className="bg-amber-50 border-b border-amber-100 py-3 px-4">
        <p className="max-w-4xl mx-auto text-amber-700 text-xs text-center">
          <strong>声明：</strong>以下内容由 AI 自动生成，仅供参考，不构成法律建议。签证政策随时可能变化，请在做出决策前咨询持牌移民律师。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 报告头部 */}
        <div className="bg-primary-900 text-white rounded-2xl p-8 mb-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="text-xs text-primary-400 uppercase tracking-widest mb-2">问签 AI 签证评估报告 · 示例</div>
              <h1 className="text-3xl font-extrabold mb-2">张某某的移民路径评估</h1>
              <p className="text-primary-300">
                中国公民 · 32岁 · 软件工程师 · 已婚 · 目标：澳大利亚
              </p>
              <p className="text-primary-500 text-sm mt-2">
                生成时间：2026-03-05 14:32 · 由 Claude AI 生成
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-white/10 rounded-xl px-5 py-4">
                <div className="text-3xl font-extrabold text-green-400 mb-1">高</div>
                <div className="text-xs text-primary-400">总体可行性</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl px-5 py-4">
                <div className="text-3xl font-extrabold text-accent-400 mb-1">3</div>
                <div className="text-xs text-primary-400">推荐路径</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl px-5 py-4">
                <div className="text-3xl font-extrabold text-blue-300 mb-1">~80</div>
                <div className="text-xs text-primary-400">EOI 评分</div>
              </div>
            </div>
          </div>

          {/* 关键信息卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 border-t border-white/10 pt-6">
            {[
              { label: "首选签证", value: "澳大利亚 189" },
              { label: "所需材料", value: "12 项" },
              { label: "总费用预估", value: "约 ¥4.3 万" },
              { label: "预计周期", value: "18-36 个月" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-primary-400 mb-1">{item.label}</div>
                <div className="font-bold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 报告正文 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10">
          {MOCK_REPORT_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="prose prose-sm prose-gray max-w-none">
                <PreformattedContent content={section.content} />
              </div>
            </div>
          ))}
        </div>

        {/* 底部 CTA */}
        <div className="mt-8 bg-primary-900 text-white rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-extrabold mb-2">想要看您自己的评估报告？</h2>
          <p className="text-primary-300 mb-6">
            免费注册，3 分钟内获取根据您真实情况生成的专属报告
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login?mode=signup"
              className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              免费注册，开始评估 →
            </Link>
            <Link
              href="/wizard"
              className="px-8 py-4 border-2 border-primary-500 text-primary-200 hover:border-white hover:text-white font-semibold rounded-xl text-lg transition-all"
            >
              已有账号？直接开始
            </Link>
          </div>
          <p className="text-primary-500 text-sm mt-4">无需信用卡 · 注册即赠 3 次完整评估</p>
        </div>
      </div>
    </div>
  );
}

// 简单的 Markdown-like 渲染组件（避免引入客户端依赖）
function PreformattedContent({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 表格
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headerCells = tableLines[0].split("|").filter((c) => c.trim());
      const bodyRows = tableLines.slice(2).map((r) => r.split("|").filter((c) => c.trim()));
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {headerCells.map((cell, ci) => (
                  <th key={ci} className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-gray-200 px-3 py-2 text-gray-600">
                      <InlineMarkdown text={cell.trim()} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 代码块
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <pre key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 overflow-x-auto my-4 whitespace-pre-wrap font-mono">
          {codeLines.join("\n")}
        </pre>
      );
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-gray-900 mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // H4
    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="text-sm font-bold text-gray-700 mt-4 mb-2 uppercase tracking-wide">
          {line.slice(5)}
        </h4>
      );
      i++;
      continue;
    }

    // 列表项
    if (line.match(/^[-*] /) || line.match(/^\[ \] /) || line.match(/^\[x\] /)) {
      const listLines: string[] = [];
      while (i < lines.length && (lines[i].match(/^[-*] /) || lines[i].match(/^\[[ x]\] /))) {
        listLines.push(lines[i]);
        i++;
      }
      elements.push(
        <ul key={i} className="space-y-1.5 my-3">
          {listLines.map((l, li) => {
            const isCheckbox = l.match(/^\[[ x]\] /);
            const checked = l.startsWith("[x]");
            const text = isCheckbox ? l.slice(4) : l.slice(2);
            return (
              <li key={li} className="flex items-start gap-2 text-gray-600 text-sm">
                {isCheckbox ? (
                  <span className={`mt-0.5 flex-shrink-0 w-4 h-4 border rounded text-xs flex items-center justify-center ${checked ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}>
                    {checked ? "✓" : ""}
                  </span>
                ) : (
                  <span className="mt-1.5 w-1.5 h-1.5 bg-accent-500 rounded-full flex-shrink-0" />
                )}
                <InlineMarkdown text={text} />
              </li>
            );
          })}
        </ul>
      );
      continue;
    }

    // 引用
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-amber-400 bg-amber-50 px-4 py-3 rounded-r-lg my-4">
          <p className="text-amber-800 text-sm"><InlineMarkdown text={line.slice(2)} /></p>
        </blockquote>
      );
      i++;
      continue;
    }

    // 分隔线
    if (line === "---") {
      elements.push(<hr key={i} className="border-gray-100 my-6" />);
      i++;
      continue;
    }

    // 空行
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 普通段落
    elements.push(
      <p key={i} className="text-gray-600 text-sm leading-relaxed my-2">
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function InlineMarkdown({ text }: { text: string }) {
  // 处理 **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
