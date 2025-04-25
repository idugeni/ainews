import type { IconType } from "react-icons"

// Model types
export type GeminiModel = "gemini-2.5-pro-exp-03-25" | "gemini-2.5-flash-preview-04-17"

export interface ModelOption {
  id: GeminiModel
  name: string
  description: string
  maxTokens: number
  isRecommended?: boolean
}

// Category types
export interface NewsCategory {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  prompt: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Title generation types
/**
 * Request body untuk generate judul berita
 */
export interface TitleGenerationRequest {
  topic: string
  model: GeminiModel
  category?: string
  count?: number // jumlah judul yang ingin digenerate
  // systemInstruction diatur otomatis di backend/prompt builder
}

// News generation types
export interface NewsGenerationRequest {
  title: string
  model: GeminiModel
  category?: string
}

// Theme types
export type Theme = "light" | "dark" | "system"

// History types
export interface HistoryItem {
  id: string
  type: "title" | "news"
  content: string
  topic?: string
  title?: string
  category?: string
  model: GeminiModel
  createdAt: string
}

// SEO Analysis types
export interface SeoAnalysisResult {
  score: number
  readability: {
    score: number
    feedback: string[]
  }
  keywords: {
    score: number
    extracted: string[]
    feedback: string[]
  }
  structure: {
    score: number
    feedback: string[]
  }
  suggestions: string[]
}

// WordPress types
export interface WordPressCredentials {
  url: string
  username: string
  password: string
}

export interface WordPressPostRequest {
  title: string
  content: string
  status: "draft" | "publish"
  categories?: number[]
  tags?: string[]
}

export interface WordPressPostResponse {
  id: number
  link: string
}
