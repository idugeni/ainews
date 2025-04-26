"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, CalendarDays, ArrowRight, Trash2 } from "lucide-react"
import type { HistoryItem } from "@/types"
import { formatDate, truncateText } from "@/lib/utils"

interface HistoryNewsCardProps {
  item: HistoryItem
  onDeleteAction: (id: string) => void
  onViewNewsAction: (id: string) => void
}

export function HistoryNewsCard({ item, onDeleteAction, onViewNewsAction }: HistoryNewsCardProps) {
  return (
    <Card className="overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-200 animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-bold">Generated News</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{item.model}</Badge>
          {item.category && <Badge variant="secondary">{item.category}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(new Date(item.createdAt))}</span>
        </div>
        <p className="font-medium text-primary mb-1">{item.title}</p>
        <p className="text-sm text-muted-foreground mb-2">{truncateText(item.content, 150)}</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={() => onViewNewsAction(item.id)} aria-label="Lihat berita lengkap">
            Lihat Berita
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDeleteAction(item.id)} aria-label="Hapus berita ini">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
