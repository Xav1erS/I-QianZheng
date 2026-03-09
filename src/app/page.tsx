import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-700/50 border border-primary-600 text-primary-200 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI 驱动 · 个性化分析 · 即时生成
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            签证路径，问问 AI
            <br />
            <span className="text-accent-400">3步获取专属报告</span>
          </h1>

          <p className="text-primary-200 text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
            填写您的背景信息，AI 智能匹配最适合的签证路径，
            <br className="hidden md:block" />
            生成包含材料清单、费用预估和时间线的完整报告
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wizard"
              className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              立即免费评估 →
            </Link>
            <Link
              href="/auth/login?mode=signup"
              className="px-8 py-4 border-2 border-primary-400 text-primary-200 hover:border-white hover:text-white font-semibold rounded-xl text-lg transition-all"
            >
              注册账号（赠 3 次）
            </Link>
          </div>

          <p className="text-primary-500 text-sm mt-6">
            注册即赠 3 次免费评估 · 无需信用卡 · AI 内容仅供参考，不构成法律建议
          </p>
        </div>
      </section>

      {/* 报告包含内容预览 */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">报告包含</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              一份报告，覆盖您需要知道的一切
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "🛂", label: "推荐签证路径" },
              { icon: "📋", label: "所需材料清单" },
              { icon: "💰", label: "费用预估明细" },
              { icon: "⏱️", label: "申请时间线" },
              { icon: "⚠️", label: "风险点提示" },
              { icon: "💡", label: "个性化建议" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700 text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能特点 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">为什么选择问签</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              专业、快速、私密
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              AI 技术将复杂的移民流程转化为清晰可操作的路径
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "Claude AI 驱动",
                desc: "基于 Anthropic Claude 大模型，综合分析您的国籍、职业、预算和家庭情况，生成高度个性化的评估报告",
              },
              {
                icon: "🔒",
                title: "无需上传证件",
                desc: "仅需文字填写，无需上传护照、银行流水等任何敏感文件，全程保护您的隐私安全",
              },
              {
                icon: "⚡",
                title: "60 秒内出报告",
                desc: "填写 3 步表单，AI 即刻分析。支持导出 PDF、复制分享，方便与家人或律师讨论",
              },
              {
                icon: "🌏",
                title: "覆盖主流目的地",
                desc: "支持澳大利亚、加拿大、美国、英国、新西兰、新加坡等热门移民目的地，一次评估多方对比",
              },
              {
                icon: "📊",
                title: "历史报告保存",
                desc: "所有评估报告永久保存，随时查看历史记录，方便对比不同时期的方案差异",
              },
              {
                icon: "💸",
                title: "免费开始使用",
                desc: "注册即赠 3 次免费评估，无需信用卡。帮助您在咨询律师前，先了解自己的大致选项",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
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
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">使用流程</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3 步获取您的专属评估报告
            </h2>
            <p className="text-gray-500">整个过程不超过 5 分钟</p>
          </div>

          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {[
              {
                step: "01",
                title: "填写基本画像",
                desc: "国籍、目标国家、年龄、学历，快速勾选即可",
                time: "约 1 分钟",
              },
              {
                step: "02",
                title: "职业与家庭背景",
                desc: "职业领域、年收入范围、婚姻和子女情况",
                time: "约 1 分钟",
              },
              {
                step: "03",
                title: "获取 AI 报告",
                desc: "选择移民目的和预算，AI 60 秒内生成专属报告",
                time: "约 60 秒",
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
                <p className="text-gray-500 text-sm mb-2">{item.desc}</p>
                <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-full">
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/wizard"
              className="inline-block px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              现在就开始 →
            </Link>
          </div>
        </div>
      </section>

      {/* 免责声明 */}
      <section className="bg-yellow-50 border-t border-yellow-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-yellow-800 text-sm">
            <strong>⚠️ 重要声明：</strong>
            问签提供的所有内容均由 AI 自动生成，仅作为参考信息，不构成法律建议或移民服务。
            签证政策及要求随时可能变化，在做出任何移民决策前，请务必咨询持牌移民律师或认证移民顾问。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            先了解选项，再咨询律师
          </h2>
          <p className="text-primary-300 text-lg mb-8">
            免费获取 3 次 AI 评估，用数据支撑你的移民决策
          </p>
          <Link
            href="/auth/login?mode=signup"
            className="inline-block px-10 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            免费注册，立即开始
          </Link>
          <p className="text-primary-500 text-sm mt-4">无需信用卡 · 注册即用</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-bold text-lg mb-1">问签</p>
              <p className="text-gray-500 text-sm">你的 AI 签证顾问</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/wizard" className="hover:text-white transition">开始评估</Link>
              <Link href="/history" className="hover:text-white transition">我的报告</Link>
              <Link href="/auth/login" className="hover:text-white transition">登录 / 注册</Link>
            </nav>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-600">
            © 2026 问签 (iqianzheng.com) · AI 内容仅供参考，不构成法律建议
          </div>
        </div>
      </footer>
    </div>
  );
}
