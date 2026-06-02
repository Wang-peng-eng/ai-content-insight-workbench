const LS_KEY = 'ai_workbench_history'
const MAX_ENTRIES = 20

export function loadHistory() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntry(data) {
  const history = loadHistory()
  history.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    mode: data.mode,
    commentCount: data.commentCount,
    snapshot: data.snapshot,
  })
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(history))
  } catch { /* quota exceeded, silently drop */ }
}

export function deleteEntry(id) {
  const history = loadHistory().filter((e) => e.id !== id)
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(history))
  } catch { /* ignore */ }
}

export function clearAll() {
  try {
    localStorage.removeItem(LS_KEY)
  } catch { /* ignore */ }
}
