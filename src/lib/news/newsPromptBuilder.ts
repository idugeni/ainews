/**
 * Builder prompt untuk pembuatan berita.
 * Digunakan untuk membangun instruksi prompt ke model AI.
 * @module lib/news/newsPromptBuilder
 */

/**
 * Membuat prompt instruksi untuk pembuatan berita.
 * @param {string} title - Judul berita
 * @param {string} category - Nama kategori berita
 * @returns {string} Prompt siap pakai untuk model AI
 */
export function buildNewsPrompt(title: string, category: string): string {
  return `Buatlah sebuah berita lengkap dengan gaya jurnalistik profesional.
Topik: ${title}
Kategori: ${category}
Struktur berita harus mencakup judul, lead, isi, dan penutup.
Gunakan bahasa Indonesia yang baik dan benar, serta sertakan fakta atau data jika memungkinkan.`
}
