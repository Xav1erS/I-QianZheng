import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* 背景光晕 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-accent-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          {/* 顶部徽章 */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm px-4 py-1.5 rounded-full mb-10 shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
            由 Claude AI 驱动 · 无需上传任何证件
          </div>

          {/* 主标题 */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6">
            移民签证路径
            <br />
            <span className="text-primary-600">AI 深度分析</span>
          </h1>

          <p className="text-gray-500 text-xl md:text-2xl mb-10 max-w-xl mx-auto leading-relaxed">
            填写背景信息，AI 3 分钟生成
            <br className="hidden sm:block" />
            个性化签证路径与完整申请方案
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              href="/wizard"
              className="group inline-flex items-center justify-center gap-2 px-9 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              免费开始评估
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl text-lg transition-all hover:border-gray-300 hover:shadow-md"
            >
              查看示例报告
            </Link>
          </div>

          <p className="text-gray-400 text-sm">注册即赠 3 次完整评估 · AI 内容仅供参考，不构成法律建议</p>

          {/* 数字亮点 */}
          <div className="mt-16 pt-10 border-t border-gray-100 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { num: "¥0", desc: "注册即用" },
              { num: "3 min", desc: "填写时间" },
              { num: "60 s", desc: "AI 报告生成" },
            ].map((s) => (
              <div key={s.desc} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900">{s.num}</div>
                <div className="text-gray-400 text-sm mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 功能亮点 ===== */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-widest">AI 能力</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">不是模板，是真正的个性化分析</h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              问签基于 Claude AI，针对您的具体情况推理，而非套用固定公式
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                badge: "30+ 维度",
                title: "综合多维分析",
                desc: "国籍、年龄、学历、职业、收入、家庭、预算 — 精准匹配每条签证路径",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                badge: "6+ 国家",
                title: "多国横向对比",
                desc: "一次填写，AI 同步评估澳大利亚、加拿大、美国、英国等主流目的地",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                badge: "即时可用",
                title: "完整申请方案",
                desc: "材料清单、费用预估、时间线、风险分析 — 一份报告覆盖所有决策关键点",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                badge: "零上传",
                title: "隐私优先",
                desc: "仅需文字填写，无需上传护照、银行流水等任何敏感证件",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-primary-100 rounded-2xl p-6 transition-all hover:shadow-md"
              >
                <div className="w-11 h-11 bg-white group-hover:bg-primary-50 border border-gray-100 rounded-xl flex items-center justify-center text-primary-600 mb-4 transition-colors shadow-sm">
                  {card.icon}
                </div>
                <span className="inline-block text-xs font-bold text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded-full mb-3">
                  {card.badge}
                </span>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 使用流程 ===== */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-widest">3 步流程</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">5 分钟内，获取专属路径</h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* 连接线 */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

            {[
              {
                num: "01",
                title: "填写基本信息",
                desc: "国籍、年龄、目标国家、学历，快速卡片选择，约 1 分钟",
                tags: ["国籍 & 目标国", "年龄 & 学历"],
              },
              {
                num: "02",
                title: "补充职业背景",
                desc: "职业领域、收入范围、婚姻状况和移民意向预算，约 1 分钟",
                tags: ["职业 & 收入", "预算 & 意向"],
              },
              {
                num: "03",
                title: "获取 AI 专属报告",
                desc: "60 秒内，AI 输出签证路径、材料清单、费用与时间线，约 1 分钟",
                tags: ["推荐签证路径", "材料 & 费用"],
              },
            ].map((item, i) => (
              <div key={item.num} className="flex flex-col items-center text-center">
                <div
                  className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold mb-6 shadow-lg ${
                    i === 2
                      ? "bg-accent-500 text-white"
                      : "bg-primary-900 text-white"
                  }`}
                >
                  {item.num}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed max-w-[200px]">{item.desc}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {item.tags.map((t) => (
                    <span key={t} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 px-9 py-4 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              开始 3 步评估 →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 报告示例预览 ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-widest">报告示例</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">一份报告，覆盖所有决策关键点</h2>
            <p className="mt-4 text-gray-500 text-base">真实 AI 生成报告示例（数据已脱敏）</p>
          </div>

          <div className="rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
            {/* 报告 header */}
            <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white px-8 py-7">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-primary-400 uppercase tracking-widest mb-2">AI 分析报告</div>
                  <h3 className="text-xl font-bold mb-1">张某某的移民路径评估</h3>
                  <p className="text-primary-300 text-sm">中国公民 · 32岁 · 软件工程师 · 目标：澳大利亚</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center min-w-[80px]">
                    <div className="text-2xl font-extrabold text-emerald-400">高</div>
                    <div className="text-xs text-primary-400 mt-0.5">可行性</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center min-w-[80px]">
                    <div className="text-2xl font-extrabold text-accent-300">3</div>
                    <div className="text-xs text-primary-400 mt-0.5">推荐路径</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 路径卡片 */}
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "首选推荐", value: "澳大利亚 189 独立技术移民", tag: "最优路径", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                  { label: "备选方案", value: "澳大利亚 482 技术工作签证", tag: "快速通道", color: "bg-blue-50 text-blue-700 border-blue-100" },
                  { label: "长期规划", value: "加拿大联邦快速通道 (EE)", tag: "备用选项", color: "bg-gray-100 text-gray-600 border-gray-200" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="text-xs text-gray-400 mb-2">{item.label}</div>
                    <div className="font-semibold text-gray-900 text-sm mb-3 leading-snug">{item.value}</div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.color}`}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 报告模块 */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {[
                  { icon: "📋", label: "材料清单", count: "12 项" },
                  { icon: "💰", label: "费用预估", count: "AUD 7,200" },
                  { icon: "⏱️", label: "申请周期", count: "12–18 个月" },
                  { icon: "⚠️", label: "风险提示", count: "3 条" },
                  { icon: "💡", label: "个性建议", count: "5 条" },
                  { icon: "📊", label: "成功率参考", count: "75–85%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-sm font-bold text-gray-800">{item.count}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold transition group text-sm"
                >
                  查看完整示例报告
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 早期体验 / 定价 ===== */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
          <span className="text-accent-600 font-semibold text-sm uppercase tracking-widest">早期免费体验</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            现在注册，免费体验 3 次
          </h2>
          <p className="text-gray-500 text-base mb-10">
            产品处于早期阶段，注册即获 3 次完整评估机会，历史报告永久保存
          </p>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm mb-6">
            <div className="text-6xl font-extrabold text-gray-900 mb-1">¥0</div>
            <div className="text-gray-400 text-sm mb-8">注册即获，无任何隐藏费用</div>
            <ul className="space-y-3 text-left mb-8">
              {[
                "3 次完整 AI 分析报告",
                "覆盖主流目的地签证类型",
                "PDF 导出与历史保存",
                "匹配度 / 风险分析 / 时间线",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/login?mode=signup"
              className="block w-full py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-2xl text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-center"
            >
              免费注册，立即体验
            </Link>
          </div>

          <p className="text-gray-400 text-sm">付费套餐即将推出 · 早期用户将享专属优惠</p>
        </div>
      </section>

      {/* ===== 免责声明 ===== */}
      <div className="bg-amber-50 border-t border-amber-100 py-5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-700 text-sm">
            <strong>重要声明：</strong>
            问签提供的所有内容均由 AI 自动生成，仅作为参考信息，不构成法律建议或移民服务。
            签证政策随时可能变化，请在做出任何移民决策前咨询持牌移民律师或认证移民顾问。
          </p>
        </div>
      </div>

      {/* ===== Footer CTA ===== */}
      <section className="py-24 bg-primary-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            先了解选项
            <br />
            <span className="text-accent-400">再咨询律师</span>
          </h2>
          <p className="text-primary-300 text-xl mb-10">
            用 AI 做功课，让专业咨询事半功倍
          </p>
          <Link
            href="/auth/login?mode=signup"
            className="inline-flex items-center gap-2 px-12 py-5 bg-accent-500 hover:bg-accent-600 text-white font-extrabold rounded-2xl text-xl transition-all shadow-2xl hover:-translate-y-1"
          >
            免费注册，立即开始
          </Link>
          <p className="text-primary-500 text-sm mt-5">注册即获 3 次免费评估 · 无需上传证件</p>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-950 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-bold text-lg mb-0.5">问签</p>
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
