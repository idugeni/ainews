import type { HistoryItem } from "@/types"

const HISTORY_KEY = "news-generator-history"

export function saveToHistory(item: HistoryItem): void {
  try {
    const history = getHistory()
    const updatedHistory = [item, ...history].slice(0, 50) // Keep only the last 50 items
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch {
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch {
  }
  return []
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory()
    const updatedHistory = history.filter((item) => item.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch {
  }
}

export function getHistoryItem(id: string): HistoryItem | null {
  try {
    const history = getHistory()
    return history.find((item) => item.id === id) || null
  } catch {
  }
  return null
}

// Hapus semua riwayat dengan type "title"
export function clearTitleHistory(): void {
  try {
    const history = getHistory()
    const filtered = history.filter(item => item.type !== "title")
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
  } catch {}
}

// Hapus semua riwayat dengan type "news"
export function clearNewsHistory(): void {
  try {
    const history = getHistory()
    const filtered = history.filter(item => item.type !== "news")
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
  } catch {}
}
