### 🚀 系统设计说明书 (System Design Spec)  
  
**任务：** 请作为资深全栈开发工程师，使用 Next.js 14 (App Router)、Supabase 和 Tailwind CSS，开发一个"移民签证AI顾问平台"的 MVP 版本。  
  
#### 1. 项目核心约束 (Constraints)  
  
- **隐私原则：** 绝对**不**允许用户上传 PDF/图片文件。用户只能通过文本输入（表单或对话）提供信息。  
- **技术栈：**  
    - 前端：Next.js 14 (App Router), React, Tailwind CSS  
    - 后端：Next.js API Routes (Server Actions)  
    - 数据库：Supabase (PostgreSQL)  
    - AI 模型：`claude-sonnet-4-5`（通过官方 Anthropic SDK 调用）
    <!-- ✏️ 修改1：更新为当前可用的模型版本，避免使用已废弃的 claude-3.5-sonnet -->
- **交互模式：** 采用"向导式"表单收集信息，最后一步触发 AI 生成报告。  
  
#### 2. 数据库 Schema (Supabase)  
  
请生成对应的 Supabase 表结构 SQL 语句：  

> ⚠️ **安全要求：所有表必须启用 Row Level Security (RLS)，确保用户只能读写自己的数据。**
> <!-- ✏️ 修改2：新增 RLS 要求，防止 credits 被未授权篡改 -->
  
- **Table:** `users`  
    - `id` (UUID, PK)  
    - `email` (Text, Unique)  
    - `credits` (Integer, 默认 3) -- 用于免费试用机制  
    - RLS Policy：用户只能查询和更新自己的行（`auth.uid() = id`）
- **Table:** `consultations`  
    - `id` (UUID, PK)  
    - `user_id` (UUID, FK to users.id)  
    - `input_data` (JSONB) -- 存储用户填写的原始数据  
    - `ai_response` (Text) -- 存储 AI 生成的 Markdown 报告  
    - `visa_type` (Text)  
    - `created_at` (Timestamp)  
    - RLS Policy：用户只能查询和插入自己的行（`auth.uid() = user_id`）
  
#### 3. 核心功能模块：签证路径评估向导 (Visa Wizard)  
  
这是一个多步骤表单（Step 1 -> Step 2 -> Step 3 -> 结果）。  
  
- **Step 1: 用户画像 (User Profile)**  
    - 字段：国籍（下拉框，默认中国）、目标国家（多选：美国/加拿大/澳洲/其他）、年龄、最高学历。  
- **Step 2: 职业与资产 (Background)**  
    - 字段：职业领域（IT/金融/艺术/医疗等）、年收入范围（区间选择）、是否有配偶/子女。  
- **Step 3: 移民意向 (Intent)**  
    - 字段：主要目的（工作/定居/留学）、预算范围（低/中/高）、是否愿意投资。  
  
#### 4. AI 交互逻辑 (The Brain)  
  
当用户点击"生成评估报告"时，执行以下逻辑：  
  
1. **Prompt 构建：**  
    - **System Prompt:** "你是一个专业的移民签证顾问 AI。你的任务是根据用户提供的背景信息，分析适合的签证路径。**注意：你不能提供法律建议，只能提供信息参考。** 请用中文口语化回答，结构清晰。"  
    - **User Prompt:** 结合数据库中的 `input_data`，构建一个结构化的查询。  
2. **AI 回答结构 (Output Format):**  
AI 必须返回 Markdown 格式，包含以下部分：  
    - **🔴 风险提示：** "免责声明：AI 生成内容仅供参考，不构成法律建议，请以官方解释为准。"  
    - **✅ 推荐路径：** 列出 1-2 个最适合的签证类型，并说明理由。  
    - **📝 材料清单：** 生成一个简单的 Checklist (例如：护照、照片、资产证明)。  
    - **💰 费用预估：** 官方费用 + 建议的中介/律师参考费。  
    - **⏳ 时间线：** 预计处理周期。  
  
#### 5. 页面 UI/UX 要求  
  
- **布局：** 使用 Tailwind CSS，移动端优先（响应式）。  
- **配色：** 专业感（深蓝/海军蓝为主色调，代表信任；搭配橙色作为 CTA 按钮颜色，代表活力）。  
- **组件：**  
    - 顶部导航栏（包含 Logo 和 "我的报告" 链接）。  
    - 侧边栏进度条（显示当前步骤 1/3）。  
    - 结果页顶部必须固定显示免责声明横幅，样式为醒目的黄色警告条，内容为：「⚠️ 本报告由 AI 生成，仅供参考，不构成任何法律建议。重大决策请咨询持牌移民律师。」
    <!-- ✏️ 修改5：新增前端免责声明展示要求，与后端 Prompt 形成双重保障 -->
    - 结果页需要有一个"复制报告"按钮和"导出 PDF"按钮。
      - PDF 导出使用 `html2pdf.js` 实现客户端导出，无需后端参与。
      <!-- ✏️ 修改4：明确 PDF 导出库，避免 Claude Code 使用质量不稳定的方案 -->
  
#### 6. API 接口定义  
  
请创建一个 API Route: `app/api/analyze/route.ts`  
  
- **Method:** POST  
- **Input:** JSON (包含用户填写的所有表单数据)  
- **Process:**  
    1. 检查用户积分 (`credits`) 是否大于 0，若不足则直接返回 402 错误。
    2. 调用 Anthropic SDK **流式传输 (Streaming)** 将 AI 结果实时返回给前端。
    3. 流式传输**完成后**，将完整的 AI 响应内容一次性保存到 Supabase，并扣除 1 次积分。
    <!-- ✏️ 修改3：明确"流式结束后再保存"的顺序，避免并发写入导致保存内容不完整 -->
- **Output:** 返回 AI 的流式响应数据（`text/event-stream`）。  
  
#### 7. 错误处理  
  
- 必须处理 API Key 过期、积分不足、模型超时等异常情况。  
- 前端需有友好的 Toast 提示。  
