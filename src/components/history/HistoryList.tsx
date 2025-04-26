"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getHistory, clearHistory, deleteHistoryItem, clearTitleHistory, clearNewsHistory } from "@/lib/storage"
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
import { HistoryTitleCard } from "@/components/history/HistoryTitleCard"
import { HistoryNewsCard } from "@/components/history/HistoryNewsCard"
import { Trash2, FileText, Newspaper, RefreshCw } from "lucide-react"

export function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'titles' | 'news'>('all')
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

  const handleClearTitleHistory = () => {
    try {
      clearTitleHistory()
      loadHistory()
      toast.success("Semua judul berhasil dihapus")
    } catch (error) {
      console.error("Error clearing title history:", error)
      toast.error("Gagal menghapus judul")
    }
  }

  const handleClearNewsHistory = () => {
    try {
      clearNewsHistory()
      loadHistory()
      toast.success("Semua berita berhasil dihapus")
    } catch (error) {
      console.error("Error clearing news history:", error)
      toast.error("Gagal menghapus berita")
    }
  }

  const titleHistory = history.filter((item) => item.type === "title")
  const newsHistory = history.filter((item) => item.type === "news")

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 animate-fade-in">
        <RefreshCw className="h-10 w-10 animate-spin text-primary mb-2" />
        <div className="text-base text-muted-foreground">Memuat riwayat...</div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/title")}>
            <FileText className="mr-2 h-5 w-5" />Buat Judul
          </Button>
          <Button variant="outline" onClick={() => router.push("/news")}> 
            <Newspaper className="mr-2 h-5 w-5" />Buat Berita
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="all" className="w-full animate-fade-in" onValueChange={(tab) => setActiveTab(tab as 'all' | 'titles' | 'news')}>
        <TabsList className="mb-4 gap-2 w-full flex">
          <TabsTrigger value="all" className="flex-1 justify-center">
            Semua <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-xs font-semibold">{history.length}</span>
          </TabsTrigger>
          <TabsTrigger value="titles" className="flex-1 justify-center">
            Judul <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-xs font-semibold">{titleHistory.length}</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex-1 justify-center">
            Berita <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-xs font-semibold">{newsHistory.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="flex flex-col gap-4">
          {[...titleHistory, ...newsHistory].length > 0 ? (
            [...titleHistory, ...newsHistory].map((item) => (
              item.type === "title" ? (
                <HistoryTitleCard
                  key={item.id}
                  item={item}
                  onUseTitleAction={handleUseTitle}
                />
              ) : (
                <HistoryNewsCard
                  key={item.id}
                  item={item}
                  onDeleteAction={handleDeleteItem}
                  onViewNewsAction={handleViewNews}
                />
              )
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Tidak ada riwayat ditemukan.</p>
          )}
        </TabsContent>
        <TabsContent value="titles" className="flex flex-col gap-4">
          {titleHistory.length > 0 ? (
            titleHistory.map((item) => (
              <HistoryTitleCard
                key={item.id}
                item={item}
                onUseTitleAction={handleUseTitle}
              />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Tidak ada riwayat judul.</p>
          )}
        </TabsContent>
        <TabsContent value="news" className="flex flex-col gap-4">
          {newsHistory.length > 0 ? (
            newsHistory.map((item) => (
              <HistoryNewsCard
                key={item.id}
                item={item}
                onDeleteAction={handleDeleteItem}
                onViewNewsAction={handleViewNews}
              />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Tidak ada riwayat berita.</p>
          )}
        </TabsContent>
      </Tabs>
      {(activeTab === 'all' && history.length > 0) && (
        <div className="mt-8 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />Hapus Seluruh Riwayat
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin hapus semua riwayat?</AlertDialogTitle>
                <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Semua judul & berita akan dihapus permanen.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory}>Hapus</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {(activeTab === 'titles' && titleHistory.length > 0) && (
        <div className="mt-8 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />Hapus Semua Judul
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin hapus semua judul?</AlertDialogTitle>
                <AlertDialogDescription>Semua riwayat judul akan dihapus permanen.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearTitleHistory}>Hapus</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {(activeTab === 'news' && newsHistory.length > 0) && (
        <div className="mt-8 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />Hapus Semua Berita
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin hapus semua berita?</AlertDialogTitle>
                <AlertDialogDescription>Semua riwayat berita akan dihapus permanen.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearNewsHistory}>Hapus</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
