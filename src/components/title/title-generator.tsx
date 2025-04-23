"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TitleGenerator() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setIsGenerating(true)
    setGeneratedResponse("")
    setError("")

    try {
      const response = await fetch("/api/generate-titles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`${response.status}: ${errorText}`)
      }

      // Handle regular response
      const text = await response.text()
      setGeneratedResponse(text)
    } catch (err) {
      console.error("Error generating titles:", err)
      setError(`Failed to generate titles: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseTitle = (title: string) => {
    router.push(`/news?title=${encodeURIComponent(title.trim())}`)
  }

  // Parse titles from the response
  const titles = generatedResponse
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Enter a news topic
          </label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., climate change, technology, sports"
            disabled={isGenerating}
          />
        </div>
        <Button type="submit" disabled={isGenerating || !topic.trim()}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Titles"
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
          <h2 className="text-xl font-semibold">Generated Titles:</h2>
          <div className="grid gap-3">
            {titles.length > 0 ? (
              titles.map((title, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4 flex justify-between items-center">
                    <p className="font-medium">{title}</p>
                    <Button size="sm" onClick={() => handleUseTitle(title)}>
                      Use This Title
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No valid titles found in the response. Try again with a different topic.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
