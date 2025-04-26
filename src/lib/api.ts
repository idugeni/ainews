import type { ApiResponse, GeminiModel, NewsGenerationRequest, TitleGenerationRequest, NewsStyle, NewsAudience, NewsTone } from "@/types"

export async function generateTitles(
  topic: string,
  model: GeminiModel,
  category?: string,
  count?: number,
): Promise<ApiResponse<{ titles: string[] }>> {
  try {
    const response = await fetch("/api/generate-titles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, model, category, count } as TitleGenerationRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error || `HTTP error ${response.status}`
      throw new Error(errorMessage)
    }

    // Expect JSON response (non-streaming)
    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function generateNews(
  title: string,
  model: GeminiModel,
  category?: string,
  style?: NewsStyle,
  audience?: NewsAudience,
  tone?: NewsTone,
): Promise<ApiResponse<{ result: string }>> {
  try {
    const response = await fetch("/api/generate-news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, model, category, style, audience, tone } as NewsGenerationRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error || `HTTP error ${response.status}`
      throw new Error(errorMessage)
    }

    // Expect JSON response: { result: string }
    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
