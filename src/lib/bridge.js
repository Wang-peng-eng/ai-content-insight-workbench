const BRIDGE_KEY = 'ai_content_bridge';

export function pushToGenerator(data) {
  const payload = {
    ...data,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(BRIDGE_KEY, JSON.stringify(payload));
  } catch { /* ignore */ }
}

export function popFromBridge() {
  try {
    const raw = localStorage.getItem(BRIDGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Auto-expire after 30 minutes
    if (Date.now() - data.timestamp > 30 * 60 * 1000) {
      localStorage.removeItem(BRIDGE_KEY);
      return null;
    }
    localStorage.removeItem(BRIDGE_KEY);
    return data;
  } catch {
    return null;
  }
}

export function peekFromBridge() {
  try {
    const raw = localStorage.getItem(BRIDGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.timestamp > 30 * 60 * 1000) {
      localStorage.removeItem(BRIDGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
