export function TopicSuggestions({ topics }) {
  return <SuggestionList eyebrow="选题建议" title="可直接进入内容策划的10个选题" items={topics} />
}

export function TitleSuggestions({ titles }) {
  return <SuggestionList eyebrow="标题建议" title="适合短内容开头的10个标题" items={titles} />
}

function SuggestionList({ eyebrow, title, items }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white px-5 py-4 shadow-soft">
      <p className="text-sm font-semibold text-cyan-800">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
      <ol className="mt-4 grid gap-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="grid grid-cols-[2rem_1fr] items-start rounded-md bg-stone-100 px-3 py-2 text-sm leading-6 text-slate-700"
          >
            <span className="font-semibold text-cyan-800">{index + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
