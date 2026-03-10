import { WizardFormData } from "@/types";

export function buildSystemPrompt(): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

  return `您好！我是您专属的问签AI顾问。我的任务是根据您提供的背景信息，分析适合的签证路径，为您提供专业、实用的参考信息。

重要说明：
- 我只能提供信息参考，不能提供法律建议
- 所有费用和时间线为估算，请以官方最新信息为准
- 请用中文回答，语言亲切专业，结构清晰，全程使用"您"称呼用户

本报告基于截至 ${dateStr} 的公开政策信息生成，具体以各国官方网站最新要求为准。

输出格式要求：严格按照以下 Markdown 结构输出，不要遗漏任何部分。`;
}

export function buildUserPrompt(data: WizardFormData): string {
  const targetCountriesStr = data.targetCountries.join("、");
  const spouseStr = data.hasSpouse ? "有配偶" : "无配偶";
  const childrenStr = data.hasChildren ? "有子女" : "无子女";

  return `请根据以下用户信息，为其分析最适合的移民签证路径，并按指定格式输出详细分析报告：

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

（在此处写免责声明，提醒用户 AI 内容仅供参考，重大决策请咨询持牌移民律师或注册移民顾问）

## 📊 签证成功率参考

根据目标国家和申请人背景，列出 2-3 条主要签证路径的近期整体通过率。数据来源于各国移民局公开年报或权威统计，仅供参考，个人结果受具体条件影响。格式如下：

| 签证路径 | 近期整体通过率 | 说明 |
|---------|------------|------|
| （签证名称） | 约 xx% | （简要说明，如抽签制/打分制） |

## ✅ 推荐签证路径

（列出 1-3 个最适合的签证类型，每个路径包含以下内容）

### 路径一：（签证名称）

- **适用原因**：（为何适合该申请人）
- **核心优势**：（该签证的主要吸引点）
- **匹配度**：xx%（根据申请人背景与该签证要求的综合契合程度）
- **拒签风险分析**：列举 2-3 个当前申请的主要薄弱点（如语言成绩偏低、资金证明不足、工作经验年限不足等），并给出改善建议
- **预计整体周期**：从开始准备材料到收到签证结果的预估时间范围

## 📝 申请材料清单

（生成一个详细的 Checklist，用 - [ ] 格式列出所需材料）

## 💰 费用预估

（列出官方申请费 + 建议预留的律师/中介费参考范围，注明均为估算）

## ⏳ 预计时间线

（提供从准备材料到获批的大致时间周期，分阶段说明）

## 💡 个性化建议

（根据用户的具体情况，给出 2-3 条实用的行动建议）`;
}
