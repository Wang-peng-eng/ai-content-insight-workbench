import { ClipboardPaste, RotateCcw, Wand2 } from 'lucide-react'

export function CommentInput({ value, onChange, onExample, onClear, stats }) {
  return (
    <section className="flex h-full min-h-[520px] flex-col rounded-lg border border-stone-200 bg-white shadow-soft">
      <div className="border-b border-stone-200 px-5 py-4">
        <p className="text-sm font-semibold text-cyan-800">评论导入</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">AI内容洞察工作台</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          粘贴评论后自动去空行、去重，并生成运营洞察。
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 border-b border-stone-200 px-5 py-4">
        <Metric label="原始评论" value={stats.originalCount} />
        <Metric label="去重后" value={stats.uniqueCount} />
        <Metric label="重复" value={stats.duplicateCount} />
      </div>

      <div className="flex flex-1 flex-col px-5 py-4">
        <label className="mb-2 text-sm font-medium text-slate-800" htmlFor="comment-input">
          每行一条评论
        </label>
        <textarea
          id="comment-input"
          className="min-h-[300px] flex-1 resize-none rounded-md border border-stone-300 bg-stone-50 px-4 py-3 text-sm leading-6 text-slate-900 transition focus:border-cyan-700 focus:bg-white"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={'例如：\n我35岁了，现在学AI还来得及吗？\n真的很怕被AI替代，工作越来越不稳定。\n想转行AI但不知道从哪里开始。'}
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-800 px-4 text-sm font-medium text-white transition hover:bg-cyan-900"
            onClick={onExample}
          >
            <Wand2 size={17} aria-hidden="true" />
            示例评论
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-stone-100"
            onClick={onClear}
          >
            <RotateCcw size={17} aria-hidden="true" />
            清空
          </button>
          <span className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-100 px-3 text-sm text-slate-600">
            <ClipboardPaste size={16} aria-hidden="true" />
            本地浏览器分析
          </span>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-md bg-stone-100 px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}
