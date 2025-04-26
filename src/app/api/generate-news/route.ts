import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"
import { withTimeout, DEFAULT_TIMEOUT_MS } from "@/lib/timeout"
import type { NewsGenerationRequest } from "@/types"
import { buildNewsPrompt } from "@/lib/news/newsPromptBuilder"
import { GEMINI_DEFAULT_CONFIG } from "@/config/news/GeminiConfig"
import { NEWS_CATEGORIES } from "@/config/Categories"

export async function POST(req: NextRequest) {
  try {
    const { title, model, category, style, audience, tone } = (await req.json()) as NewsGenerationRequest

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google API key is not configured" }, { status: 500 })
    }

    let categoryName = ""
    if (category) {
      const found = NEWS_CATEGORIES.find((c) => c.id === category)
      if (found) categoryName = found.name
    }

    // Gunakan builder prompt modular
    const promptText = buildNewsPrompt(title, categoryName, style, audience, tone)
    const config = GEMINI_DEFAULT_CONFIG
    const contents = [
      {
        role: "user",
        parts: [{ text: promptText }],
      },
    ]

    // Non-stream: gunakan generateContent (bukan generateContentStream)
    const ai = new GoogleGenAI({ apiKey })
    const response = await withTimeout(
      ai.models.generateContent({
        model,
        config,
        contents,
      }),
      DEFAULT_TIMEOUT_MS,
      "News generation timed out",
    )

    // Ambil hasil text dari response
    const resultText = response?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    return NextResponse.json({ result: resultText })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
