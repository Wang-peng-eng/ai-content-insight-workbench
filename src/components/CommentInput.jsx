import { useRef, useState } from 'react'
import { ClipboardPaste, Eye, EyeOff, Key, Layers, RotateCcw, Sparkles, Upload, Wand2 } from 'lucide-react'

export function CommentInput({ value, onChange, onExample, onClear, stats, analysisMode, onSetMode, apiKey, onSetApiKey }) {
  const fileInputRef = useRef(null)
  const [csvError, setCsvError] = useState('')
  const [showKey, setShowKey] = useState(false)

  function handleCsvUpload(event) {
    const file = event.target.files[0]
    if (!file) return
    setCsvError('')

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split(/\r?\n/).filter(Boolean)
      if (lines.length === 0) {
        setCsvError('CSV 文件为空')
        return
      }

      const headerKeywords = /评论|内容|comment|content|正文|text|body/i
      let startIndex = 0
      if (lines.length > 1 && headerKeywords.test(lines[0])) {
        startIndex = 1
      }

      const extracted = []
      for (let i = startIndex; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i])
        if (cols.length === 0) continue
        const longest = cols.reduce((a, b) => (a.length >= b.length ? a : b), '')
        const trimmed = longest.trim()
        if (trimmed) extracted.push(trimmed)
      }

      if (extracted.length === 0) {
        setCsvError('未能从 CSV 中提取到评论')
        return
      }

      onChange(extracted.join('\n'))
    }
    reader.onerror = () => setCsvError('文件读取失败')
    reader.readAsText(file)

    event.target.value = ''
  }

  return (
    <section className="flex h-full min-h-[520px] flex-col rounded-lg border border-stone-200 bg-white shadow-soft">
      <div className="border-b border-stone-200 px-5 py-4">
        <p className="text-sm font-semibold text-cyan-800">评论导入</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">AI内容洞察工作台</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          粘贴评论或上传 CSV，自动去空行、去重，并生成运营洞察。
        </p>

        {/* 分析模式切换 */}
        <div className="mt-3 rounded-md bg-stone-50 border border-stone-200 p-3">
          <p className="text-xs font-medium text-slate-500 mb-2">分析模式</p>
          <div className="flex gap-2">
            <button
              type="button"
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition ${
                analysisMode === 'rule'
                  ? 'bg-white border border-stone-300 text-slate-900 shadow-sm'
                  : 'border border-transparent text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => onSetMode('rule')}
            >
              <Layers size={14} />
              规则分析
            </button>
            <button
              type="button"
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition ${
                analysisMode === 'ai'
                  ? 'bg-purple-50 border border-purple-200 text-purple-800 shadow-sm'
                  : 'border border-transparent text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => onSetMode('ai')}
            >
              <Sparkles size={14} />
              AI 分析
            </button>
          </div>

          {/* API Key 输入（仅 AI 模式） */}
          {analysisMode === 'ai' && (
            <div className="mt-2.5">
              <label className="text-xs font-medium text-slate-500" htmlFor="api-key-input">
                DeepSeek API Key
              </label>
              <div className="mt-1 flex gap-1.5">
                <div className="relative flex-1">
                  <Key size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="api-key-input"
                    type={showKey ? 'text' : 'password'}
                    className="w-full rounded-md border border-stone-300 bg-white py-1.5 pl-8 pr-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => onSetApiKey(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-stone-300 px-2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowKey(!showKey)}
                  title={showKey ? '隐藏' : '显示'}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Key 仅保存在浏览器本地，不会上传到任何服务器。
              </p>
            </div>
          )}
        </div>
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

        {csvError && (
          <p className="mt-2 text-sm text-red-600">{csvError}</p>
        )}

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
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={17} aria-hidden="true" />
            CSV 导入
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvUpload}
          />
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

/** 解析一行 CSV：处理引号包裹的字段中可能包含逗号的情况 */
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

function Metric({ label, value }) {
  return (
    <div className="rounded-md bg-stone-100 px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}
