import { useCallback, useEffect, useMemo, useState } from 'react'
import { Copy, Check, Clock, Sparkles, Layers } from 'lucide-react'
import { CommentInput } from './components/CommentInput.jsx'
import { StatsPanel } from './components/StatsPanel.jsx'
import { AnxietyCards } from './components/AnxietyCards.jsx'
import { UserProfile } from './components/UserProfile.jsx'
import { OpportunityPanel } from './components/OpportunityPanel.jsx'
import { TopicSuggestions } from './components/TopicSuggestions.jsx'
import { TitleSuggestions } from './components/TitleSuggestions.jsx'
import { analyzeComments } from './lib/analyzeComments.js'
import {
  buildOpportunity,
  buildTitleSuggestions,
  buildTopicSuggestions,
  buildUserProfile,
} from './lib/generateSuggestions.js'
import { parseComments } from './lib/parseComments.js'
import { formatReport } from './lib/formatReport.js'
import { deepseekAnalyze } from './lib/deepseekAnalysis.js'
import { loadHistory, saveEntry, deleteEntry } from './lib/historyStore.js'
import { HistoryPanel } from './components/HistoryPanel.jsx'
import { ExportMenu } from './components/ExportMenu.jsx'
import { downloadMarkdown } from './lib/formatMarkdown.js'
import { generateOutline } from './lib/generateOutline.js'
import { OutlineModal } from './components/OutlineModal.jsx'

const LS_KEY_MODE = 'ai_workbench_mode'
const LS_KEY_API_KEY = 'ai_workbench_api_key'

const exampleComments = [
  '我35岁了，现在学AI还来得及吗？',
  '真的很怕被AI替代，工作越来越不稳定。',
  '想转行AI但不知道从哪里开始，感觉课程太多了。',
  '工资不涨，房贷压力很大，想靠AI做点副业。',
  '零基础小白学AI会不会太晚？',
  '公司最近裁员，我开始担心自己的岗位没了。',
  '我35岁了，现在学AI还来得及吗？',
  '每天都说AI时代来了，但普通人到底该怎么办？',
  '不会写代码能不能转型AI运营？',
  '看别人用AI赚钱，我越看越焦虑。',
].join('\n')

function loadMode() {
  try {
    const v = localStorage.getItem(LS_KEY_MODE)
    if (v === 'ai' || v === 'rule') return v
  } catch { /* ignore */ }
  return 'rule'
}

function loadApiKey() {
  try {
    return localStorage.getItem(LS_KEY_API_KEY) || ''
  } catch { /* ignore */ }
  return ''
}

