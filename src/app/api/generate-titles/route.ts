import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"
import { withTimeout, DEFAULT_TIMEOUT_MS } from "@/lib/timeout"
import type { TitleGenerationRequest } from "@/types"
import { NEWS_CATEGORIES } from "@/config/categories"

export async function POST(req: NextRequest) {
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()

  try {
    const { topic, model, category } = (await req.json()) as TitleGenerationRequest

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_API_KEY

    if (!apiKey) {
      console.error("Google API key is missing in environment variables")
      return NextResponse.json({ error: "Google API key is not configured" }, { status: 500 })
    }

    // Get category prompt if provided
    let categoryPrompt = ""
    if (category) {
      const selectedCategory = NEWS_CATEGORIES.find((c) => c.id === category)
      if (selectedCategory) {
        categoryPrompt = selectedCategory.prompt
      }
    }

    // Initialize the Google Generative AI
    const ai = new GoogleGenAI({
      apiKey,
    })

    // Configure generation
    const config = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
      responseMimeType: "text/plain",
    }

    // Prepare the prompt
    const promptText = `${categoryPrompt || "Generate"} 5 catchy and engaging news headlines about "${topic}". 
    Format the response as a numbered list (1., 2., etc.). 
    Each headline should be concise (under 15 words) and attention-grabbing. 
    Do not include any explanations or additional text.`

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: promptText,
          },
        ],
      },
    ]

    console.log(
      `Using model: ${model}, API key length: ${apiKey.length}, Topic: ${topic}, Category: ${category || "None"}`,
    )

    // Create a streaming call
    const response = await withTimeout(
      ai.models.generateContentStream({
        model,
        config,
        contents,
      }),
      DEFAULT_TIMEOUT_MS,
      "Title generation timed out",
    )

    // Process the stream
    for await (const chunk of response) {
      const chunkText = chunk.text
      if (chunkText) {
        await writer.write(new TextEncoder().encode(chunkText))
      }
    }

    await writer.close()
    return new Response(responseStream.readable)
  } catch (error) {
    console.error("Error generating titles:", error)

    try {
      await writer.abort(error as Error)
    } catch {
      // Ignore errors from aborting the writer
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
