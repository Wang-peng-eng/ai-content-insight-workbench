const SYSTEM_PROMPT = `你是一个内容运营分析专家。用户会给你一批来自社交媒体的评论，你需要分析并返回JSON格式的结果。

分析要求：
1. 从评论中识别3-6个高频焦虑/情绪类型，每个包含：label(标签)、emotion(情绪)、percentage(占比，整数)、profileSignals(用户特征信号，2条)、contentAngles(内容切入角度，2条)
2. 生成用户画像：age(年龄段)、occupation(职业)、traits(特点，3条)
3. 识别用户最关注的问题(3个focusQuestions)
4. 识别最强烈的情绪(strongestEmotion: {label, description})
5. 生成6个潜在内容方向(directions)
6. 生成10个选题建议(topicSuggestions)
7. 生成10个标题建议(titleSuggestions)

返回格式必须严格是以下JSON结构：
{
  "anxieties": [
    {"label": "...", "emotion": "...", "percentage": 30, "profileSignals": ["...", "..."], "contentAngles": ["...", "..."]}
  ],
  "userProfile": {"age": "...", "occupation": "...", "traits": ["...", "...", "..."]},
  "focusQuestions": ["...", "...", "..."],
  "strongestEmotion": {"label": "...", "description": "..."},
  "directions": ["...", "...", "...", "...", "...", "..."],
  "topicSuggestions": ["...", "..." x10],
  "titleSuggestions": ["...", "..." x10]
}

注意：
- 每个字段都必须填写，不要留空数组或空字符串
- 选题和标题建议必须基于真实评论内容生成，不要使用通用模板
- 只返回JSON，不要包含任何其他文字`

export async function deepseekAnalyze(comments, apiKey) {
  if (!apiKey || !comments.length) return null

  const commentsText = comments.map((c, i) => `${i + 1}. ${c}`).join('\n')

  let response
  try {
    response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `请分析以下${comments.length}条评论：\n\n${commentsText}` },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })
  } catch {
    return null
  }

  if (!response.ok) return null

  let data
  try {
    data = await response.json()
  } catch {
    return null
  }

  const content = data?.choices?.[0]?.message?.content
  if (!content) return null

  // 提取 JSON（可能被 markdown 代码块包裹）
  let jsonStr = content.trim()
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim()
  }

  let parsed
  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    return null
  }

  // 验证并规范化返回结构
  return normalizeResult(parsed, comments)
}

function normalizeResult(raw, comments) {
  const anxieties = (raw.anxieties || [])
    .filter((a) => a.label && a.emotion)
    .map((a) => ({
      id: a.label.replace(/\s+/g, '-').toLowerCase(),
      label: a.label,
      emotion: a.emotion,
      percentage: a.percentage || 0,
      profileSignals: a.profileSignals || [],
      contentAngles: a.contentAngles || [],
    }))

  const rankedAnxieties = anxieties.sort((a, b) => b.percentage - a.percentage)

  const topAnxiety = rankedAnxieties[0] || null
  const strongestEmotion = raw.strongestEmotion?.label
    ? raw.strongestEmotion
    : topAnxiety
      ? { label: topAnxiety.emotion, description: `${topAnxiety.label}相关评论最集中。` }
      : { label: '观望与试探', description: '评论里出现兴趣和疑问，但强烈情绪信号不明显。' }

  const profile = raw.userProfile || {}
  const userProfile = {
    age: profile.age || '未知',
    occupation: profile.occupation || '未知',
    traits: profile.traits?.length > 0 ? profile.traits : ['关注AI对职业的影响', '希望理解趋势', '需要低门槛方法'],
  }

  return {
    total: comments.length,
    rankedAnxieties,
    topAnxiety,
    strongestEmotion,
    userProfile,
    focusQuestions: raw.focusQuestions || [],
    directions: raw.directions || [],
    topicSuggestions: raw.topicSuggestions || [],
    titleSuggestions: raw.titleSuggestions || [],
  }
}
