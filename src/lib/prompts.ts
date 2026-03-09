import { WizardFormData } from "@/types";

export function buildSystemPrompt(): string {
  return `你是一个专业的移民签证顾问 AI，名字叫"前程助手"。你的任务是根据用户提供的背景信息，分析适合的签证路径，提供专业、实用的参考信息。

重要说明：
- 你只能提供信息参考，不能提供法律建议
- 所有费用和时间线为估算，请用户以官方最新信息为准
- 请用中文回答，语言口语化、亲切，结构清晰

输出格式要求：严格按照以下 Markdown 结构输出，不要遗漏任何部分。`;
}

export function buildUserPrompt(data: WizardFormData): string {
  const targetCountriesStr = data.targetCountries.join("、");
  const spouseStr = data.hasSpouse ? "有配偶" : "无配偶";
  const childrenStr = data.hasChildren ? "有子女" : "无子女";

  return `请根据以下用户信息，为我分析最适合的移民签证路径，并按指定格式输出详细分析报告：

【基本信息】
- 国籍：${data.nationality}
- 目标移民国家/地区：${targetCountriesStr}
- 年龄：${data.age} 岁
- 最高学历：${data.education}

【职业与经济背景】
- 职业领域：${data.career}
- 年收入范围（人民币）：${data.income}
- 家庭状况：${spouseStr}，${childrenStr}

【移民意向】
- 主要目的：${data.purpose}
- 可用预算（人民币）：${data.budget}
- 是否考虑投资移民：${data.willInvest}

请按以下格式输出分析报告：

## 🔴 风险提示

（在此处写免责声明，提醒用户 AI 内容仅供参考，重大决策请咨询持牌移民律师）

## ✅ 推荐签证路径

（列出 1-2 个最适合的签证类型，每个包含：签证名称、适用原因、核心优势）

## 📝 申请材料清单

（生成一个详细的 Checklist，用 - [ ] 格式列出所需材料）

## 💰 费用预估

（列出官方申请费 + 建议预留的律师/中介费参考范围，注明均为估算）

## ⏳ 预计时间线

（提供从准备材料到获批的大致时间周期，分阶段说明）

## 💡 个性化建议

（根据用户的具体情况，给出 2-3 条实用的行动建议）`;
}
