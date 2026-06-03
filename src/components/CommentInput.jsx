import { useRef, useState } from 'react'
import { Camera, ClipboardPaste, Image, Layers, Loader2, RotateCcw, Sparkles, Upload, Wand2 } from 'lucide-react'
import { ocrImages } from '../lib/ocrImages'

export function CommentInput({ value, onChange, onExample, onClear, stats, analysisMode, onSetMode, apiKey, onSetApiKey }) {
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const [csvError, setCsvError] = useState('')
  const [ocrProgress, setOcrProgress] = useState(null)

  async function handleImageUpload(event) {
    const files = Array.from(event.target.files)
    if (!files.length) return
    setCsvError('')
    setOcrProgress({ current: 0, total: files.length, file: '', status: 'starting' })

    const results = await ocrImages(files, (p) => setOcrProgress({ ...p }))

    const lines = results.map((r) => r.text.split(/\r?\n/).filter(Boolean)).flat()
    const existing = value.trim()
    onChange(existing ? existing + '\n' + lines.join('\n') : lines.join('\n'))

    setOcrProgress({ current: files.length, total: files.length, status: 'complete', count: lines.length })

    event.target.value = ''
  }
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
          粘贴评论、上传 CSV、或导入截图自动 OCR 提取文字，自动去空行、去重、过滤无意义内容，并生成运营洞察。
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

          {/* API Key 已内置 */}
          {analysisMode === 'ai' && (
            <p className="mt-2 text-xs text-slate-400">
              API Key 已内置，直接粘贴评论即可使用 AI 分析。
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 border-b border-stone-200 px-5 py-4">
        <Metric label="原始评论" value={stats.originalCount} />
        <Metric label="去重后" value={stats.uniqueCount} />
        <Metric label="重复" value={stats.duplicateCount} />
        <Metric label="已过滤" value={stats.filteredCount ?? 0} hint="无意义内容" />
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

        {ocrProgress && ocrProgress.status !== 'complete' && (
          <div className="mt-3 rounded-md bg-purple-50 border border-purple-200 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm text-purple-800">
              {ocrProgress.status === 'starting'
                ? <><Loader2 size={14} className="animate-spin" /> 正在加载 OCR 引擎…</>
                : <><Loader2 size={14} className="animate-spin" /> 识别中 {ocrProgress.current}/{ocrProgress.total}：{ocrProgress.file}</>
              }
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-purple-200">
              <div
                className="h-1.5 rounded-full bg-purple-600 transition-all duration-300"
                style={{ width: `${Math.round((ocrProgress.current / ocrProgress.total) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {ocrProgress?.status === 'complete' && (
          <p className="mt-2 text-sm text-emerald-600">
            已从 {ocrProgress.total} 张截图中提取 {ocrProgress.count} 行评论，已追加到输入区。
          </p>
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
            className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-stone-100 disabled:opacity-50"
            onClick={() => imageInputRef.current?.click()}
            disabled={ocrProgress?.status === 'processing' || ocrProgress?.status === 'starting'}
          >
            {ocrProgress?.status === 'processing' || ocrProgress?.status === 'starting'
              ? <Loader2 size={17} className="animate-spin" />
              : <Camera size={17} aria-hidden="true" />
            }
            导入截图
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
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

function Metric({ label, value, hint }) {
  return (
    <div className="rounded-md bg-stone-100 px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
