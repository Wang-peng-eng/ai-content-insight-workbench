import { useState } from 'react'
import { ArrowRight, Send } from 'lucide-react'
import { pushToGenerator } from '../lib/bridge'

export function TopicSuggestions({ topics, onSelectTopic, bridgeData }) {
  const [sentIdx, setSentIdx] = useState(-1)

  function handlePush(item) {
    pushToGenerator({
      type: 'topic',
      topic: item,
      persona: bridgeData?.persona || '',
      audience: bridgeData?.audience || '',
      platform: bridgeData?.platform || '小红书',
    })
  }

  return (
    <SuggestionList
      eyebrow="选题建议"
      title="可直接进入内容策划的10个选题"
      items={topics}
      clickable={!!onSelectTopic}
      onItemClick={onSelectTopic}
      showPush={!!bridgeData}
      sentIdx={sentIdx}
      onPush={(item, idx) => { handlePush(item); setSentIdx(idx); setTimeout(() => setSentIdx(-1), 2000); }}
    />
  )
}

export function TitleSuggestions({ titles }) {
  return <SuggestionList eyebrow="标题建议" title="适合短内容开头的10个标题" items={titles} />
}

function SuggestionList({ eyebrow, title, items, clickable, onItemClick, showPush, sentIdx, onPush }) {
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
              showPush
                ? 'grid-cols-[2rem_1fr_auto]'
                : clickable
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
            {showPush ? (
              <button
                onClick={(e) => { e.stopPropagation(); onPush(item, index); }}
                className="inline-flex items-center gap-1 rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 hover:bg-violet-200 transition shrink-0"
                title="推送到AI内容生成器"
              >
                {sentIdx === index ? '已推送' : <><Send size={10} /> 推送</>}
              </button>
            ) : (
              clickable && <ArrowRight size={14} className="mt-0.5 text-cyan-400" />
            )}
          </li>
        ))}
      </ol>
      {showPush && (
        <a
          href="https://wang-peng-eng.github.io/ai-content-generator/"
          target="_blank"
          className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 transition"
        >
          打开AI内容生成器 <ArrowRight size={12} />
        </a>
      )}
    </section>
  )
}
