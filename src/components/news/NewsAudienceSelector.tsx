import React from "react"
import type { NewsAudience } from "@/types"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"

const AUDIENCES: NewsAudience[] = [
  "Umum",
  "Bisnis/Ekonomi",
  "Olahraga",
  "Hiburan",
  "Teknologi",
  "Politik",
  "Kesehatan",
  "Anak-anak/Remaja",
  "Dewasa/Lansia",
  "Lokal",
  "Regional",
  "Nasional",
  "Internasional",
  "Pasif (Konsumen)",
  "Aktif (Partisipan)",
]

interface NewsAudienceSelectorProps {
  value?: NewsAudience | ""
  onChange: (value: NewsAudience | "") => void
  disabled?: boolean
}

/**
 * Selector audiens berita (menggunakan shadcn/ui Select)
 */
export const NewsAudienceSelector: React.FC<NewsAudienceSelectorProps> = ({ value = "", onChange, disabled }) => {
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted) return null
  return (
    <div className="space-y-2">
      <label htmlFor="audience" className="text-sm font-medium">
        Audiens Berita
      </label>
      <Select value={value} onValueChange={val => onChange(val as NewsAudience | "")} disabled={disabled}>
        <SelectTrigger id="audience" className="w-full" aria-label="Audiens Berita" aria-required="false">
          {value ? value : "Pilih audiens"}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Pilih audiens</SelectLabel>
            {AUDIENCES.map(audience => (
              <SelectItem key={audience} value={audience}>{audience}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
