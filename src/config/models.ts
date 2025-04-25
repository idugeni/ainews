import type { ModelOption } from "@/types"

export const MODELS: ModelOption[] = [
  {
    id: "gemini-2.5-pro-exp-03-25",
    name: "Gemini 2.5 Pro (Eksperimental)",
    description: "Model terbaik untuk tugas kompleks dan analisis konteks panjang.",
    maxTokens: 65536,
    isRecommended: true,
  },
  {
    id: "gemini-2.5-flash-preview-04-17",
    name: "Gemini 2.5 Flash (Preview)",
    description: "Model terbaik kami dalam hal performa harga, yang menawarkan kemampuan yang lengkap.",
    maxTokens: 65536,
  },
]

export const DEFAULT_MODEL: ModelOption = MODELS[0]
