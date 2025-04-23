import type { ModelOption } from "@/types"

export const MODELS: ModelOption[] = [
  {
    id: "gemini-2.5-pro-exp-03-25",
    name: "Gemini 2.5 Pro",
    description: "Most capable model for complex tasks",
    maxTokens: 32768,
    isRecommended: true,
  },
  {
    id: "gemini-2.5-flash-preview-04-17",
    name: "Gemini 2.5 Flash",
    description: "Fast and efficient for simpler tasks",
    maxTokens: 16384,
  },
]

export const DEFAULT_MODEL: ModelOption = MODELS[0]
