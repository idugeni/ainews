import type { ApiResponse, GeminiModel, NewsGenerationRequest, TitleGenerationRequest } from "@/types"

export async function generateTitles(
  topic: string,
  model: GeminiModel,
  category?: string,
): Promise<ApiResponse<ReadableStream<Uint8Array>>> {
  try {
    const response = await fetch("/api/generate-titles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, model, category } as TitleGenerationRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error || `HTTP error ${response.status}`
      throw new Error(errorMessage)
    }

    if (!response.body) {
      throw new Error("Response body is not readable")
    }

    return {
      success: true,
      data: response.body,
    }
  } catch (error) {
    console.error("API error:", error)
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
): Promise<ApiResponse<ReadableStream<Uint8Array>>> {
  try {
    const response = await fetch("/api/generate-news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, model, category } as NewsGenerationRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error || `HTTP error ${response.status}`
      throw new Error(errorMessage)
    }

    if (!response.body) {
      throw new Error("Response body is not readable")
    }

    return {
      success: true,
      data: response.body,
    }
  } catch (error) {
    console.error("API error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
