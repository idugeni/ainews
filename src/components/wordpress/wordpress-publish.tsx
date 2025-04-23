"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"
import type { WordPressCredentials, WordPressPostRequest, WordPressPostResponse } from "@/types"

interface WordPressPublishProps {
  title: string
  content: string
}

export function WordPressPublish({ title, content }: WordPressPublishProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [credentials, setCredentials] = useState<WordPressCredentials>({
    url: "",
    username: "",
    password: "",
  })
  const [status, setStatus] = useState<"draft" | "publish">("draft")
  const [publishedUrl, setPublishedUrl] = useState("")

  const handlePublish = async () => {
    if (!credentials.url || !credentials.username || !credentials.password) {
      toast.error("Please fill in all WordPress credentials")
      return
    }

    setIsPublishing(true)

    try {
      // Prepare the post data
      const postData: WordPressPostRequest = {
        title,
        content,
        status,
      }

      // Make the API request to WordPress
      const response = await publishToWordPress(credentials, postData)

      setPublishedUrl(response.link)
      toast.success(`Successfully ${status === "publish" ? "published" : "saved as draft"} to WordPress!`)

      // Save credentials to localStorage for future use (except password)
      localStorage.setItem("wordpress_url", credentials.url)
      localStorage.setItem("wordpress_username", credentials.username)
    } catch (error) {
      console.error("Error publishing to WordPress:", error)
      toast.error(`Failed to publish to WordPress: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsPublishing(false)
    }
  }

  // Load saved credentials on component mount
  useState(() => {
    const savedUrl = localStorage.getItem("wordpress_url")
    const savedUsername = localStorage.getItem("wordpress_username")

    if (savedUrl) setCredentials((prev) => ({ ...prev, url: savedUrl }))
    if (savedUsername) setCredentials((prev) => ({ ...prev, username: savedUsername }))
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Publish to WordPress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish to WordPress</DialogTitle>
          <DialogDescription>Enter your WordPress credentials to publish this content.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="wordpress-url">WordPress Site URL</Label>
            <Input
              id="wordpress-url"
              placeholder="https://yoursite.com"
              value={credentials.url}
              onChange={(e) => setCredentials({ ...credentials, url: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wordpress-username">Username</Label>
            <Input
              id="wordpress-username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wordpress-password">Password or Application Password</Label>
            <Input
              id="wordpress-password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              For better security, use an application password instead of your main password.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="post-status">Post Status</Label>
            <Select value={status} onValueChange={(value: "draft" | "publish") => setStatus(value)}>
              <SelectTrigger id="post-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Save as Draft</SelectItem>
                <SelectItem value="publish">Publish Immediately</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {publishedUrl && (
          <div className="bg-primary/10 p-3 rounded-md mb-4">
            <p className="text-sm font-medium mb-1">Successfully published!</p>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline break-all"
            >
              {publishedUrl}
            </a>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {status === "publish" ? "Publish" : "Save as Draft"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Function to publish to WordPress
async function publishToWordPress(
  credentials: WordPressCredentials,
  postData: WordPressPostRequest,
): Promise<WordPressPostResponse> {
  const { url, username, password } = credentials

  // Ensure URL ends with /wp-json/wp/v2/
  const apiUrl = url.endsWith("/") ? `${url}wp-json/wp/v2/posts` : `${url}/wp-json/wp/v2/posts`

  // Create Basic Auth token
  const token = btoa(`${username}:${password}`)

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(postData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || `HTTP error ${response.status}`)
  }

  return await response.json()
}
