export function StatsPanel({ stats }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white px-5 py-4 shadow-soft">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-800">评论统计</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">数据清洗结果</h2>
        </div>
        <p className="text-sm text-slate-500">已自动去空行和重复评论</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="原始评论数" value={stats.originalCount} />
        <Stat label="去重后评论数" value={stats.uniqueCount} />
        <Stat label="去除重复" value={stats.duplicateCount} />
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md border border-stone-200 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}
