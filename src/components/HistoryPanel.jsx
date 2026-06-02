import { useState } from 'react'
import { ChevronDown, ChevronRight, Clock, Layers, Sparkles, Trash2, Eye } from 'lucide-react'

export function HistoryPanel({ history, onRestore, onDelete }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="rounded-lg border border-stone-200 bg-white shadow-soft">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div>
          <p className="text-sm font-semibold text-cyan-800">分析历史</p>
          <p className="mt-1 text-sm text-slate-500">
            {history.length > 0 ? `已保存 ${history.length} 条记录` : '暂无记录'}
          </p>
        </div>
        <span className="text-slate-400">
          {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </span>
      </button>

      {open && (
        <div className="border-t border-stone-200">
          {history.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">
              粘贴评论并完成分析后，记录会自动保存在这里。
            </p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {history.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 px-5 py-3">
                  <Clock size={14} className="shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500">{entry.createdAt}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        entry.mode === 'ai'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {entry.mode === 'ai' ? <Sparkles size={10} /> : <Layers size={10} />}
                        {entry.mode === 'ai' ? 'AI' : '规则'}
                      </span>
                      <span className="text-xs text-slate-600">{entry.commentCount} 条评论</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-600"
                    title="恢复此分析"
                    onClick={() => onRestore(entry.snapshot)}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    title="删除"
                    onClick={() => onDelete(entry.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
