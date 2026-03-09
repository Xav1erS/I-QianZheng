export default function DisclaimerBanner() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 md:px-6">
      <div className="flex items-start gap-3 max-w-4xl mx-auto">
        <span className="text-yellow-600 text-lg flex-shrink-0 mt-0.5">⚠️</span>
        <p className="text-yellow-800 text-sm leading-relaxed">
          <strong>免责声明：</strong>
          本报告由 AI 自动生成，内容仅供参考，不构成任何法律建议或移民服务。签证政策随时变动，所有费用与时间线均为估算，请以目标国官方最新信息为准。
          <strong>重大移民决策前，请务必咨询持牌移民律师或认证移民顾问。</strong>
        </p>
      </div>
    </div>
  );
}
