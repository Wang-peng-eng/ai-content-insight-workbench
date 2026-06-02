import { useMemo, useState } from 'react'
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

export default function App() {
  const [rawText, setRawText] = useState('')

  const stats = useMemo(() => parseComments(rawText), [rawText])
  const analysis = useMemo(() => analyzeComments(stats.comments), [stats.comments])
  const profile = useMemo(() => buildUserProfile(analysis), [analysis])
  const opportunity = useMemo(() => buildOpportunity(analysis), [analysis])
  const topics = useMemo(() => buildTopicSuggestions(analysis), [analysis])
  const titles = useMemo(() => buildTitleSuggestions(analysis), [analysis])

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1520px] gap-5 lg:grid-cols-[420px_1fr]">
        <div className="lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
          <CommentInput
            value={rawText}
            onChange={setRawText}
            onExample={() => setRawText(exampleComments)}
            onClear={() => setRawText('')}
            stats={stats}
          />
        </div>

        <div className="grid gap-5">
          <StatsPanel stats={stats} />
          <AnxietyCards anxieties={analysis.rankedAnxieties} />
          <UserProfile profile={profile} />
          <OpportunityPanel opportunity={opportunity} />
          <div className="grid gap-5 xl:grid-cols-2">
            <TopicSuggestions topics={topics} />
            <TitleSuggestions titles={titles} />
          </div>
        </div>
      </div>
    </main>
  )
}
