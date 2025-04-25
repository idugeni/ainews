import { Newspaper, Github, Twitter, Mail, Heart, Coffee } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * Komponen Footer aplikasi News Generator.
 * Menampilkan informasi, link sosial, dan copyright.
 *
 * @returns JSX Footer
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">News Generator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate professional news titles and content with the power of Google Gemini AI
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/idugeni/ainews"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Twitter className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="mailto:contact@example.com">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Mail className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/title" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Generate Titles
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Generate News
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  History
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground opacity-70">WordPress Integration</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground opacity-70">SEO Analysis</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://ai.google.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Google AI Studio
                </Link>
              </li>
              <li>
                <Link
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Next.js Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://ui.shadcn.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  shadcn/ui Components
                </Link>
              </li>
              <li>
                <Link
                  href="https://tailwindcss.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tailwind CSS
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground"> {currentYear} News Generator. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>and</span>
            <Coffee className="h-4 w-4 text-amber-700" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
