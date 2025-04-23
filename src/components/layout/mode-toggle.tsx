"use client"

import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useThemeTransition } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isChanging, setIsChanging } = useThemeTransition()

  // Pastikan tema hanya dirender setelah mounting untuk menghindari hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setIsChanging(true)
    setTheme(newTheme)

    // Reset isChanging setelah animasi selesai
    setTimeout(() => {
      setIsChanging(false)
    }, 500)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="opacity-0">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("transition-all duration-300", isChanging && "animate-pulse")}
        >
          {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />}
          {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />}
          {theme === "system" && <Laptop className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className={cn("flex items-center gap-2", theme === "light" && "bg-accent")}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className={cn("flex items-center gap-2", theme === "dark" && "bg-accent")}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className={cn("flex items-center gap-2", theme === "system" && "bg-accent")}
        >
          <Laptop className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
