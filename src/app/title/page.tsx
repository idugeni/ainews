import TitleGenerator from "@/components/title/TitleGenerator"
import { ApiKeyWarning } from "@/components/api/ApiKeyWarning"

export default function TitlePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-8 px-2">
      <div className="w-full max-w-3xl mx-auto">
        {/* API Key Warning */}
        {!process.env.GEMINI_API_KEY && (
          <div className="mb-8">
            <ApiKeyWarning />
          </div>
        )}
        <TitleGenerator />
      </div>
    </div>
  )
}
