import { TitleForm } from "@/components/title/title-form"
import { ApiKeyWarning } from "@/components/api/api-key-warning"

export default function TitlePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Generate News Titles</h1>
        <p className="text-muted-foreground">
          Enter a topic and our AI will generate several news title options for you. Choose the one you like and proceed
          to create the full article.
        </p>
      </div>

      {/* API Key Warning */}
      {!process.env.GOOGLE_API_KEY && (
        <div className="mb-8">
          <ApiKeyWarning />
        </div>
      )}

      <TitleForm />
    </div>
  )
}
