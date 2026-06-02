import { useEffect } from 'react'
import { Copy, Loader, X } from 'lucide-react'
import { useState } from 'react'

export function OutlineModal({ topic, onClose, onGenerate }) {
  const [loading, setLoading] = useState(true)
  const [outline, setOutline] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    onGenerate(topic).then((result) => {
      if (cancelled) return
      setOutline(result)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [topic, onGenerate])

  function handleCopy() {
    if (!outline) return
    const lines = [
      `【内容大纲】${outline.title}`,
      '',
      `概述：${outline.summary}`,
      '',
      ...outline.sections.flatMap((s) => [
        `## ${s.heading}`,
        ...s.points.map((p) => `- ${p}`),
        '',
      ]),
      `推荐标题：${outline.recommendedTitle}`,
      `目标读者：${outline.targetAudience}`,
      `读者收获：${outline.takeaway}`,
    ]
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-[10vh] pb-10"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* 遮罩 */}
      <div className="fixed inset-0 bg-black/30" />

      {/* 弹窗 */}
      <div className="relative w-full max-w-[640px] rounded-lg border border-stone-200 bg-white shadow-soft mx-4">
        {/* 标题栏 */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cyan-800">内容大纲</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950 truncate">{topic}</h2>
          </div>
          <button
            type="button"
            className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-600"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center gap-3 py-8 text-sm text-slate-500">
              <Loader size={18} className="animate-spin" />
              正在生成大纲…
            </div>
          ) : outline ? (
            <div className="grid gap-5">
              {/* 概述 */}
              <div>
                <p className="text-sm font-medium text-slate-800">概述</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{outline.summary}</p>
              </div>

              {/* 章节 */}
              {outline.sections.map((section, i) => (
                <div key={i}>
                  <h3 className="text-base font-semibold text-slate-900">{section.heading}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {section.points.map((point, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-6 text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* 元信息 */}
              <div className="rounded-md bg-stone-50 border border-stone-200 p-4 grid gap-2">
                <MetaRow label="推荐标题" value={outline.recommendedTitle} />
                <MetaRow label="目标读者" value={outline.targetAudience} />
                <MetaRow label="读者收获" value={outline.takeaway} />
              </div>
            </div>
          ) : (
            <p className="py-8 text-sm text-slate-400 text-center">生成失败，请重试</p>
          )}
        </div>

        {/* 底部操作 */}
        <div className="border-t border-stone-200 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {outline && !loading ? `共 ${outline.sections.length} 个章节` : ''}
          </p>
          <div className="flex gap-2">
            {outline && !loading && (
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-medium text-slate-600 transition hover:bg-stone-100"
                onClick={handleCopy}
              >
                {copied ? '已复制' : <><Copy size={16} /> 复制大纲</>}
              </button>
            )}
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-md bg-cyan-800 px-4 text-sm font-medium text-white transition hover:bg-cyan-900"
              onClick={onClose}
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, value }) {
  return (
    <div className="text-sm">
      <span className="font-medium text-slate-700">{label}：</span>
      <span className="text-slate-600">{value}</span>
    </div>
  )
}
