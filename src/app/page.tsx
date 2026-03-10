import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ===== Screen 1: Hero ===== */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-600/20 via-primary-800/0 to-primary-900/0 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center">
            {/* AI 标识徽章 */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-primary-200 text-sm px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
              <span>由 Claude AI 驱动 · 60秒生成专属报告 · 无需上传证件</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              签证路径
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
                问问 AI
              </span>
            </h1>

            <p className="text-primary-200 text-xl md:text-2xl mb-10 max-w-xl mx-auto leading-relaxed">
              输入您的背景，AI 综合分析 30+ 维度，
              <br className="hidden md:block" />
              生成个性化签证路径与完整申请方案
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/wizard"
                className="group px-10 py-5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-2xl text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                免费开始评估
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <p className="text-primary-500 text-sm">
              注册即赠 3 次评估 · 无需信用卡 · AI 内容仅供参考，不构成法律建议
            </p>
          </div>

          {/* 统计数据栏 */}
          <div className="mt-20 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto border-t border-white/10 pt-10">
            {[
              { num: "6+", label: "目标国家覆盖" },
              { num: "30+", label: "分析维度" },
              { num: "60s", label: "报告生成速度" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.num}</div>
                <div className="text-primary-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Screen 2: AI 能力展示 ===== */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">
              AI 如何工作
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              不是模板，而是真正的个性化分析
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              问签基于 Claude AI，根据您的具体情况进行推理，而不是套用固定模板
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🧠",
                title: "多维度综合分析",
                desc: "综合国籍、学历、职业、收入、家庭状况、预算、时间线等 30+ 维度，精准匹配签证路径",
                highlight: "30+ 维度",
              },
              {
                icon: "🌏",
                title: "多国横向对比",
                desc: "一次填写，AI 同步评估澳大利亚、加拿大、美国、英国等主流目的地的可行性",
                highlight: "6+ 国家",
              },
              {
                icon: "📋",
                title: "完整申请方案",
                desc: "不只是说\"你适合某签证\"，而是给出材料清单、费用预估、时间线和具体建议",
                highlight: "即时可用",
              },
              {
                icon: "🔒",
                title: "隐私优先",
                desc: "仅需文字填写，无需上传护照、银行流水等任何敏感证件",
                highlight: "零上传",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <div className="inline-block text-xs font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full mb-3">
                  {card.highlight}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Screen 3: 使用流程 ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">
              3 步流程
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              5 分钟内，获取专属路径
            </h2>
          </div>

          <div className="relative">
            {/* 连接线（桌面端） */}
            <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-accent-200 via-accent-400 to-accent-200" />

            <div className="grid md:grid-cols-3 gap-10 relative">
              {[
                {
                  step: "01",
                  title: "填写背景信息",
                  desc: "国籍、年龄、学历、目标国家，快速勾选，无需繁琐填写",
                  detail: ["国籍 & 目标国", "年龄 & 学历", "职业 & 收入"],
                  time: "约 1 分钟",
                },
                {
                  step: "02",
                  title: "补充家庭与财务",
                  desc: "婚姻状况、子女情况、可用资产与移民预算",
                  detail: ["婚姻 & 子女", "资产范围", "预算 & 时间线"],
                  time: "约 1 分钟",
                },
                {
                  step: "03",
                  title: "AI 生成专属报告",
                  desc: "60秒内，Claude AI 输出包含签证路径、材料清单、费用预估的完整方案",
                  detail: ["推荐签证路径", "所需材料清单", "费用 & 时间线"],
                  time: "约 60 秒",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-primary-900 text-white rounded-full flex items-center justify-center text-3xl font-extrabold mb-6 shadow-xl relative z-10">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.desc}</p>
                  <ul className="space-y-1.5 text-left w-full max-w-[180px]">
                    {item.detail.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-accent-500 rounded-full flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 text-xs text-accent-700 font-semibold bg-accent-50 px-3 py-1 rounded-full">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              开始 3 步评估 →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Screen 4: 报告示例预览 ===== */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">
              报告示例
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              一份报告，覆盖所有决策关键点
            </h2>
            <p className="text-gray-500 text-lg">
              真实 AI 生成报告示例（数据已脱敏）
            </p>
          </div>

          {/* Mock 报告预览卡 */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* 报告头部 */}
            <div className="bg-primary-900 text-white px-8 py-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-primary-400 mb-1 uppercase tracking-wide">AI 分析报告</div>
                  <h3 className="text-2xl font-bold mb-1">张某某的移民路径评估</h3>
                  <p className="text-primary-300 text-sm">中国公民 · 32岁 · 软件工程师 · 目标：澳大利亚</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className="text-center bg-white/10 rounded-xl px-4 py-3 min-w-[80px]">
                    <div className="text-2xl font-bold text-green-400">高</div>
                    <div className="text-xs text-primary-400 mt-0.5">可行性</div>
                  </div>
                  <div className="text-center bg-white/10 rounded-xl px-4 py-3 min-w-[80px]">
                    <div className="text-2xl font-bold text-accent-400">3</div>
                    <div className="text-xs text-primary-400 mt-0.5">推荐路径</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 报告内容预览 */}
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    label: "首选推荐",
                    value: "澳大利亚 189 独立技术移民",
                    tag: "最优路径",
                    tagColor: "bg-green-100 text-green-700",
                  },
                  {
                    label: "备选方案",
                    value: "澳大利亚 482 技术工作签证",
                    tag: "快速通道",
                    tagColor: "bg-blue-100 text-blue-700",
                  },
                  {
                    label: "长期规划",
                    value: "加拿大联邦快速通道 (EE)",
                    tag: "备用选项",
                    tagColor: "bg-gray-100 text-gray-600",
                  },
                ].map((item) => (
                  <div key={item.label} className="border border-gray-100 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-2">{item.label}</div>
                    <div className="font-semibold text-gray-900 text-sm mb-2">{item.value}</div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* 报告模块预览 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {[
                  { icon: "📋", label: "所需材料清单", count: "12 项" },
                  { icon: "💰", label: "费用预估明细", count: "AUD 7,200" },
                  { icon: "⏱️", label: "预计申请时间", count: "12-18 个月" },
                  { icon: "⚠️", label: "主要风险提示", count: "3 条" },
                  { icon: "💡", label: "个性化建议", count: "5 条" },
                  { icon: "📊", label: "成功率评估", count: "75-85%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-800">{item.count}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold transition group"
                >
                  查看完整示例报告
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Screen 5: 定价 ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">
              透明定价
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              先免费体验，满意再付费
            </h2>
            <p className="text-gray-500 text-lg">注册即赠 3 次完整评估，无需信用卡</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "免费体验",
                price: "¥0",
                period: "注册赠送",
                desc: "新用户注册即获",
                credits: "3 次评估",
                features: ["完整 AI 分析报告", "所有签证类型", "PDF 导出", "历史报告保存"],
                cta: "免费注册",
                href: "/auth/login?mode=signup",
                featured: false,
              },
              {
                name: "进阶套餐",
                price: "¥49",
                period: "一次性",
                desc: "适合认真规划者",
                credits: "10 次评估",
                features: ["完整 AI 分析报告", "所有签证类型", "PDF 导出", "历史报告保存", "优先生成队列"],
                cta: "立即购买",
                href: "/auth/login?mode=signup",
                featured: true,
                badge: "最受欢迎",
              },
              {
                name: "专业套餐",
                price: "¥99",
                period: "一次性",
                desc: "适合家庭或多方案对比",
                credits: "30 次评估",
                features: ["完整 AI 分析报告", "所有签证类型", "PDF 导出", "历史报告保存", "优先生成队列", "多成员共享"],
                cta: "立即购买",
                href: "/auth/login?mode=signup",
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all ${
                  plan.featured
                    ? "border-accent-400 bg-primary-900 text-white shadow-2xl scale-[1.02]"
                    : "border-gray-200 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <div className={`text-sm font-semibold mb-1 ${plan.featured ? "text-accent-300" : "text-gray-500"}`}>
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-extrabold ${plan.featured ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.featured ? "text-primary-400" : "text-gray-400"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${plan.featured ? "text-accent-300" : "text-accent-600"}`}>
                    {plan.credits}
                  </div>
                  <div className={`text-sm ${plan.featured ? "text-primary-400" : "text-gray-500"}`}>
                    {plan.desc}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className={`text-base flex-shrink-0 ${plan.featured ? "text-accent-400" : "text-green-500"}`}>✓</span>
                      <span className={plan.featured ? "text-primary-200" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full text-center px-6 py-3 rounded-xl font-bold transition-all ${
                    plan.featured
                      ? "bg-accent-500 hover:bg-accent-600 text-white shadow-lg"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            付费功能即将上线 · 目前仅需免费注册即可获得 3 次完整评估
          </p>
        </div>
      </section>

      {/* 免责声明 */}
      <section className="bg-amber-50 border-t border-amber-100 py-5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-700 text-sm">
            <strong>重要声明：</strong>
            问签提供的所有内容均由 AI 自动生成，仅作为参考信息，不构成法律建议或移民服务。
            签证政策随时可能变化，请在做出任何移民决策前咨询持牌移民律师或认证移民顾问。
          </p>
        </div>
      </section>

      {/* Footer CTA + Footer */}
      <section className="py-24 bg-primary-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            先了解选项
            <br />
            <span className="text-accent-400">再咨询律师</span>
          </h2>
          <p className="text-primary-300 text-xl mb-10">
            用 AI 做功课，让专业咨询事半功倍
          </p>
          <Link
            href="/auth/login?mode=signup"
            className="inline-flex items-center gap-2 px-12 py-5 bg-accent-500 hover:bg-accent-600 text-white font-extrabold rounded-2xl text-xl transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1"
          >
            免费注册，立即开始
          </Link>
          <p className="text-primary-500 text-sm mt-5">无需信用卡 · 注册即获 3 次免费评估</p>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-bold text-lg mb-1">问签</p>
              <p className="text-gray-500 text-sm">你的 AI 签证顾问</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/wizard" className="hover:text-white transition">开始评估</Link>
              <Link href="/demo" className="hover:text-white transition">示例报告</Link>
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
