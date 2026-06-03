const SPAM_PATTERNS = [
  /^[，,。.！!？?…]+$/,
  /^[\d\s.]+$/,
  /^[😂😭😊❤️👍🙏💪🔥😍🥰😘😡🤬😱🫣🤡💀👀🙈🙉🙊🐮🐮🐴🦄🦋🌸🌺🌻🌹💐🍀🌿🌴🌳🌲]+$/,
  /^(哈哈|呵呵|嘿嘿|嘻嘻|哎|唉|哦|嗯|啊|呀|哟|哈|吼)+$/,
  /^(支持|点赞|打卡|路过|沙发|第一|来了|看看|学习|收藏|转发|Mark|mark|dd|DD|1|2|3|666|888|牛逼|厉害|棒|好|顶|赞|冲|加油|牛|强|6|8)+$/,
  /^(不错|很好|太好了|真棒|优秀|学习了|谢谢分享|感谢分享|收藏了|码住)[。.!！]*$/,
  /^.{0,2}$/,
]

function isLowValue(comment) {
  const stripped = comment.replace(/\s+/g, '').replace(/[^一-鿿\w]/g, '')
  if (stripped.length <= 2) return true
  const pure = comment.replace(/\s+/g, '')
  return SPAM_PATTERNS.some((p) => p.test(pure))
}

export function parseComments(rawText) {
  const rawLines = rawText.split(/\r?\n/)
  const normalized = rawLines.map((line) => line.trim()).filter(Boolean)
  const seen = new Set()
  const uniqueComments = []

  normalized.forEach((comment) => {
    const key = comment.replace(/\s+/g, ' ').toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      uniqueComments.push(comment)
    }
  })

  const qualityComments = uniqueComments.filter((c) => !isLowValue(c))
  const filteredCount = uniqueComments.length - qualityComments.length

  return {
    originalCount: normalized.length,
    uniqueCount: uniqueComments.length,
    duplicateCount: normalized.length - uniqueComments.length,
    filteredCount,
    comments: qualityComments,
  }
}
