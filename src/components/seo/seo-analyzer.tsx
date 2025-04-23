"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { SeoAnalysisResult } from "@/types"

interface SeoAnalyzerProps {
  content: string
  title: string
}

export function SeoAnalyzer({ content, title }: SeoAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<SeoAnalysisResult | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    try {
      // In a real app, you would call an API for SEO analysis
      // For this demo, we'll simulate the analysis
      const analysisResult = await simulateSeoAnalysis(content, title)
      setResult(analysisResult)
    } catch (error) {
      console.error("Error analyzing content:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          SEO Analysis
        </CardTitle>
        <CardDescription>Analyze your content for search engine optimization.</CardDescription>
      </CardHeader>
      <CardContent>
        {!result ? (
          <div className="flex justify-center py-6">
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Content"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Overall SEO Score</h3>
                <span className="font-bold">{result.score}%</span>
              </div>
              <Progress value={result.score} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {result.score >= 80
                  ? "Great job! Your content is well-optimized for search engines."
                  : result.score >= 60
                    ? "Good start! With a few improvements, your content could rank better."
                    : "Your content needs improvement to rank well in search engines."}
              </p>
            </div>

            <Tabs defaultValue="readability">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="readability">Readability</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
              </TabsList>

              <TabsContent value="readability" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Readability Score</h3>
                  <span className="font-bold">{result.readability.score}%</span>
                </div>
                <Progress value={result.readability.score} className="h-2" />

                <div className="space-y-2 mt-4">
                  {result.readability.feedback.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {item.startsWith("+") ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : item.startsWith("-") ? (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm">{item.substring(2)}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Keyword Optimization</h3>
                  <span className="font-bold">{result.keywords.score}%</span>
                </div>
                <Progress value={result.keywords.score} className="h-2" />

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Detected Keywords:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.extracted.map((keyword, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  {result.keywords.feedback.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {item.startsWith("+") ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : item.startsWith("-") ? (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm">{item.substring(2)}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="structure" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Content Structure</h3>
                  <span className="font-bold">{result.structure.score}%</span>
                </div>
                <Progress value={result.structure.score} className="h-2" />

                <div className="space-y-2 mt-4">
                  {result.structure.feedback.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {item.startsWith("+") ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : item.startsWith("-") ? (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm">{item.substring(2)}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Improvement Suggestions</h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Simulate SEO analysis (in a real app, this would be an API call)
async function simulateSeoAnalysis(content: string, title: string): Promise<SeoAnalysisResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Count words
  const wordCount = content.split(/\s+/).filter(Boolean).length

  // Count headings
  const h1Count = (content.match(/^# /gm) || []).length
  const h2Count = (content.match(/^## /gm) || []).length

  // Extract potential keywords (simple implementation)
  const words = content
    .toLowerCase()
    .split(/\W+/)
    .filter(
      (word) => word.length > 3 && !["this", "that", "with", "from", "have", "were", "they", "their"].includes(word),
    )

  const wordFrequency: Record<string, number> = {}
  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  })

  const keywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)

  // Calculate scores
  const readabilityScore = Math.min(
    100,
    Math.max(
      0,
      50 +
        (wordCount > 300 ? 15 : 0) +
        (wordCount > 600 ? 10 : 0) +
        (content.split(".").length > 10 ? 10 : 0) +
        (content.includes("![") ? 15 : 0),
    ),
  )

  const keywordScore = Math.min(
    100,
    Math.max(
      0,
      60 +
        (keywords.some((k) => title.toLowerCase().includes(k)) ? 20 : 0) +
        (keywords.length >= 3 ? 10 : 0) +
        (content.toLowerCase().includes(title.toLowerCase()) ? 10 : 0),
    ),
  )

  const structureScore = Math.min(
    100,
    Math.max(0, 50 + (h1Count === 1 ? 20 : 0) + (h2Count >= 2 ? 15 : 0) + (content.includes("> ") ? 15 : 0)),
  )

  // Overall score
  const overallScore = Math.round((readabilityScore + keywordScore + structureScore) / 3)

  return {
    score: overallScore,
    readability: {
      score: readabilityScore,
      feedback: [
        wordCount > 300 ? "+ Good content length" : "- Content is too short, aim for at least 300 words",
        content.split(".").length > 10
          ? "+ Good sentence count"
          : "? Consider adding more sentences for better readability",
        content.includes("![") ? "+ Images improve engagement" : "- Consider adding images to your content",
        wordCount > 1000
          ? "? Content might be too long for some readers"
          : "+ Content length is appropriate for most readers",
      ],
    },
    keywords: {
      score: keywordScore,
      extracted: keywords,
      feedback: [
        keywords.some((k) => title.toLowerCase().includes(k))
          ? "+ Title contains a primary keyword"
          : "- Add a primary keyword to your title",
        keywords.length >= 3 ? "+ Good keyword variety" : "- Try to include more relevant keywords",
        content.toLowerCase().includes(title.toLowerCase())
          ? "+ Content includes the title"
          : "- Consider including the title in your content",
        "? Consider researching more specific keywords for your topic",
      ],
    },
    structure: {
      score: structureScore,
      feedback: [
        h1Count === 1 ? "+ Has a main heading (H1)" : "- Add a single main heading (H1)",
        h2Count >= 2 ? "+ Good use of subheadings (H2)" : "- Add more subheadings (H2) to structure your content",
        content.includes("> ")
          ? "+ Contains blockquotes or callouts"
          : "- Consider adding blockquotes for important points",
        h1Count > 1 ? "- Too many H1 headings, use only one" : "+ Correct number of H1 headings",
      ],
    },
    suggestions: [
      "Make sure your title is compelling and includes your primary keyword",
      "Break up long paragraphs into smaller, more digestible chunks",
      "Add internal and external links to provide more value",
      "Include a meta description that summarizes your content",
      "Use bullet points or numbered lists for better readability",
    ],
  }
}
