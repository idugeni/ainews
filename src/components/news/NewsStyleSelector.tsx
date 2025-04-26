import React from "react"
import type { NewsStyle } from "@/types"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"

// Daftar gaya penulisan berita/artikel/blog yang umum
const STYLES: NewsStyle[] = [
  "Lugas (Straight News)", // 1. Gaya Lugas
  "Mendalam/Interpretatif", // 2. Gaya Mendalam/Interpretatif
  "Naratif", // 3. Gaya Naratif
  "Deskriptif", // 4. Gaya Deskriptif
  "Ekspositori (Informatif/Tutorial)", // 5. Gaya Ekspositori
  "Persuasif", // 6. Gaya Persuasif
  "Opini/Personal", // 7. Gaya Opini/Personal
  "Investigasi", // 8. Gaya Investigasi
  "Kasual/Percakapan", // 9. Gaya Kasual/Percakapan
  "Ulasan (Review)", // 10. Gaya Ulasan
]

interface NewsStyleSelectorProps {
  value?: NewsStyle | ""
  onChange: (value: NewsStyle | "") => void
  disabled?: boolean
}

/**
 * Selector gaya penulisan berita/artikel (menggunakan shadcn/ui Select)
 *
 * Daftar gaya penulisan:
 * 1. Lugas (Straight News)
 * 2. Mendalam/Interpretatif
 * 3. Naratif
 * 4. Deskriptif
 * 5. Ekspositori (Informatif/Tutorial)
 * 6. Persuasif
 * 7. Opini/Personal
 * 8. Investigasi
 * 9. Kasual/Percakapan
 * 10. Ulasan (Review)
 */
export const NewsStyleSelector: React.FC<NewsStyleSelectorProps> = ({ value = "", onChange, disabled }) => {
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted) return null
  return (
    <div className="space-y-2">
      <label htmlFor="style" className="text-sm font-medium">
        Gaya Penulisan
      </label>
      <Select value={value} onValueChange={val => onChange(val as NewsStyle | "")} disabled={disabled}>
        <SelectTrigger id="style" className="w-full" aria-label="Gaya Penulisan" aria-required="false">
          {value ? value : "Pilih gaya penulisan"}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Pilih gaya penulisan</SelectLabel>
            {STYLES.map(style => (
              <SelectItem key={style} value={style}>{style}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
