import type { HistoryItem } from "@/types"

const HISTORY_KEY = "news-generator-history"

export function saveToHistory(item: HistoryItem): void {
  try {
    const history = getHistory()
    const updatedHistory = [item, ...history].slice(0, 50) // Keep only the last 50 items
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Error saving to history:", error)
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error("Error getting history:", error)
    return []
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error("Error clearing history:", error)
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory()
    const updatedHistory = history.filter((item) => item.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Error deleting history item:", error)
  }
}

export function getHistoryItem(id: string): HistoryItem | null {
  try {
    const history = getHistory()
    return history.find((item) => item.id === id) || null
  } catch (error) {
    console.error("Error getting history item:", error)
    return null
  }
}
