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
import { ExportOptions } from "@/components/news/NewExportOptions"
import { WordPressPublish } from "@/components/wordpress/WordpressPublish"
import { SeoAnalyzer } from "@/components/seo/SeoAnalyzer"
import type { ModelOption, NewsCategory } from "@/types"
import { FiLoader } from "react-icons/fi"

/**
 * Props untuk NewsForm
 * @typedef {Object} NewsFormProps
 * @property {string} title - Judul berita
 * @property {function} onTitleChange - Callback perubahan judul
 * @property {NewsCategory} selectedCategory - Kategori berita
 * @property {function} onCategoryChange - Callback perubahan kategori
 * @property {ModelOption} selectedModel - Model AI
 * @property {function} onModelChange - Callback perubahan model
 * @property {boolean} isGenerating - Status loading
 * @property {function} onSubmit - Callback submit form
 * @property {string} generatedContent - Konten berita yang dihasilkan
 * @property {string} parsedContent - Konten berita yang telah diproses
 * @property {function} showGeneratedContent - Callback untuk menampilkan konten berita
 */
export interface NewsFormProps {
  title: string
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedCategory: NewsCategory
  onCategoryChange: (cat: NewsCategory) => void
  selectedModel: ModelOption
  onModelChange: (model: ModelOption) => void
  isGenerating: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  generatedContent: string
  parsedContent: string
  showGeneratedContent: boolean
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
  isGenerating,
  onSubmit,
  generatedContent,
  parsedContent,
  showGeneratedContent,
}) => (
  <div className="space-y-6 relative">
    <form onSubmit={onSubmit} className="space-y-4" aria-label="Formulir Berita">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Judul Berita
        </label>
        <Input
          id="title"
          value={title}
          onChange={onTitleChange}
          placeholder="Contoh: Pengaruh AI pada Industri Media di Indonesia"
          disabled={isGenerating}
          className="w-full transition-all duration-200"
          aria-required="true"
          aria-label="Judul Berita"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Kategori Berita
          </label>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryChangeAction={onCategoryChange}
            disabled={isGenerating}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium">
            Model AI
          </label>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChangeAction={onModelChange}
            disabled={isGenerating}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isGenerating || !title.trim()}
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
    {showGeneratedContent && (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Konten Berita yang Dihasilkan:</h2>
          <div className="flex items-center gap-2">
            <ExportOptions content={generatedContent} title={title} />
            <WordPressPublish title={title} content={generatedContent} />
          </div>
        </div>
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="p-6 prose dark:prose-invert max-w-none">
            {parsedContent ? (
              <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
            ) : (
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            )}
          </div>
        </Card>
        <SeoAnalyzer content={generatedContent} title={title} />
      </div>
    )}
  </div>
)
