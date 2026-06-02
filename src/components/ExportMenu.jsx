import { useState, useRef, useEffect } from 'react'
import { Copy, Check, Download, ChevronDown } from 'lucide-react'

export function ExportMenu({ onCopy, onExportMarkdown, copied }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-stone-300 px-3 text-sm font-medium text-slate-600 transition hover:bg-stone-100"
        onClick={() => setOpen(!open)}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        导出
        <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-md border border-stone-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-stone-50"
            onClick={() => { onCopy(); setOpen(false) }}
          >
            <Copy size={14} />
            复制为文本
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-stone-50"
            onClick={() => { onExportMarkdown(); setOpen(false) }}
          >
            <Download size={14} />
            导出 Markdown
          </button>
        </div>
      )}
    </div>
  )
}
