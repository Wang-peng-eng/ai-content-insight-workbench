import { anxietyRules } from '../data/anxietyRules.js'

const fallbackEmotion = {
  label: '观望与试探',
  description: '评论里出现了兴趣和疑问，但强烈焦虑信号还不明显。',
}

export function analyzeComments(comments) {
  const total = comments.length
  const anxietyStats = anxietyRules.map((rule) => {
    const matchedComments = comments.filter((comment) => {
      const source = comment.toLowerCase()
      return rule.keywords.some((keyword) => source.includes(keyword.toLowerCase()))
    })

    return {
      ...rule,
      count: matchedComments.length,
      percentage: total ? Math.round((matchedComments.length / total) * 100) : 0,
      samples: matchedComments.slice(0, 3),
    }
  })

  const rankedAnxieties = anxietyStats
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh-CN'))

  const topAnxiety = rankedAnxieties[0] ?? null
  const strongestEmotion = topAnxiety
    ? {
        label: topAnxiety.emotion,
        description: `${topAnxiety.label}相关评论最集中，适合优先拆成内容选题。`,
      }
    : fallbackEmotion

  const profileSignals = rankedAnxieties.flatMap((item) => item.profileSignals).slice(0, 5)
  const contentAngles = rankedAnxieties.flatMap((item) => item.contentAngles).slice(0, 6)

  return {
    total,
    rankedAnxieties,
    topAnxiety,
    strongestEmotion,
    profileSignals,
    contentAngles,
  }
}
