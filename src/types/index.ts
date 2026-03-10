// 向导表单数据类型
export interface WizardFormData {
  // Step 1: 用户画像
  nationality: string;
  targetCountries: string[];
  age: number;
  education: string;

  // Step 2: 职业与资产
  career: string;
  income: string;
  hasSpouse: boolean;
  hasChildren: boolean;

  // Step 3: 移民意向
  purpose: string;
  budget: string;
  willInvest: string;
}

// 咨询记录状态
export type ConsultationStatus = "pending" | "completed" | "failed";

// 咨询记录类型
export interface Consultation {
  id: string;
  user_id: string;
  input_data: WizardFormData;
  ai_response: string | null;
  visa_type: string | null;
  status: ConsultationStatus;
  created_at: string;
}

// 用户信息类型
export interface UserProfile {
  id: string;
  email: string;
  credits: number;
  created_at: string;
}

// Step 1 选项
export const NATIONALITY_OPTIONS = [
  { value: "中国", label: "中国" },
  { value: "印度", label: "印度" },
  { value: "菲律宾", label: "菲律宾" },
  { value: "越南", label: "越南" },
  { value: "韩国", label: "韩国" },
  { value: "日本", label: "日本" },
  { value: "巴基斯坦", label: "巴基斯坦" },
  { value: "墨西哥", label: "墨西哥" },
  { value: "其他", label: "其他" },
];

export const TARGET_COUNTRY_OPTIONS = [
  { value: "美国", label: "🇺🇸 美国" },
  { value: "加拿大", label: "🇨🇦 加拿大" },
  { value: "澳大利亚", label: "🇦🇺 澳大利亚" },
  { value: "英国", label: "🇬🇧 英国" },
  { value: "新西兰", label: "🇳🇿 新西兰" },
  { value: "新加坡", label: "🇸🇬 新加坡" },
  { value: "其他", label: "🌍 其他" },
];

export const EDUCATION_OPTIONS = [
  { value: "高中及以下", label: "高中及以下" },
  { value: "大专/职业教育", label: "大专/职业教育" },
  { value: "本科", label: "本科" },
  { value: "硕士", label: "硕士" },
  { value: "博士", label: "博士" },
];

// Step 2 选项
export const CAREER_OPTIONS = [
  { value: "IT/软件/互联网", label: "IT/软件/互联网" },
  { value: "金融/银行/投资", label: "金融/银行/投资" },
  { value: "医疗/健康", label: "医疗/健康" },
  { value: "教育/学术", label: "教育/学术" },
  { value: "艺术/设计/媒体", label: "艺术/设计/媒体" },
  { value: "工程/制造", label: "工程/制造" },
  { value: "商业/管理", label: "商业/管理" },
  { value: "法律/法务", label: "法律/法务" },
  { value: "其他", label: "其他" },
];

export const INCOME_OPTIONS = [
  { value: "5万以下", label: "5万元以下" },
  { value: "5-15万", label: "5-15万元" },
  { value: "15-30万", label: "15-30万元" },
  { value: "30-50万", label: "30-50万元" },
  { value: "50万以上", label: "50万元以上" },
];

// Step 3 选项
export const PURPOSE_OPTIONS = [
  { value: "工作/职业发展", label: "工作/职业发展" },
  { value: "永久定居", label: "永久定居" },
  { value: "留学/教育", label: "留学/教育" },
  { value: "投资/创业", label: "投资/创业" },
  { value: "家庭团聚", label: "家庭团聚" },
];

export const BUDGET_OPTIONS = [
  { value: "低（5万以下）", label: "低（5万元以下）" },
  { value: "中（5-20万）", label: "中（5-20万元）" },
  { value: "高（20万以上）", label: "高（20万元以上）" },
];

export const WILL_INVEST_OPTIONS = [
  { value: "是，愿意投资", label: "是，愿意考虑" },
  { value: "否，不考虑", label: "否，不考虑" },
  { value: "待定，需了解更多", label: "待定，需了解更多" },
];
