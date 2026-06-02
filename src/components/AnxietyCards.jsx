import { useState } from 'react'
import { AnxietyChart } from './AnxietyChart.jsx'

export function AnxietyCards({ anxieties }) {
  const visible = anxieties.length > 0 ? anxieties : []
  const [viewMode, setViewMode] = useState('card')

  return (
    <section className="rounded-lg border border-stone-200 bg-white px-5 py-4 shadow-soft">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-800">高频焦虑分析</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">评论区焦虑信号</h2>
        </div>
        {visible.length > 0 && (
          <div className="flex rounded-md border border-stone-200 bg-stone-50 p-0.5">
            <button
              type="button"
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                viewMode === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setViewMode('card')}
            >
              卡片
            </button>
            <button
              type="button"
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                viewMode === 'chart' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setViewMode('chart')}
            >
              图表
            </button>
          </div>
        )}
      </div>
      {visible.length > 0 ? (
        viewMode === 'card' ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <article key={item.id} className="rounded-md border border-stone-200 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-950">{item.label}</h3>
                  <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-800">
                    {item.percentage}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">命中 {item.count} 条评论</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{item.contentAngles[0]}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <AnxietyChart anxieties={visible} />
          </div>
        )
      ) : (
        <EmptyState text="粘贴评论后，这里会显示AI替代工作、35岁危机、收入焦虑等高频信号。" />
      )}
    </section>
  )
}

function EmptyState({ text }) {
  return (
    <div className="mt-4 rounded-md border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm leading-6 text-slate-500">
      {text}
    </div>
  )
}
