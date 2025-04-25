import TitleGenerator from "@/components/title/TitleGenerator"
import { ApiKeyWarning } from "@/components/api/ApiKeyWarning"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function TitlePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-8 px-2">
      <Card className="w-full max-w-3xl shadow-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Generate News Titles</CardTitle>
          <CardDescription className="text-muted-foreground">
            Masukkan topik berita, pilih kategori dan model AI, lalu dapatkan beberapa opsi judul berita yang menarik dan siap pakai.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* API Key Warning */}
          {!process.env.GEMINI_API_KEY && (
            <div className="mb-8">
              <ApiKeyWarning />
            </div>
          )}
          {/* Hapus TitleForm tanpa props, gunakan TitleGenerator yang benar */}
          <TitleGenerator />
        </CardContent>
      </Card>
    </div>
  )
}