export default function App() {
  const [rawText, setRawText] = useState('')
  const [copied, setCopied] = useState(false)
  const [analysisMode, setAnalysisMode] = useState(loadMode)
  const [apiKey, setApiKey] = useState(loadApiKey)
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiFailed, setAiFailed] = useState(false)
  const [history, setHistory] = useState(loadHistory)
  const [historyOverride, setHistoryOverride] = useState(null)
  const [outlineTopic, setOutlineTopic] = useState(null)

  const stats = useMemo(() => parseComments(rawText), [rawText])

  // 规则模式分析（始终运行，作为 AI 模式失败时的回退）
  const ruleAnalysis = useMemo(() => analyzeComments(stats.comments), [stats.comments])
  const ruleProfile = useMemo(() => buildUserProfile(ruleAnalysis), [ruleAnalysis])
  const ruleOpportunity = useMemo(() => buildOpportunity(ruleAnalysis), [ruleAnalysis])
  const ruleTopics = useMemo(() => buildTopicSuggestions(ruleAnalysis), [ruleAnalysis])
  const ruleTitles = useMemo(() => buildTitleSuggestions(ruleAnalysis), [ruleAnalysis])

  // AI 模式分析
  useEffect(() => {
    let cancelled = false

    if (analysisMode === 'ai' && apiKey && stats.comments.length > 0) {
      setAiLoading(true)
      setAiFailed(false)
      deepseekAnalyze(stats.comments, apiKey).then((result) => {
        if (cancelled) return
        if (result) {
          setAiResult(result)
          setAiFailed(false)
        } else {
          setAiResult(null)
          setAiFailed(true)
        }
        setAiLoading(false)
      })
    } else {
      setAiResult(null)
      setAiFailed(false)
      setAiLoading(false)
    }

    return () => { cancelled = true }
  }, [analysisMode, apiKey, stats.comments])

  // 自动保存分析历史（当有数据且非恢复状态时）
  useEffect(() => {
    if (stats.uniqueCount === 0) return
    if (historyOverride) return // 正在查看历史，不覆盖
    const snapshot = {
      stats,
      analysis,
      profile,
      opportunity,
      topics,
      titles,
    }
    saveEntry({ mode: useAI ? 'ai' : 'rule', commentCount: stats.uniqueCount, snapshot })
    setHistory(loadHistory())
  }, [stats.uniqueCount, analysisMode, aiResult])

  function handleRestoreHistory(snapshot) {
    setHistoryOverride(snapshot)
  }

  function handleDeleteHistory(id) {
    deleteEntry(id)
    setHistory(loadHistory())
  }

  const handleGenerateOutline = useCallback(async (topic) => {
    const currentAnalysis = historyOverride
      ? { rankedAnxieties: historyOverride.analysis?.rankedAnxieties || [], topAnxiety: historyOverride.analysis?.topAnxiety || null }
      : useAI
        ? { rankedAnxieties: aiResult.rankedAnxieties, topAnxiety: aiResult.topAnxiety }
        : ruleAnalysis
    return generateOutline(topic, useAI ? 'ai' : 'rule', apiKey, currentAnalysis)
  }, [useAI, apiKey, aiResult, ruleAnalysis, historyOverride])

  // 选择当前使用的分析数据
  const useAI = analysisMode === 'ai' && aiResult && !aiFailed

  // 如果有历史恢复覆盖，使用覆盖数据
  const effectiveAnalysis = historyOverride?.analysis || analysis
  const effectiveProfile = historyOverride?.profile || profile
  const effectiveOpportunity = historyOverride?.opportunity || opportunity
  const effectiveTopics = historyOverride?.topics || topics
  const effectiveTitles = historyOverride?.titles || titles
  const effectiveStats = historyOverride?.stats || stats

  const analysis = useAI ? { rankedAnxieties: aiResult.rankedAnxieties, topAnxiety: aiResult.topAnxiety } : ruleAnalysis
  const profile = useAI ? (aiResult.userProfile || ruleProfile) : ruleProfile
  const opportunity = useAI
    ? { focusQuestions: aiResult.focusQuestions || [], strongestEmotion: aiResult.strongestEmotion, directions: aiResult.directions || [] }
    : ruleOpportunity
  const topics = useAI && aiResult.topicSuggestions?.length > 0 ? aiResult.topicSuggestions : ruleTopics
  const titles = useAI && aiResult.titleSuggestions?.length > 0 ? aiResult.titleSuggestions : ruleTitles

  const handleCopyReport = useCallback(async () => {
    const report = formatReport({
      stats: effectiveStats,
      analysis: effectiveAnalysis,
      profile: effectiveProfile,
      opportunity: effectiveOpportunity,
      topics: effectiveTopics,
      titles: effectiveTitles,
    })
    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = report
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [effectiveStats, effectiveAnalysis, effectiveProfile, effectiveOpportunity, effectiveTopics, effectiveTitles])

  function handleSetMode(mode) {
    setAnalysisMode(mode)
    try { localStorage.setItem(LS_KEY_MODE, mode) } catch { /* ignore */ }
  }

  function handleSetApiKey(key) {
    setApiKey(key)
    try { localStorage.setItem(LS_KEY_API_KEY, key) } catch { /* ignore */ }
  }

  const hasData = effectiveStats.uniqueCount > 0

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1520px] gap-5 lg:grid-cols-[420px_1fr]">
        <div className="lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
          <CommentInput
            value={rawText}
            onChange={(v) => { setRawText(v); setHistoryOverride(null) }}
            onExample={() => { setRawText(exampleComments); setHistoryOverride(null) }}
            onClear={() => { setRawText(''); setAiResult(null); setAiFailed(false); setHistoryOverride(null) }}
            stats={stats}
            analysisMode={analysisMode}
            onSetMode={handleSetMode}
            apiKey={apiKey}
            onSetApiKey={handleSetApiKey}
          />
        </div>

        <div className="grid gap-5">
          {historyOverride && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm text-amber-800">
              <Clock size={16} />
              正在查看历史记录
              <button
                type="button"
                className="ml-auto text-sm font-medium text-amber-900 underline hover:no-underline"
                onClick={() => setHistoryOverride(null)}
              >
                返回当前分析
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-cyan-800">分析结果</h2>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                useAI
                  ? 'bg-purple-50 text-purple-700'
                  : analysisMode === 'ai' && aiLoading
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-stone-100 text-stone-600'
              }`}>
                {useAI
                  ? <><Sparkles size={12} />AI 分析</>
                  : analysisMode === 'ai' && aiLoading
                    ? 'AI 分析中…'
                    : analysisMode === 'ai' && aiFailed
                      ? <><Layers size={12} />AI 失败，已回退规则</>
                      : <><Layers size={12} />规则分析</>
                }
              </span>
            </div>
            {hasData && (
              <ExportMenu
                copied={copied}
                onCopy={handleCopyReport}
                onExportMarkdown={() => downloadMarkdown({
                  stats: effectiveStats,
                  analysis: effectiveAnalysis,
                  profile: effectiveProfile,
                  opportunity: effectiveOpportunity,
                  topics: effectiveTopics,
                  titles: effectiveTitles,
                })}
              />
            )}
          </div>
          <StatsPanel stats={effectiveStats} />
          <AnxietyCards anxieties={effectiveAnalysis.rankedAnxieties} />
          <UserProfile profile={effectiveProfile} />
          <OpportunityPanel opportunity={effectiveOpportunity} />
          <div className="grid gap-5 xl:grid-cols-2">
            <TopicSuggestions topics={effectiveTopics} onSelectTopic={setOutlineTopic} />
            <TitleSuggestions titles={effectiveTitles} />
          </div>
          <HistoryPanel
            history={history}
            onRestore={handleRestoreHistory}
            onDelete={handleDeleteHistory}
          />
        </div>
      </div>

      {outlineTopic && (
        <OutlineModal
          topic={outlineTopic}
          onClose={() => setOutlineTopic(null)}
          onGenerate={handleGenerateOutline}
        />
      )}
    </main>
  )
}
