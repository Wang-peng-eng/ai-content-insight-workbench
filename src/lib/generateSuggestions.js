const defaultQuestions = [
  'AI到底会不会替代我的工作？',
  '普通人现在学AI还来得及吗？',
  '没有技术背景怎么开始用AI赚钱？',
]

const defaultAngles = [
  '普通上班族的AI转型路线',
  'AI焦虑背后的真实原因',
  '低门槛AI工具实战案例',
]

export function buildUserProfile(analysis) {
  const hasAgeSignal = analysis.rankedAnxieties.some((item) => item.id === 'age-crisis')
  const hasIncomeSignal = analysis.rankedAnxieties.some((item) => item.id === 'income')
  const hasCareerSignal = analysis.rankedAnxieties.some((item) => item.id === 'career-change')

  return {
    age: hasAgeSignal ? '30-40岁' : '25-40岁',
    occupation: hasCareerSignal || hasIncomeSignal ? '普通上班族 / 转型观望者' : '内容关注者 / 职场人',
    traits:
      analysis.profileSignals.length > 0
        ? analysis.profileSignals
        : ['关注AI对职业的影响', '希望理解趋势但还缺少行动路径', '需要具体、低门槛的方法'],
  }
}

export function buildOpportunity(analysis) {
  const topLabels = analysis.rankedAnxieties.slice(0, 3).map((item) => item.label)
  const focusQuestions =
    topLabels.length > 0
      ? topLabels.map((label) => `${label}应该怎么应对？`)
      : defaultQuestions

  return {
    focusQuestions,
    strongestEmotion: analysis.strongestEmotion,
    directions: analysis.contentAngles.length > 0 ? analysis.contentAngles : defaultAngles,
  }
}

export function buildTopicSuggestions(analysis) {
  const main = analysis.rankedAnxieties[0]?.label ?? 'AI焦虑'
  const second = analysis.rankedAnxieties[1]?.label ?? '转型焦虑'

  return [
    `为什么学AI的人越来越焦虑？`,
    `${main}背后，普通人真正害怕什么？`,
    `35岁以后还能转型AI吗？`,
    `普通上班族学AI，第一步到底该做什么？`,
    `AI时代，哪些工作最需要提前准备？`,
    `不懂技术的人，怎么把AI用到工作里？`,
    `${second}出现时，应该先换工作还是先补技能？`,
    `月薪普通的人，如何用AI提高职场竞争力？`,
    `看完这些评论，我发现大家不是怕AI，而是怕掉队`,
    `AI转型最容易踩的3个坑`,
  ]
}

export function buildTitleSuggestions(analysis) {
  const main = analysis.rankedAnxieties[0]?.label ?? 'AI焦虑'

  return [
    `我统计了一批AI评论，发现大家都在怕同一件事`,
    `${main}正在变成普通人的新压力`,
    `别急着报课，普通人学AI前先想清楚这件事`,
    `35岁之后想转型AI，真正的难点不是年龄`,
    `为什么你越学AI越焦虑？`,
    `这些评论说出了AI时代上班族的真实担心`,
    `普通人面对AI替代，最该做的不是恐慌`,
    `如果你也担心被AI淘汰，可以先看这份路线`,
    `AI副业很火，但多数人卡在了第一步`,
    `我从评论区看到了3个最值得做的AI选题`,
  ]
}
