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

  return {
    originalCount: normalized.length,
    uniqueCount: uniqueComments.length,
    duplicateCount: normalized.length - uniqueComments.length,
    comments: uniqueComments,
  }
}
