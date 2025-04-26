import React from "react"
import type { NewsTone } from "@/types"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"

const TONES: NewsTone[] = [
  "Netral/Objektif",
  "Formal",
  "Serius",
  "Informatif",
  "Kritis",
  "Positif",
  "Negatif",
]

interface NewsToneSelectorProps {
  value?: NewsTone | ""
  onChange: (value: NewsTone | "") => void
  disabled?: boolean
}

/**
 * Selector tone berita (menggunakan shadcn/ui Select)
 */
export const NewsToneSelector: React.FC<NewsToneSelectorProps> = ({ value = "", onChange, disabled }) => {
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted) return null
  return (
    <div className="space-y-2">
      <label htmlFor="tone" className="text-sm font-medium">
        Tone Berita
      </label>
      <Select value={value} onValueChange={val => onChange(val as NewsTone | "")} disabled={disabled}>
        <SelectTrigger id="tone" className="w-full" aria-label="Tone Berita" aria-required="false">
          {value ? value : "Pilih tone"}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Pilih tone</SelectLabel>
            {TONES.map(tone => (
              <SelectItem key={tone} value={tone}>{tone}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
