"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Copy, Check, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function NewsGenerator() {
  const [title, setTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const titleFromParams = searchParams.get("title")
    if (titleFromParams) {
      setTitle(titleFromParams)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsGenerating(true)
    setGeneratedResponse("")
    setError("")

    try {
      const response = await fetch("/api/generate-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`${response.status}: ${errorText}`)
      }

      // Handle regular response
      const text = await response.text()
      setGeneratedResponse(text)
    } catch (err) {
      console.error("Error generating news:", err)
      setError(`Failed to generate news content: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResponse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Enter a news title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., New Study Reveals Impact of Climate Change on Coastal Cities"
            disabled={isGenerating}
          />
        </div>
        <Button type="submit" disabled={isGenerating || !title.trim()}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate News Content"
          )}
        </Button>
      </form>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {generatedResponse && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Generated News Content:</h2>
            <Button size="sm" variant="outline" onClick={copyToClipboard} className="flex items-center gap-1">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <Card>
            <CardContent className="p-4 prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{generatedResponse}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
