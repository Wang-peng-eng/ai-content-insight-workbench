function ruleOutline(topic, analysis) {
  const keyAnxieties = analysis.rankedAnxieties.slice(0, 2).map((a) => a.label).join('、') || '用户焦虑'
  const mainEmotion = analysis.topAnxiety?.emotion || '关注与好奇'

  return {
    title: topic,
    summary: `围绕「${keyAnxieties}」等核心焦虑展开，为读者提供可操作的认知框架和行动建议。`,
    sections: [
      {
        heading: '一、为什么这个话题值得关注？',
        points: [
          `背后驱动力：${mainEmotion}`,
          '与读者日常工作和生活的直接关联',
          '如果不解决这个问题，读者可能面临的后果',
        ],
      },
      {
        heading: '二、核心概念拆解',
        points: [
          '用通俗语言解释关键概念（避免术语堆砌）',
          '列举 2-3 个读者容易产生的误解并澄清',
          '提供简单的自我检测方法（读者是否能对号入座）',
        ],
      },
      {
        heading: '三、可落地的解决方案',
        points: [
          '第一阶段：低成本试水（具体到工具/平台/方法名）',
          '第二阶段：建立正向反馈循环',
          '第三阶段：从执行者升级为决策者',
        ],
      },
      {
        heading: '四、常见误区与避坑指南',
        points: [
          '读者最容易走的弯路（来自真实案例）',
          '为什么多数人卡在第一步就放弃了',
          '如何判断自己是否走在正确的路上',
        ],
      },
      {
        heading: '五、下一步行动清单',
        points: [
          '今天就能做的 1 件事（极低门槛）',
          '本周完成的 3 个关键动作',
          '30 天后的里程碑检查点',
        ],
      },
    ],
    recommendedTitle: topic,
    targetAudience: analysis.topAnxiety ? `正在经历${analysis.topAnxiety.label}的职场人` : '关注个人成长的职场人',
    takeaway: '获得对自己处境的清晰认知 + 一套可立即执行的最小行动方案',
  }
}

export async function generateOutline(topic, mode, apiKey, analysis) {
  if (mode !== 'ai' || !apiKey) {
    return ruleOutline(topic, analysis)
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一个资深内容策划编辑。根据给定的选题，生成一份详细的内容大纲。

返回格式必须是严格的JSON：
{
  "title": "选题标题",
  "summary": "一句话概述（目标读者+核心价值）",
  "sections": [
    {"heading": "H2标题", "points": ["要点1", "要点2", "要点3"]}
  ],
  "recommendedTitle": "最终推荐的文章标题",
  "targetAudience": "目标读者画像",
  "takeaway": "读者看完后能获得什么"
}

要求：
- sections 生成 4-6 个章节
- 每个章节包含 3-4 个要点
- 要点要具体可执行，不要空洞的理论
- 只返回JSON，不要包含其他文字`,
          },
          {
            role: 'user',
            content: `请为以下选题生成内容大纲：\n\n${topic}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) return ruleOutline(topic, analysis)

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) return ruleOutline(topic, analysis)

    let jsonStr = content.trim()
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim()

    const parsed = JSON.parse(jsonStr)
    return {
      title: parsed.title || topic,
      summary: parsed.summary || '',
      sections: parsed.sections || [],
      recommendedTitle: parsed.recommendedTitle || topic,
      targetAudience: parsed.targetAudience || '',
      takeaway: parsed.takeaway || '',
    }
  } catch {
    return ruleOutline(topic, analysis)
  }
}
