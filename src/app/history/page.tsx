import { HistoryList } from "@/components/history/history-list"

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">History</h1>
        <p className="text-muted-foreground">View your previously generated titles and news articles.</p>
      </div>

      <HistoryList />
    </div>
  )
}
