"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/layout/ModeToggle"
import { Github, Newspaper } from "lucide-react"
import { MegaMenu } from "@/components/layout/MegaMenu"
import { MobileMenu } from "@/components/layout/MobileMenu"

export default function Navbar() {
  // const pathname = usePathname() // Removed unused variable

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">News Generator</span>
          </Link>
        </div>

        {/* Desktop Mega Menu */}
        <div className="hidden md:flex items-center gap-6">
          <MegaMenu />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/idugeni/ainews"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>

          <div className="hidden md:flex">
            <ModeToggle />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
