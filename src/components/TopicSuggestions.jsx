import { ArrowRight } from 'lucide-react'

export function TopicSuggestions({ topics, onSelectTopic }) {
  return (
    <SuggestionList
      eyebrow="选题建议"
      title="可直接进入内容策划的10个选题"
      items={topics}
      clickable={!!onSelectTopic}
      onItemClick={onSelectTopic}
    />
  )
}

export function TitleSuggestions({ titles }) {
  return <SuggestionList eyebrow="标题建议" title="适合短内容开头的10个标题" items={titles} />
}

function SuggestionList({ eyebrow, title, items, clickable, onItemClick }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white px-5 py-4 shadow-soft">
      <p className="text-sm font-semibold text-cyan-800">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
      {clickable && (
        <p className="mt-1 text-xs text-slate-400">点击选题可生成内容大纲</p>
      )}
      <ol className="mt-4 grid gap-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className={`grid items-start rounded-md bg-stone-100 px-3 py-2 text-sm leading-6 text-slate-700 ${
              clickable
                ? 'grid-cols-[2rem_1fr_1rem] cursor-pointer transition hover:bg-cyan-50 hover:text-cyan-900'
                : 'grid-cols-[2rem_1fr]'
            }`}
            onClick={clickable ? () => onItemClick(item) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={clickable ? (e) => { if (e.key === 'Enter') onItemClick(item) } : undefined}
          >
            <span className="font-semibold text-cyan-800">{index + 1}</span>
            <span>{item}</span>
            {clickable && <ArrowRight size={14} className="mt-0.5 text-cyan-400" />}
          </li>
        ))}
      </ol>
    </section>
  )
}
