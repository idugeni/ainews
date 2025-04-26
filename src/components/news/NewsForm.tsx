/**
 * Komponen form input berita.
 * Hanya bertanggung jawab untuk presentasi dan menerima props dari parent.
 * @module NewsForm
 */
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModelSelector } from "@/components/ui/model-selector"
import { CategorySelector } from "@/components/ui/category-selector"
import { Card } from "@/components/ui/card"
import { ExportOptions } from "@/components/news/NewsExportOptions"
import { SeoAnalyzer } from "@/components/seo/SeoAnalyzer"
import type { ModelOption, NewsCategory, NewsStyle, NewsAudience, NewsTone } from "@/types"
import { FiLoader } from "react-icons/fi"
import { NewsStyleSelector } from "@/components/news/NewsStyleSelector"
import { NewsAudienceSelector } from "@/components/news/NewsAudienceSelector"
import { NewsToneSelector } from "@/components/news/NewsToneSelector"

/**
 * Props untuk NewsForm
 * @typedef {Object} NewsFormProps
 * @property {string} title - Judul berita
 * @property {function} onTitleChange - Callback perubahan judul
 * @property {NewsCategory} selectedCategory - Kategori berita
 * @property {function} onCategoryChange - Callback perubahan kategori
 * @property {ModelOption} selectedModel - Model AI
 * @property {function} onModelChange - Callback perubahan model
 * @property {NewsStyle} style - Gaya berita
 * @property {function} onStyleChange - Callback perubahan gaya
 * @property {NewsAudience} audience - Audiens berita
 * @property {function} onAudienceChange - Callback perubahan audiens
 * @property {NewsTone} tone - Tone berita
 * @property {function} onToneChange - Callback perubahan tone
 * @property {boolean} isGenerating - Status loading
 * @property {function} onSubmit - Callback submit form
 * @property {string} generatedContent - Konten berita yang dihasilkan
 * @property {string} parsedContent - Konten berita yang telah diproses
 * @property {boolean} showGeneratedContent - Menampilkan konten berita
 * @property {Object} errors - Error message untuk field
 * @property {string} prompt - Prompt builder utama
 * @property {function} onShowHistoryAction - Callback menampilkan riwayat
 */
export interface NewsFormProps {
  title: string
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedCategory: NewsCategory
  onCategoryChange: (cat: NewsCategory) => void
  selectedModel: ModelOption
  onModelChange: (model: ModelOption) => void
  style: NewsStyle
  onStyleChange: (style: NewsStyle | "") => void
  audience: NewsAudience
  onAudienceChange: (aud: NewsAudience | "") => void
  tone: NewsTone
  onToneChange: (tone: NewsTone | "") => void
  isGenerating: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  generatedContent: string
  parsedContent: string
  showGeneratedContent: boolean
  errors?: Partial<Record<"title"|"style"|"audience"|"tone"|"category"|"model", string>>
  prompt: string
  onShowHistoryAction: () => void
}

/**
 * Komponen presentasi untuk form input berita
 * @param {NewsFormProps} props
 */
export const NewsForm: React.FC<NewsFormProps> = ({
  title,
  onTitleChange,
  selectedCategory,
  onCategoryChange,
  selectedModel,
  onModelChange,
  style,
  onStyleChange,
  audience,
  onAudienceChange,
  tone,
  onToneChange,
  isGenerating,
  onSubmit,
  generatedContent,
  parsedContent,
  showGeneratedContent,
  errors = {},
  prompt,
  onShowHistoryAction,
}) => {
  // Preview prompt builder
  // NOTE: previewPrompt kini mengambil langsung dari variabel prompt builder utama
  const previewPrompt = prompt

  // Estimasi jumlah kata
  const wordCount = generatedContent ? generatedContent.split(/\s+/).filter(Boolean).length : 0

  // Highlight keyword sederhana: bold kata penting (misal: kategori, judul, gaya, audiens, tone)
  function highlightKeywords(text: string) {
    if (!text) return ""
    let result = text
    const keywords = [title, selectedCategory?.name, style, audience, tone].filter(Boolean)
    for (const key of keywords) {
      if (typeof key === "string" && key.length > 2) {
        const re = new RegExp(`(${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
        result = result.replace(re, "<b>$1</b>")
      }
    }
    return result
  }

  return (
    <Card className="space-y-6 relative p-6">
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2 md:mt-0"
          onClick={onShowHistoryAction}
          disabled={isGenerating}
        >
          Riwayat
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-2">Generate News Content</h1>
      <p className="text-muted-foreground mb-0">
        Masukkan judul dan AI kami akan menghasilkan konten berita lengkap dengan format WordPress. Konten akan terstruktur dengan heading, paragraf, dan kutipan.
      </p>
      <form onSubmit={onSubmit} className="space-y-4" aria-label="Formulir Berita">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Judul Berita <span className="text-red-600">*</span></label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="Masukkan judul berita utama"
            disabled={isGenerating}
            className="mb-1"
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Kategori Berita</label>
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChangeAction={onCategoryChange}
              disabled={isGenerating}
            />
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium">Model AI</label>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChangeAction={onModelChange}
              disabled={isGenerating}
            />
            {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NewsStyleSelector value={style} onChange={onStyleChange} disabled={isGenerating} />
          <NewsAudienceSelector value={audience} onChange={onAudienceChange} disabled={isGenerating} />
          <NewsToneSelector value={tone} onChange={onToneChange} disabled={isGenerating} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {errors.style && <p className="text-sm text-red-600">{errors.style}</p>}
          {errors.audience && <p className="text-sm text-red-600">{errors.audience}</p>}
          {errors.tone && <p className="text-sm text-red-600">{errors.tone}</p>}
        </div>
        <Button
          type="submit"
          disabled={isGenerating || !title.trim() || Object.values(errors).some(Boolean)}
          className="w-full transition-all duration-200 hover:shadow-md"
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <FiLoader className="animate-spin h-5 w-5 text-muted-foreground opacity-100" />
              Membuat Berita...
            </span>
          ) : (
            "Buat Berita"
          )}
        </Button>
      </form>
      {/* Preview Prompt Builder */}
      <Card className="bg-muted border rounded p-4 mt-2">
        <div className="text-xs font-semibold mb-1 text-muted-foreground">Preview Prompt ke AI:</div>
        <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{previewPrompt}</pre>
      </Card>
      {showGeneratedContent && (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md mt-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Konten Berita yang Dihasilkan:</h2>
              <div className="flex items-center gap-2">
                <ExportOptions content={generatedContent} title={title} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center mb-2">
              <span className="text-xs text-muted-foreground">Perkiraan jumlah kata: <b>{wordCount}</b></span>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {parsedContent ? (
                <div dangerouslySetInnerHTML={{ __html: highlightKeywords(parsedContent) }} />
              ) : (
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlightKeywords(generatedContent) }} />
              )}
            </div>
            <SeoAnalyzer content={generatedContent} title={title} />
          </div>
        </Card>
      )}
    </Card>
  )
}
