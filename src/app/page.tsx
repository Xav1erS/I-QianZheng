import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-700/50 border border-primary-600 text-primary-200 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI 驱动 · 智能分析 · 仅供参考
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            您的移民之路
            <br />
            <span className="text-accent-400">从这里开始</span>
          </h1>

          <p className="text-primary-200 text-xl md:text-2xl mb-4 max-w-2xl mx-auto leading-relaxed">
            3 步填写基本信息，AI 即刻分析最适合您的签证路径
          </p>
          <p className="text-primary-400 text-sm mb-10">
            ⚠️ AI 内容仅供参考，不构成法律建议
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wizard"
              className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
            >
              立即免费评估 →
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 border-2 border-primary-400 text-primary-200 hover:border-white hover:text-white font-semibold rounded-xl text-lg transition-all"
            >
              注册账号（赠 3 次）
            </Link>
          </div>

          <p className="text-primary-500 text-sm mt-6">
            注册即赠 3 次免费评估 · 无需信用卡
          </p>
        </div>
      </section>

      {/* 功能特点 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择移·前程？
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              我们利用 AI 技术，将复杂的移民流程转化为清晰可操作的路径
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI 智能分析",
                desc: "基于 Claude AI 大模型，综合分析您的背景、目标和预算，生成个性化评估报告",
              },
              {
                icon: "🔒",
                title: "隐私优先",
                desc: "仅需文字输入，无需上传任何证件或个人文件，保护您的隐私安全",
              },
              {
                icon: "⚡",
                title: "即时生成",
                desc: "填写 3 步表单，AI 即刻分析，分钟内获取包含推荐路径、材料清单和费用预估的完整报告",
              },
              {
                icon: "📋",
                title: "结构化报告",
                desc: "报告包含风险提示、推荐路径、材料清单、费用预估、时间线和个性化建议",
              },
              {
                icon: "📤",
                title: "导出分享",
                desc: "支持一键导出 PDF 或复制报告内容，方便与家人或律师分享讨论",
              },
              {
                icon: "📊",
                title: "历史记录",
                desc: "所有评估报告永久保存，随时查看历史记录，方便对比不同方案",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3 步获取您的评估报告
            </h2>
          </div>

          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {[
              {
                step: "01",
                title: "填写用户画像",
                desc: "告诉我们您的国籍、目标国家、年龄和学历",
              },
              {
                step: "02",
                title: "职业与资产背景",
                desc: "填写您的职业领域、年收入范围和家庭状况",
              },
              {
                step: "03",
                title: "获取 AI 报告",
                desc: "选择移民目的和预算，AI 即刻生成个性化评估报告",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  {item.step}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200" />
                )}
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 免责声明 */}
      <section className="bg-yellow-50 border-t border-yellow-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-yellow-800 text-sm">
            <strong>⚠️ 重要声明：</strong>
            移·前程提供的所有内容均由 AI 自动生成，仅作为参考信息，
            不构成法律建议或移民服务。签证政策及要求随时可能变化，
            在做出任何移民决策前，请务必咨询持牌移民律师或认证移民顾问。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            开始您的移民之旅
          </h2>
          <p className="text-primary-300 text-lg mb-8">
            注册即赠 3 次免费 AI 评估，无需信用卡
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-10 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-xl transition-all shadow-lg hover:shadow-xl"
          >
            免费注册，立即开始
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© 2026 移·前程 (iqianzheng.com) · AI 内容仅供参考，不构成法律建议</p>
      </footer>
    </div>
  );
}
