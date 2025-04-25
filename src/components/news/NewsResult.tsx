/**
 * Komponen presentasi untuk menampilkan hasil berita (bukan list).
 * @module NewsResult
 */
import React from "react"
import { Card } from "@/components/ui/card"

/**
 * Props untuk NewsResult
 * @typedef {Object} NewsResultProps
 * @property {string} content - Isi berita yang dihasilkan.
 */
export interface NewsResultProps {
  /** Isi berita yang dihasilkan */
  content: string
}

/**
 * Komponen presentasi untuk menampilkan hasil berita.
 * @param {NewsResultProps} props
 */
export const NewsResult: React.FC<NewsResultProps> = ({ content }) => (
  <div className="space-y-4 animate-fade-in">
    <h2 className="text-xl font-semibold">Berita yang Dihasilkan:</h2>
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-6 prose dark:prose-invert max-w-none whitespace-pre-wrap">
        {content}
      </div>
    </Card>
  </div>
)
