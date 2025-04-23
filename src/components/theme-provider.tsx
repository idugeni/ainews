"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Pastikan tema hanya dirender setelah mounting untuk menghindari hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

// Context untuk animasi tema
type ThemeContextType = {
  isChanging: boolean
  setIsChanging: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType>({
  isChanging: false,
  setIsChanging: () => {},
})

export const ThemeTransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChanging, setIsChanging] = useState(false)

  return <ThemeContext.Provider value={{ isChanging, setIsChanging }}>{children}</ThemeContext.Provider>
}

export const useThemeTransition = () => useContext(ThemeContext)
