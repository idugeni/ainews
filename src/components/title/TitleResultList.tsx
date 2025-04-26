import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { buildTitlePrompt } from "@/lib/prompt/titlePromptBuilder"
import { TitleCard } from "@/components/title/TitleCard"
import { FiCopy, FiFileText, FiDownload } from "react-icons/fi"

interface TitleResultListProps {
  titles: string[]
  onUse: (title: string) => void
  categoryPrompt?: string
  modelName?: string
}

function exportTitlesToTxt(titles: string[]) {
  const blob = new Blob([titles.join("\n")], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "generated-titles.txt"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  toast.success("Berhasil diunduh sebagai TXT!")
}

function exportTitlesToCsv(titles: string[]) {
  const csv = titles.map((t, i) => `"${i + 1}","${t.replace(/"/g, '""')}"`).join("\n")
  const blob = new Blob([`No,Judul\n${csv}`], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "generated-titles.csv"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  toast.success("Berhasil diunduh sebagai CSV!")
}

function copyAllTitles(titles: string[]) {
  navigator.clipboard.writeText(titles.join("\n"))
  toast.success("Semua judul berhasil disalin!")
}

export function PromptViewer({ topic, categoryPrompt, count }: { topic: string; categoryPrompt?: string; count?: number }) {
  // Pastikan buildTitlePrompt mengembalikan string, jika tidak, ambil .prompt atau .toString()
  const promptBuild = buildTitlePrompt(topic, categoryPrompt, count)
  // Jika buildTitlePrompt mengembalikan object, ambil field 'prompt' atau fallback ke string
  let prompt = typeof promptBuild === 'string' ? promptBuild : (promptBuild.prompt ?? String(promptBuild))
  // Gantikan placeholder jika kosong
  if (prompt.includes('""')) {
    prompt = prompt.replace('""', topic || '[TOPIK TIDAK DIISI]')
  }
  if (prompt.includes('"-"')) {
    prompt = prompt.replace('"-"', categoryPrompt || '[KATEGORI TIDAK DIISI]')
  }
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-4">
      <button
        className="text-xs px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-100 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Sembunyikan Prompt" : "Lihat Prompt yang Digunakan"}
      </button>
      {open && (
        <div className="mt-2 p-3 rounded bg-muted text-xs font-mono relative">
          <button
            className="absolute right-2 top-2 text-xs text-primary underline"
            onClick={() => {
              navigator.clipboard.writeText(prompt)
              toast.success("Prompt berhasil disalin!")
            }}
          >
            Salin Prompt
          </button>
          <pre className="whitespace-pre-wrap break-words">{prompt}</pre>
        </div>
      )}
    </div>
  )
}

export function TitleResultList({ titles, onUse, categoryPrompt, modelName }: TitleResultListProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap gap-2 justify-end mb-4">
        <Button
          variant="secondary"
          size="sm"
          className="text-xs px-3 py-1 rounded font-semibold border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1"
          onClick={() => copyAllTitles(titles)}
        >
          <FiCopy className="mr-1 w-4 h-4" />
          Salin Semua
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="text-xs px-3 py-1 rounded font-semibold border border-border bg-muted hover:bg-muted/80 text-foreground flex items-center gap-1"
          onClick={() => exportTitlesToTxt(titles)}
        >
          <FiFileText className="mr-1 w-4 h-4" />
          Export TXT
        </Button>
        <Button
          variant="default"
          size="sm"
          className="text-xs px-3 py-1 rounded font-semibold flex items-center gap-1"
          onClick={() => exportTitlesToCsv(titles)}
        >
          <FiDownload className="mr-1 w-4 h-4" />
          Export CSV
        </Button>
      </div>
      <div className="hidden md:grid grid-cols-[40px_1fr_170px] gap-2 px-4 py-2 bg-muted rounded-t-xl font-semibold text-xs text-muted-foreground uppercase tracking-wider border border-b-0 border-border">
        <div>No</div>
        <div>Judul & Info</div>
        <div className="text-right">Aksi</div>
      </div>
      <div className="flex flex-col">
        {titles.map((title, idx) => (
          <TitleCard
            key={idx}
            title={title}
            index={idx}
            categoryName={categoryPrompt || ''}
            modelName={modelName || ''}
            onUse={onUse}
            tableLike
          />
        ))}
      </div>
    </div>
  )
}
