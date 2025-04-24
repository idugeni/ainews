"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, FileText, Code } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { marked } from "marked"

interface ExportOptionsProps {
  content: string
  title: string
}

export function ExportOptions({ content, title }: ExportOptionsProps) {
  const [copied, setCopied] = useState(false)

  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(`${type} copied to clipboard!`)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadAsFile = async (content: string, fileType: string) => {
    const element = document.createElement("a")
    let fileContent = content
    let mimeType = "text/plain"
    let fileExtension = "txt"

    if (fileType === "html") {
      fileContent = await marked.parse(content)
      mimeType = "text/html"
      fileExtension = "html"
    } else if (fileType === "markdown") {
      fileExtension = "md"
    }

    const file = new Blob([fileContent], { type: mimeType })
    element.href = URL.createObjectURL(file)
    element.download = `${sanitizedTitle}.${fileExtension}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast.success(`Downloaded as ${fileExtension.toUpperCase()} file`)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => copyToClipboard(content, "Content")}
        className="flex items-center gap-1"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => downloadAsFile(content, "markdown")}>
            <FileText className="h-4 w-4 mr-2" />
            Download as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadAsFile(content, "html")}>
            <Code className="h-4 w-4 mr-2" />
            Download as HTML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
