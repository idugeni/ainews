"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, ArrowRight } from "lucide-react"
import type { HistoryItem } from "@/types"
import { formatDate } from "@/lib/utils"
import { FiBox, FiSettings, FiTag } from "react-icons/fi"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface HistoryTitleCardProps {
  item: HistoryItem
  onUseTitleAction: (title: string) => void
}

export function HistoryTitleCard({ item, onUseTitleAction }: HistoryTitleCardProps) {
  return (
    <Card className="overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-200 animate-fade-in w-full">
      <CardHeader className="pb-2 flex flex-col items-center text-center gap-1">
        <div className="bg-primary/10 rounded-full flex items-center justify-center w-12 h-12 mb-2">
          <FiBox className="w-7 h-7 text-primary" />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="text-lg font-bold mb-1 cursor-pointer truncate max-w-full" tabIndex={0}>
                {item.topic}
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <span>{item.topic}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-wrap justify-center items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal flex items-center gap-1">
            <FiSettings className="w-3 h-3" /> {item.model}
          </Badge>
          {item.category && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 font-normal flex items-center gap-1">
              <FiTag className="w-3 h-3" /> {item.category}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-1">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(new Date(item.createdAt))}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-3">
          {item.content
            .split("\n")
            .filter((line) => line.trim())
            .map((title, index) => (
              <div key={index} className="flex justify-between items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate font-medium text-base cursor-pointer max-w-[70%]" tabIndex={0}>
                        {title.replace(/^\d+\.\s*/, "")}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{title.replace(/^\d+\.\s*/, "")}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUseTitleAction(title.replace(/^\d+\.\s*/, ""))}
                  className="ml-2 min-w-[90px]"
                  aria-label="Gunakan judul ini"
                >
                  Gunakan
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
