import { HistoryList } from "@/components/history/HistoryList";
import { Card } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <main className="max-w-3xl w-full mx-auto py-8 px-4">
      <Card className="p-6 space-y-4"> {/* space-y-4 agar jarak antar elemen lebih rapat */}
        <h1 className="text-3xl font-bold mb-2 text-center md:text-left">Riwayat Judul Berita</h1>
        <p className="text-muted-foreground mb-4 text-center md:text-left">
          Semua judul berita yang pernah Anda generate akan muncul di sini. Anda bisa menyalin atau menggunakan kembali judul yang sudah dibuat.
        </p>
        <HistoryList />
      </Card>
    </main>
  );
}
