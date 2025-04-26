import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React from "react"
import { toast } from "sonner"
import { FiCopy, FiCheckCircle, FiBookmark, FiAward, FiAlertCircle, FiCpu, FiInfo, FiAlertTriangle } from "react-icons/fi"

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
  if (charCount < 15) return 0
  if (charCount < 30) return 1
  if (charCount < 40) return 2
  if (charCount < 56) return 3
  if (charCount < 66) return 4
  if (charCount < 76) return 5
  if (charCount < 81) return 6
  return 7
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
  badges.push(TITLE_LENGTH_SEO_CLASSES[lengthClass].label)
  if (TITLE_LENGTH_SEO_CLASSES[lengthClass].label !== "Ideal") {
    suggestions.push(TITLE_LENGTH_SEO_CLASSES[lengthClass].description)
  }
  if (clickbaitWords.some(w => title.toLowerCase().includes(w.toLowerCase()))) {
    badges.push("Clickbait")
    suggestions.push("Hindari kata clickbait agar lebih kredibel.")
  }
  return { badges, suggestions }
}

export function TitleCard({ title, index, categoryName, modelName, onUse, tableLike }: TitleCardProps & { tableLike?: boolean }) {
  const analysis = analyzeTitle(title)
  const charCount = title.length
  if (tableLike) {
    // Mapping icon untuk setiap badge
    const badgeIcons = {
      kategori: <FiBookmark className="w-3 h-3" />,
      karakter: <FiAlertCircle className="w-3 h-3" />,
      model: <FiCpu className="w-3 h-3" />,
      seo: <FiAward className="w-3 h-3" />,
    }
    // Penjelasan/alert untuk semua status panjang judul
    const titleLengthClass = classifyTitleLength(charCount)
    const lengthStatus = [
      { label: 'Sangat Pendek', icon: <FiAlertTriangle className="w-4 h-4 text-red-500" />, desc: 'Judul terlalu pendek untuk SEO.' },
      { label: 'Pendek', icon: <FiAlertTriangle className="w-4 h-4 text-orange-500" />, desc: 'Judul masih kurang optimal.' },
      { label: 'Cukup Pendek', icon: <FiInfo className="w-4 h-4 text-yellow-500" />, desc: 'Judul mulai cukup, tapi bisa lebih panjang.' },
      { label: 'Ideal', icon: <FiCheckCircle className="w-4 h-4 text-green-500" />, desc: 'Judul ideal untuk SEO.' },
      { label: 'Cukup Panjang', icon: <FiInfo className="w-4 h-4 text-yellow-500" />, desc: 'Judul masih optimal, sedikit panjang.' },
      { label: 'Panjang', icon: <FiAlertTriangle className="w-4 h-4 text-orange-500" />, desc: 'Judul mulai terlalu panjang.' },
      { label: 'Sangat Panjang', icon: <FiAlertTriangle className="w-4 h-4 text-red-500" />, desc: 'Judul terlalu panjang, bisa terpotong di hasil pencarian.' },
      { label: 'Ekstra Panjang', icon: <FiAlertTriangle className="w-4 h-4 text-red-700" />, desc: 'Judul sangat panjang, tidak disarankan.' },
    ]
    const lengthAlert = lengthStatus[titleLengthClass]
    return (
      <Card className="grid md:grid-cols-[40px_1fr_130px] grid-cols-1 gap-3 items-stretch px-4 py-4 border-b border-border rounded-none shadow-none bg-background/80 hover:bg-accent/10 transition-all text-center md:text-left">
        {/* Kolom 1: NO */}
        <div className="flex md:block justify-center items-center text-xs font-bold text-muted-foreground md:pt-2 w-full">{index + 1}</div>
        {/* Kolom 2: Konten multi-baris */}
        <div className="flex flex-col gap-1 min-w-0 items-center md:items-start w-full">
          {/* Judul */}
          <div className="font-semibold text-base md:text-lg leading-snug break-words text-foreground w-full">{title}</div>
          {/* Badge kategori, SEO, panjang judul */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_BADGE_COLOR}`}>{badgeIcons.kategori}{categoryName}</span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${LENGTH_BADGE_COLOR}`}>{badgeIcons.karakter}{charCount} karakter</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border bg-indigo-100 text-indigo-700">{badgeIcons.model}{modelName}</span>
            {analysis.badges.map((badge, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border border-border shadow-sm ${SEO_BADGE_COLORS[badge] || 'bg-muted text-muted-foreground'}`}
              >
                {badgeIcons.seo}{badge}
              </span>
            ))}
          </div>
          {/* Model (tambahkan icon juga di badge di atas) */}
          {/* Alert SEO: tampilkan status untuk SEMUA panjang judul */}
          <div className="text-xs mt-1 w-full flex justify-center md:justify-start items-center gap-2">
            {lengthAlert.icon}
            <span className="font-semibold">{lengthAlert.label}:</span> <span>{lengthAlert.desc}</span>
          </div>
          {/* Jika ada saran SEO lain, tampilkan juga */}
          {analysis.suggestions.length > 0 && (
            <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 w-full flex justify-center md:justify-start">
              {analysis.suggestions.join(' ')}
            </div>
          )}
        </div>
        {/* Kolom 3: Tombol aksi vertikal */}
        <div className="flex flex-col gap-2 justify-center items-center h-full w-full">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 border w-full max-w-xs mx-auto"
            onClick={() => {
              navigator.clipboard.writeText(title)
              toast.success('Judul berhasil disalin!')
            }}
            aria-label="Salin judul ini"
          >
            <FiCopy className="w-4 h-4" /> Salin
          </Button>
          <Button
            size="sm"
            variant="default"
            className="rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 w-full max-w-xs mx-auto"
            onClick={() => {
              onUse(title)
              toast.success('Judul digunakan!')
            }}
            aria-label="Gunakan judul ini"
          >
            <FiCheckCircle className="w-4 h-4" /> Gunakan
          </Button>
        </div>
      </Card>
    )
  }
  // Fallback: tampilan lama untuk mobile
  return (
    <Card className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md animate-fade-in">
      {/* Header compact: nomor, kategori, jumlah karakter, model */}
      <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
        <span className="text-xs font-bold text-muted-foreground w-5 text-center">{index + 1}.</span>
        <span className={`text-xs px-2 py-0.5 rounded ${CATEGORY_BADGE_COLOR} flex items-center gap-1`}><FiBookmark className="w-3 h-3" />{categoryName}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${LENGTH_BADGE_COLOR} flex items-center gap-1`}><FiAlertCircle className="w-3 h-3" />{charCount} karakter</span>
        {/* Model badge jika ada */}
        {modelName && (
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1"><FiCpu className="w-3 h-3" />{modelName}</span>
        )}
      </div>
      {/* Judul */}
      <div className="font-semibold text-base leading-snug break-words text-center">{title}</div>
      {/* Badge SEO (panjang, clickbait, dll) */}
      <div className="flex flex-wrap gap-2 mt-1 justify-center">
        {analysis.badges.map((badge, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border border-border shadow-sm ${SEO_BADGE_COLORS[badge] || 'bg-muted text-muted-foreground'}`}
            style={{ minWidth: 'fit-content', backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <FiAward className="w-3 h-3" />{badge}
          </span>
        ))}
      </div>
      {/* Tombol compact */}
      <div className="flex gap-2 mt-2 justify-center">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 flex items-center justify-center min-w-0 px-2 py-1 text-xs h-8"
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
          className="flex-1 flex items-center justify-center min-w-0 px-2 py-1 text-xs h-8"
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
      {/* Saran jika ada */}
      {analysis.suggestions.length > 0 && (
        <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 text-center">
          {analysis.suggestions.join(" ")}
        </div>
      )}
    </Card>
  )
}
