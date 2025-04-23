import { NewsForm } from "@/components/news/news-form"
import { ApiKeyWarning } from "@/components/api/api-key-warning"

export default function NewsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Generate News Content</h1>
        <p className="text-muted-foreground">
          Enter a title and our AI will generate complete news content following WordPress post format. The content will
          be properly structured with headings, paragraphs, and quotes.
        </p>
      </div>

      {/* API Key Warning */}
      {!process.env.GOOGLE_API_KEY && (
        <div className="mb-8">
          <ApiKeyWarning />
        </div>
      )}

      <NewsForm />
    </div>
  )
}
