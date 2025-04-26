/**
 * Komponen form input berita.
 * Hanya bertanggung jawab untuk presentasi dan menerima props dari parent.
 * @module NewsForm
 */
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModelSelector } from "@/components/common/ModelSelector"
import { CategorySelector } from "@/components/common/CategorySelector"
import { Card } from "@/components/ui/card"
// import { ExportOptions } from "@/components/news/NewsExportOptions";
// import { SeoAnalyzer } from "@/components/seo/SeoAnalyzer";
import type { ModelOption, NewsCategory, NewsStyle, NewsAudience, NewsTone } from "@/types"
import { FiLoader } from "react-icons/fi"
import { NewsStyleSelector } from "@/components/news/NewsStyleSelector"
import { NewsAudienceSelector } from "@/components/news/NewsAudienceSelector"
import { NewsToneSelector } from "@/components/news/NewsToneSelector"
import NewsPromptPreview from "@/components/news/NewsPromptPreview";
import NewsResultPreview from "@/components/news/NewsResultPreview";
import { highlightKeywords, wordCount } from "@/components/news/newsUtils";

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
  const previewPrompt = prompt;

  // Estimasi jumlah kata
  const totalWordCount = wordCount(generatedContent);

  // Highlight keyword sederhana
  const keywords = [title, selectedCategory?.name, style, audience, tone];
  const highlight = (text: string) => highlightKeywords(text, keywords);

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
      <div className="mb-2">
        <h1 className="text-3xl font-bold mb-2">Generate News Content</h1>
        <p className="text-muted-foreground">
          Masukkan judul dan AI kami akan menghasilkan konten berita lengkap dengan format WordPress. Konten akan terstruktur dengan heading, paragraf, dan kutipan.
        </p>
      </div>
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
        <NewsPromptPreview prompt={previewPrompt} />
      </form>
      <NewsResultPreview
        generatedContent={generatedContent}
        parsedContent={parsedContent}
        showGeneratedContent={showGeneratedContent}
        highlightKeywords={highlight}
        title={title}
        wordCount={totalWordCount}
      />
    </Card>
  )
}
