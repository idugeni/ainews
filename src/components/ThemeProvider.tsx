"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Membungkus aplikasi dengan ThemeProvider dari next-themes.
 * Otomatis mengikuti preferensi tema sistem (dark/light).
 *
 * @param children Komponen anak-anak yang akan mendapatkan context tema
 * @param props Properti tambahan untuk NextThemesProvider
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  )
}
