"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ApiKeyWarning() {
  const [apiKey, setApiKey] = useState("")
  const [isSaving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return

    setSaving(true)

    try {
      // Dalam aplikasi produksi, Anda harus menyimpan API key dengan aman
      // Ini hanya contoh sederhana untuk demo
      localStorage.setItem("NEXT_PUBLIC_GEMINI_API_KEY", apiKey)
      alert("API key saved! Please reload the page.")
      window.location.reload()
    } catch (error) {
      console.error("Error saving API key:", error)
      alert("Failed to save API key")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-destructive/10 text-destructive p-6 rounded-lg flex flex-col items-start gap-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold mb-1">Google API Key Not Configured</h3>
          <p className="text-sm">
            To use this application, you need to configure your Google Gemini API key. You can get an API key from the{" "}
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Google AI Studio
            </a>
            .
          </p>
        </div>
      </div>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} variant="outline" className="ml-8">
          Configure API Key
        </Button>
      ) : (
        <div className="ml-8 w-full max-w-md space-y-3">
          <div className="space-y-1">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Enter your Google Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="AIza..."
            />
            <p className="text-xs text-muted-foreground">
              Note: In a production app, API keys should be stored securely on the server.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} disabled={!apiKey.trim() || isSaving}>
              {isSaving ? "Saving..." : "Save API Key"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
