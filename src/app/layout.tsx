import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider, ThemeTransitionProvider } from "@/components/theme-provider"
import Navbar from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "News Generator with Google Gemini AI",
  description: "Generate news titles and content with Google Gemini AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ThemeTransitionProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto py-8 px-4">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors closeButton />
          </ThemeTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
