"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getHistory, clearHistory, deleteHistoryItem } from "@/lib/storage"
import { truncateText, formatDate } from "@/lib/utils"
import { Trash2, ArrowRight, FileText, Newspaper, History, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import type { HistoryItem } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    setIsLoading(true)
    try {
      const items = getHistory()
      setHistory(items)
    } catch (error) {
      console.error("Error loading history:", error)
      toast.error("Failed to load history")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = () => {
    try {
      clearHistory()
      setHistory([])
      toast.success("History cleared successfully")
    } catch (error) {
      console.error("Error clearing history:", error)
      toast.error("Failed to clear history")
    }
  }

  const handleDeleteItem = (id: string) => {
    try {
      deleteHistoryItem(id)
      setHistory(history.filter((item) => item.id !== id))
      toast.success("Item deleted successfully")
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete item")
    }
  }

  const handleUseTitle = (title: string) => {
    router.push(`/news?title=${encodeURIComponent(title.trim())}`)
  }

  const handleViewNews = (id: string) => {
    router.push(`/history/${id}`)
  }

  const titleHistory = history.filter((item) => item.type === "title")
  const newsHistory = history.filter((item) => item.type === "news")

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No History Found</h3>
        <p className="text-muted-foreground mb-6">Your generated titles and news will appear here.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/title")}>Generate Titles</Button>
          <Button variant="outline" onClick={() => router.push("/news")}>
            Generate News
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your History</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearHistory}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({history.length})</TabsTrigger>
          <TabsTrigger value="titles">Titles ({titleHistory.length})</TabsTrigger>
          <TabsTrigger value="news">News ({newsHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {history.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onDelete={handleDeleteItem}
              onUseTitle={handleUseTitle}
              onViewNews={handleViewNews}
            />
          ))}
        </TabsContent>

        <TabsContent value="titles" className="space-y-4">
          {titleHistory.length > 0 ? (
            titleHistory.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={handleDeleteItem}
                onUseTitle={handleUseTitle}
                onViewNews={handleViewNews}
              />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">No title history found.</p>
          )}
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          {newsHistory.length > 0 ? (
            newsHistory.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={handleDeleteItem}
                onUseTitle={handleUseTitle}
                onViewNews={handleViewNews}
              />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">No news history found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface HistoryCardProps {
  item: HistoryItem
  onDelete: (id: string) => void
  onUseTitle: (title: string) => void
  onViewNews: (id: string) => void
}

function HistoryCard({ item, onDelete, onUseTitle, onViewNews }: HistoryCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {item.type === "title" ? (
              <FileText className="h-5 w-5 text-primary" />
            ) : (
              <Newspaper className="h-5 w-5 text-primary" />
            )}
            <CardTitle className="text-lg">{item.type === "title" ? "Generated Titles" : "Generated News"}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{item.model}</Badge>
            {item.category && <Badge variant="secondary">{item.category}</Badge>}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{formatDate(new Date(item.createdAt))}</div>
      </CardHeader>
      <CardContent>
        {item.type === "title" ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Topic: {item.topic}</p>
            <div className="space-y-1">
              {item.content
                .split("\n")
                .filter((line) => line.trim())
                .map((title, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                    <p>{title.replace(/^\d+\.\s*/, "")}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUseTitle(title.replace(/^\d+\.\s*/, ""))}
                      className="ml-2"
                    >
                      Use <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">{truncateText(item.content, 150)}</p>
            <div className="flex justify-between items-center mt-4">
              <Button size="sm" onClick={() => onViewNews(item.id)}>
                View Full Article
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
