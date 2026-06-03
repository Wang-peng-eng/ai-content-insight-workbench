const BRIDGE_KEY = 'ai_content_bridge';
const MAX_AGE = 30 * 60 * 1000; // 30 minutes

export function pushToGenerator(data) {
  try {
    const raw = localStorage.getItem(BRIDGE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    // Clean expired entries, then push new one
    const valid = queue.filter(item => Date.now() - item.timestamp < MAX_AGE);
    valid.push({ ...data, timestamp: Date.now() });
    localStorage.setItem(BRIDGE_KEY, JSON.stringify(valid));
  } catch { /* ignore */ }
}

export function popFromBridge() {
  try {
    const raw = localStorage.getItem(BRIDGE_KEY);
    if (!raw) return [];
    const queue = JSON.parse(raw);
    const valid = queue.filter(item => Date.now() - item.timestamp < MAX_AGE);
    localStorage.removeItem(BRIDGE_KEY);
    return valid;
  } catch {
    return [];
  }
}
