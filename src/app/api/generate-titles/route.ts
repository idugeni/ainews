import { GoogleGenAI } from "@google/genai"
import { type NextRequest } from "next/server"
import type { TitleGenerationRequest } from "@/types"
import { NEWS_CATEGORIES } from "@/config/Categories"
import { GEMINI_DEFAULT_CONFIG } from "@/config/titles/GeminiConfig"
import { buildTitlePrompt } from "@/lib/prompt/titlePromptBuilder"
import { withRetry, DEFAULT_TIMEOUT_MS, withTimeout } from "@/lib/timeout"

export async function POST(req: NextRequest) {
  try {
    const reqBody = (await req.json()) as TitleGenerationRequest
    let { model } = reqBody
    const topic = reqBody.topic
    const category = reqBody.category
    if (!topic) {
      return new Response("Topic is required", { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      return new Response("Google API key is not configured", { status: 500 })
    }

    let categoryPrompt = ""
    if (category) {
      const selectedCategory = NEWS_CATEGORIES.find((c) => c.id === category)
      if (selectedCategory) {
        categoryPrompt = selectedCategory.prompt
      }
    }

    const ai = new GoogleGenAI({ apiKey })
    // Tambahkan responseMimeType agar hasil konsisten plain text
    const config = {
      ...GEMINI_DEFAULT_CONFIG,
      responseMimeType: 'text/plain',
    }
  
    // Pastikan count bertipe number
    const rawCount = reqBody.count
    const parsedCount = typeof rawCount === 'string' ? parseInt(rawCount, 10) : rawCount
    const count = parsedCount && Number.isInteger(parsedCount) && parsedCount > 0 ? parsedCount : 5
    const { prompt, systemInstruction: sysInstr } = buildTitlePrompt(topic, categoryPrompt, count)

    // Fallback model jika kosong
    if (!model || typeof model !== 'string' || model.length < 3) {
      // Fallback ke model default yang sudah pasti ada di enum GeminiModel
      model = 'gemini-2.5-pro-exp-03-25'
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ]

    // Tipe eksplisit agar lolos TypeScript
    const geminiPayload: {
      model: string
      config: typeof GEMINI_DEFAULT_CONFIG
      contents: typeof contents
      system_instruction?: string
    } = {
      model,
      config,
      contents,
    }
    if (sysInstr) {
      geminiPayload.system_instruction = sysInstr
    }

    // NON-STREAMING: langsung ambil semua hasil sekaligus
    let response = await withRetry(
      () => withTimeout(ai.models.generateContent(geminiPayload), DEFAULT_TIMEOUT_MS, "Timeout saat menunggu respons AI"),
      3, // max 3x percobaan
      500 // jeda antar percobaan (ms)
    )
    let text = response.candidates?.[0]?.content?.parts?.[0]?.text || ""
    // Debug log output asli Gemini (sementara, hapus di produksi)
    // console.log('Gemini raw output:', text)
    let titles = text
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0)
    if (titles.length === 0 && text.trim().length > 0) {
      titles = [text.trim()]
    }
    // Fallback: jika output tetap kosong, ulangi dengan prompt super sederhana
    if (titles.length === 0) {
      const fallbackPrompt = `Buatkan ${count} judul artikel dalam Bahasa Indonesia untuk topik: "${topic}". Daftar judul saja, satu per baris, tanpa penjelasan.`
      const fallbackPayload = {
        model,
        config,
        contents: [
          {
            role: 'user',
            parts: [{ text: fallbackPrompt }],
          },
        ],
        system_instruction: 'Buat daftar judul saja.'
      }
      response = await withRetry(
        () => withTimeout(ai.models.generateContent(fallbackPayload), DEFAULT_TIMEOUT_MS, "Timeout saat menunggu respons AI (fallback)"),
        3,
        500
      )
      text = response.candidates?.[0]?.content?.parts?.[0]?.text || ""
      // console.log('Gemini fallback output:', text)
      titles = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      if (titles.length === 0 && text.trim().length > 0) {
        titles = [text.trim()]
      }
    }
    return new Response(JSON.stringify({ titles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
