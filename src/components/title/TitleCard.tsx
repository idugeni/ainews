import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React from "react"
import { toast } from "sonner"
import { FiCopy, FiCheckCircle, FiBookmark, FiAward, FiAlertCircle } from "react-icons/fi"

// --- Klasifikasi Panjang Judul Berdasarkan Karakter (SEO) ---
export const TITLE_LENGTH_SEO_CLASSES = [
  {
    range: '< 15',
    label: 'Sangat Pendek',
    description: 'Judul terlalu singkat, kurang informatif, sulit mengandung keyword utama.'
  },
  {
    range: '15 – 29',
    label: 'Pendek',
    description: 'Kurang optimal, sering gagal menyampaikan konteks/topik secara jelas.'
  },
  {
    range: '30 – 39',
    label: 'Cukup Pendek',
    description: 'Mulai informatif, tapi masih berpotensi kehilangan keyword long-tail penting.'
  },
  {
    range: '40 – 55',
    label: 'Ideal',
    description: 'Rentang terbaik untuk SEO: mudah dibaca, cukup ruang untuk keyword utama & long-tail.'
  },
  {
    range: '56 – 65',
    label: 'Cukup Panjang',
    description: 'Masih aman untuk SEO, namun pastikan tetap fokus & tidak bertele-tele.'
  },
  {
    range: '66 – 75',
    label: 'Panjang',
    description: 'Risiko terpotong di hasil pencarian, keyword utama bisa tersembunyi.'
  },
  {
    range: '76 – 80',
    label: 'Terlalu Panjang',
    description: 'Hampir pasti terpotong di SERP, judul jadi kurang efektif untuk klik & SEO.'
  },
  {
    range: '> 80',
    label: 'Sangat Panjang',
    description: 'Tidak direkomendasikan: judul akan terpotong, kehilangan daya tarik & relevansi SEO.'
  },
]

interface TitleCardProps {
  title: string
  index: number
  categoryName: string
  modelName: string
  onUse: (title: string) => void
}

// Mapping warna badge SEO ke semantic Tailwind
const SEO_BADGE_COLORS: Record<string, string> = {
  'Sangat Pendek': 'bg-destructive text-destructive-foreground',
  'Pendek': 'bg-warning text-warning-foreground',
  'Cukup Pendek': 'bg-warning text-warning-foreground',
  'Ideal': 'bg-success text-success-foreground',
  'Cukup Panjang': 'bg-warning text-warning-foreground',
  'Panjang': 'bg-warning text-warning-foreground',
  'Terlalu Panjang': 'bg-destructive text-destructive-foreground',
  'Sangat Panjang': 'bg-destructive text-destructive-foreground',
  'Clickbait': 'bg-accent text-accent-foreground',
}

// Mapping warna kategori berita ke semantic (opsional, fallback ke bg-secondary)
const CATEGORY_BADGE_COLOR = 'bg-secondary text-secondary-foreground'

// Mapping warna badge jumlah karakter ke semantic
const LENGTH_BADGE_COLOR = 'bg-muted text-muted-foreground'

// Fungsi untuk mengklasifikasikan panjang judul berdasarkan karakter
export function classifyTitleLength(charCount: number) {
  if (charCount < 15) return TITLE_LENGTH_SEO_CLASSES[0]
  if (charCount < 30) return TITLE_LENGTH_SEO_CLASSES[1]
  if (charCount < 40) return TITLE_LENGTH_SEO_CLASSES[2]
  if (charCount < 56) return TITLE_LENGTH_SEO_CLASSES[3]
  if (charCount < 66) return TITLE_LENGTH_SEO_CLASSES[4]
  if (charCount < 76) return TITLE_LENGTH_SEO_CLASSES[5]
  if (charCount < 81) return TITLE_LENGTH_SEO_CLASSES[6]
  return TITLE_LENGTH_SEO_CLASSES[7]
}

// Analisis judul untuk badge dan saran (berbasis karakter)
function analyzeTitle(title: string): { badges: string[]; suggestions: string[] } {
  const badges: string[] = []
  const suggestions: string[] = []
  const clickbaitWords = [
    "Rahasia", "Terbongkar", "Gratis", "Mengejutkan", "Terungkap", "Wajib Tahu", "Jangan Lewatkan", "Peluang Emas", "Luar Biasa", "Kunci Sukses"
  ]
  const charCount = title.length
  const lengthClass = classifyTitleLength(charCount)
  if (lengthClass.label !== "Ideal") {
    badges.push(lengthClass.label)
    suggestions.push(lengthClass.description)
  }
  if (clickbaitWords.some(w => title.toLowerCase().includes(w.toLowerCase()))) {
    badges.push("Clickbait")
    suggestions.push("Hindari kata clickbait agar lebih kredibel.")
  }
  return { badges, suggestions }
}

export function TitleCard({ title, index, categoryName, modelName, onUse }: TitleCardProps) {
  const analysis = analyzeTitle(title)
  return (
    <Card className="flex flex-col gap-2 p-4 rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md animate-fade-in">
      {/* Nomor urut di atas badge kategori, icon box besar dan kontras */}
      <div className="flex justify-center items-center mb-2">
        <span className="inline-flex flex-col items-center justify-center bg-primary text-primary-foreground text-2xl font-bold w-14 h-14 rounded-full shadow-lg border-4 border-primary">
          {index + 1}
        </span>
      </div>
      {/* Badge kategori (kategoriName) di atas judul, center, pakai ikon */}
      <div className="flex justify-center items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded shadow-sm ${CATEGORY_BADGE_COLOR}`}>
          <FiBookmark className="w-4 h-4" />
          {categoryName}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        {/* Kosongkan baris badge di bawah judul, karena sudah pindah ke atas */}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="flex-1 text-primary font-semibold text-base md:text-lg">
          {title}
        </span>
      </div>
      <div className="flex justify-center items-center gap-2 mb-2">
        {analysis.badges.length > 0 && (
          analysis.badges.map((badge, i) => (
            <span key={i} className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${SEO_BADGE_COLORS[badge] || 'bg-muted text-muted-foreground'}`}>
              <FiAward className="w-4 h-4" />
              {badge}
            </span>
          ))
        )}
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${LENGTH_BADGE_COLOR}`}>
          <FiAlertCircle className="w-4 h-4" />
          {title.length} karakter
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {modelName && (
          <span className="text-muted-foreground text-xs">{modelName}</span>
        )}
      </div>
      {analysis.suggestions.length > 0 && (
        <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
          {analysis.suggestions.join(" ")}
        </div>
      )}
      <div className="flex gap-2 flex-wrap mt-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 flex items-center justify-center min-w-0 px-2 py-1 text-xs h-8 min-w-0"
          onClick={() => {
            navigator.clipboard.writeText(title)
            toast.success(
              <span>
                Judul berhasil disalin!<br />
                <span className="block mt-1 text-xs text-muted-foreground font-mono whitespace-pre-line break-words max-w-xs">{title}</span>
              </span>,
              { duration: 3500 }
            )
          }}
          aria-label="Salin judul"
        >
          <FiCopy className="mr-1 w-4 h-4" />
          Salin
        </Button>
        <Button
          size="sm"
          variant="default"
          className="flex-1 flex items-center justify-center min-w-0 px-2 py-1 text-xs h-8 min-w-0"
          onClick={() => {
            onUse(title)
            toast.success("Judul digunakan!")
          }}
          aria-label="Gunakan judul ini"
        >
          <FiCheckCircle className="mr-1 w-4 h-4" />
          Gunakan Judul
        </Button>
      </div>
    </Card>
  )
}
