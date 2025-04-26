"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getHistoryItem } from "@/lib/storage"
import { ArrowLeft, Loader2 } from "lucide-react"
import { marked } from "marked"
import { ExportOptions } from "@/components/news/NewsExportOptions"
import { WordPressPublish } from "@/components/wordpress/WordpressPublish"
import { SeoAnalyzer } from "@/components/seo/SeoAnalyzer"

// Define a type for the history item
interface HistoryItem {
  title: string;
  content: string;
  [key: string]: string | number | boolean | null | undefined;
}

export default function HistoryItemPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<HistoryItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [parsedContent, setParsedContent] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      const historyItem = getHistoryItem(params.id) as HistoryItem | null
      setItem(historyItem)

      if (historyItem?.content) {
        try {
          const parsed = marked.parse(historyItem.content)
          setParsedContent(parsed as string)
        } catch {
          setParsedContent(historyItem.content as string)
        }
      }

      setIsLoading(false)
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The history item you&#39;re looking for doesn&#39;t exist or has been deleted.
        </p>
        <Button onClick={() => router.push("/history")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/history")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>

        <div className="flex items-center gap-2">
          <ExportOptions content={item.content} title={item.title || "news-content"} />
          <WordPressPublish title={item.title} content={item.content} />
        </div>
      </div>
      <Card className="overflow-hidden mb-8">
        <div className="p-6 prose dark:prose-invert max-w-none">
          {parsedContent ? (
            <div dangerouslySetInnerHTML={{ __html: (parsedContent as string).replace(/'/g, "&#39;") }} />
          ) : (
            <div className="whitespace-pre-wrap">{((item && item.content) ? (item.content as string).replace(/'/g, "&#39;") : "")}</div>
          )}
        </div>
      </Card>
      <div className="mb-8">
        <SeoAnalyzer content={item.content} title={item.title} />
      </div>
    </div>
  );
}
