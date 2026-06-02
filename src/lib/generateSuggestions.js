const defaultTopics = [
  '用户最担心的10个问题，我们逐一拆解',
  '为什么这个话题让这么多人焦虑？',
  '普通人面对这个问题，第一步该做什么？',
  '别急着行动，先搞清楚这些真相',
  '过来人告诉你，踩过的坑有哪些',
]

const defaultTitles = [
  '我分析了大量评论，发现大家都在担心同一件事',
  '这个话题正在变成新的焦虑来源',
  '别急着跟风，先想清楚这件事',
  '为什么越努力越焦虑？',
  '这些评论说出了太多人的真实想法',
]

export function buildUserProfile(analysis) {
  const topLabels = analysis.rankedAnxieties.slice(0, 3).map((item) => item.label)
  return {
    age: '25-45岁',
    occupation: topLabels.length > 0 ? `${topLabels.join('、')}关注者` : '内容消费者',
    traits:
      analysis.profileSignals.length > 0
        ? analysis.profileSignals
        : ['关注热点话题', '希望找到解决方案', '需要具体、可操作的指南'],
  }
}

export function buildOpportunity(analysis) {
  const topLabels = analysis.rankedAnxieties.slice(0, 3).map((item) => item.label)
  const focusQuestions =
    topLabels.length > 0
      ? topLabels.map((label) => `${label}应该怎么应对？`)
      : ['用户最关心什么？', '痛点在哪里？', '怎么解决？']

  return {
    focusQuestions,
    strongestEmotion: analysis.strongestEmotion,
    directions: analysis.contentAngles.length > 0 ? analysis.contentAngles : defaultTopics,
  }
}

export function buildTopicSuggestions(analysis) {
  const ranked = analysis.rankedAnxieties.slice(0, 3)
  const main = ranked[0]?.label ?? ''
  const second = ranked[1]?.label ?? ''
  const third = ranked[2]?.label ?? ''

  if (!main) return defaultTopics

  return [
    `为什么「${main}」成了大家最关心的话题？`,
    `关于${main}，大多数人可能想错了`,
    `${main}背后，真正的痛点是什么？`,
    second ? `${main}遇上${second}，应该先解决哪一个？` : `${main}应该怎么破？`,
    `过来人分享：我是怎么解决${main}的`,
    third ? `从${main}到${third}，这些坑你可能也会遇到` : `${main}最常见的3个误区`,
    `别再为${main}焦虑了，试试这个思路`,
    `关于${main}的真相，和你想的不太一样`,
    `新手面对${main}，第一步应该做什么？`,
    `数据告诉你，和你一样焦虑的人还有很多`,
  ]
}

export function buildTitleSuggestions(analysis) {
  const ranked = analysis.rankedAnxieties.slice(0, 3)
  const main = ranked[0]?.label ?? ''

  if (!main) return defaultTitles

  return [
    `我分析了500条评论，发现大家都在为「${main}」焦虑`,
    `「${main}」正在悄悄影响你的决策`,
    `关于${main}，这3个真相越早知道越好`,
    `别人不会告诉你的${main}避坑指南`,
    `为什么你总是在${main}上踩坑？`,
    `${main}不可怕，可怕的是你不知道怎么办`,
    `一张图帮你理清${main}的所有困惑`,
    `别再被${main}困扰了，试试这个方法`,
    `从评论区看${main}：大家都是怎么熬过来的`,
    `如果只能给一个关于${main}的建议，我会说这个`,
  ]
}
