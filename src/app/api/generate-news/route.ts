import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"
import { withTimeout, DEFAULT_TIMEOUT_MS } from "@/lib/timeout"
import type { NewsGenerationRequest } from "@/types"
import { NEWS_CATEGORIES } from "@/config/categories"

export async function POST(req: NextRequest) {
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()

  try {
    const { title, model, category } = (await req.json()) as NewsGenerationRequest

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
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
      maxOutputTokens: 2048,
      responseMimeType: "text/plain",
    }

    // Prepare the prompt
    const promptText = `${categoryPrompt || "Write a news article with this title:"} "${title}".
    
    Follow this WordPress post format structure:
    
    1. Start with the title as an H1 heading
    2. Write a compelling introduction paragraph (2-3 sentences)
    3. Include 3-4 main content sections with appropriate H2 subheadings
    4. Each section should have 2-3 paragraphs of relevant content
    5. Include a relevant quote if appropriate (in blockquote format)
    6. End with a conclusion paragraph
    
    Make the content factual-sounding, informative, and engaging.
    Use a journalistic tone appropriate for news.
    Keep the total length between 500-800 words.
    Format the content with proper Markdown syntax.
    
    Do not include any explanations or additional text outside the article content.`

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
      `Using model: ${model}, API key length: ${apiKey.length}, Title: ${title}, Category: ${category || "None"}`,
    )

    // Create a streaming call
    const response = await withTimeout(
      ai.models.generateContentStream({
        model,
        config,
        contents,
      }),
      DEFAULT_TIMEOUT_MS,
      "News generation timed out",
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
    console.error("Error generating news:", error)

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
