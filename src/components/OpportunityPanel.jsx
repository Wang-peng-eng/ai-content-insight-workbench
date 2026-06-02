export function OpportunityPanel({ opportunity }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white px-5 py-4 shadow-soft">
      <p className="text-sm font-semibold text-cyan-800">内容机会分析</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-950">优先值得做的内容</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Column title="用户最关注的问题" items={opportunity.focusQuestions} />
        <div className="rounded-md border border-stone-200 px-4 py-3">
          <p className="text-sm font-medium text-slate-800">用户最强烈的情绪</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{opportunity.strongestEmotion.label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{opportunity.strongestEmotion.description}</p>
        </div>
        <Column title="潜在内容方向" items={opportunity.directions} />
      </div>
    </section>
  )
}

function Column({ title, items }) {
  return (
    <div className="rounded-md border border-stone-200 px-4 py-3">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.slice(0, 4).map((item) => (
          <li key={item} className="text-sm leading-6 text-slate-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
