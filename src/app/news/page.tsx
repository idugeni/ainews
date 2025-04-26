import NewsGenerator from "@/components/news/NewsGenerator";
import { ApiKeyWarning } from "@/components/api/ApiKeyWarning";

export default function NewsPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-8 px-2">
      <div className="w-full max-w-3xl mx-auto">
        {/* API Key Warning */}
        {false && (
          <div className="mb-8">
            <ApiKeyWarning />
          </div>
        )}
        <div className='w-full max-w-3xl mx-auto'>
          <NewsGenerator />
        </div>
      </div>
    </div>
  )
}
