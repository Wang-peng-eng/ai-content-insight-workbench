export function formatMarkdown({ stats, analysis, profile, opportunity, topics, titles }) {
  const time = new Date().toLocaleString('zh-CN', { hour12: false })
  const lines = [
    '# AI内容洞察工作台 — 分析报告',
    '',
    `> 生成时间：${time}`,
    '',
    '---',
    '',
    '## 数据概况',
    '',
    '| 指标 | 数值 |',
    '|------|------|',
    `| 原始评论数 | ${stats.originalCount} |`,
    `| 去重后评论数 | ${stats.uniqueCount} |`,
    `| 去除重复 | ${stats.duplicateCount} |`,
    '',
  ]

  if (analysis.rankedAnxieties.length > 0) {
    lines.push('## 高频焦虑信号', '')
    analysis.rankedAnxieties.forEach((item, i) => {
      lines.push(`### ${i + 1}. ${item.label}（${item.percentage}%）`)
      lines.push('')
      lines.push(`- **情绪类型**：${item.emotion}`)
      lines.push(`- **命中评论数**：${item.count} 条`)
      if (item.samples && item.samples.length > 0) {
        lines.push('- **典型评论**：')
        item.samples.forEach((s) => lines.push(`  > "${s}"`))
      }
      lines.push('')
    })
  }

  lines.push('## 用户画像', '')
  lines.push(`- **年龄段**：${profile.age}`)
  lines.push(`- **职业**：${profile.occupation}`)
  lines.push('- **特点**：')
  profile.traits.forEach((t) => lines.push(`  - ${t}`))
  lines.push('')

  if (opportunity) {
    lines.push('## 内容机会分析', '')
    lines.push('### 用户最关注的问题')
    opportunity.focusQuestions.slice(0, 4).forEach((q) => lines.push(`- ${q}`))
    lines.push('')
    lines.push('### 最强烈的情绪')
    lines.push(`**${opportunity.strongestEmotion.label}** — ${opportunity.strongestEmotion.description}`)
    lines.push('')
    lines.push('### 潜在内容方向')
    opportunity.directions.forEach((d) => lines.push(`- ${d}`))
    lines.push('')
  }

  if (topics.length > 0) {
    lines.push('## 选题建议', '')
    topics.forEach((t, i) => lines.push(`${i + 1}. ${t}`))
    lines.push('')
  }

  if (titles.length > 0) {
    lines.push('## 标题建议', '')
    titles.forEach((t, i) => lines.push(`${i + 1}. ${t}`))
    lines.push('')
  }

  return lines.join('\n')
}

export function downloadMarkdown({ stats, analysis, profile, opportunity, topics, titles }) {
  const md = formatMarkdown({ stats, analysis, profile, opportunity, topics, titles })
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const filename = `AI内容洞察报告_${date}.md`
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
