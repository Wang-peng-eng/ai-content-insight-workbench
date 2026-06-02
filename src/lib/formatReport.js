export function formatReport({ stats, analysis, profile, opportunity, topics, titles }) {
  const lines = [
    'AI内容洞察工作台 — 分析报告',
    '='.repeat(40),
    '',
    '【数据概况】',
    `原始评论数：${stats.originalCount}    去重后：${stats.uniqueCount}    去除重复：${stats.duplicateCount}`,
    '',
  ]

  if (analysis.rankedAnxieties.length > 0) {
    lines.push('【高频焦虑信号】')
    analysis.rankedAnxieties.forEach((item, i) => {
      lines.push(`${i + 1}. ${item.label}（${item.percentage}%）`)
      lines.push(`   命中 ${item.count} 条评论`)
      if (item.samples && item.samples.length > 0) {
        item.samples.forEach((s) => lines.push(`   - "${s}"`))
      }
    })
    lines.push('')
  }

  lines.push(
    '【用户画像】',
    `年龄段：${profile.age}`,
    `职业：${profile.occupation}`,
    '特点：',
    ...profile.traits.map((t) => `  - ${t}`),
    '',
  )

  if (opportunity) {
    lines.push(
      '【内容机会分析】',
      '用户最关注的问题：',
      ...opportunity.focusQuestions.slice(0, 4).map((q) => `  - ${q}`),
      '',
      `最强烈的情绪：${opportunity.strongestEmotion.label}`,
      `  ${opportunity.strongestEmotion.description}`,
      '',
      '潜在内容方向：',
      ...opportunity.directions.map((d) => `  - ${d}`),
      '',
    )
  }

  if (topics.length > 0) {
    lines.push('【选题建议】')
    topics.forEach((t, i) => lines.push(`${i + 1}. ${t}`))
    lines.push('')
  }

  if (titles.length > 0) {
    lines.push('【标题建议】')
    titles.forEach((t, i) => lines.push(`${i + 1}. ${t}`))
    lines.push('')
  }

  return lines.join('\n')
}
