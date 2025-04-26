/**
 * Builder prompt untuk pembuatan berita.
 * Digunakan untuk membangun instruksi prompt ke model AI.
 * @module lib/news/newsPromptBuilder
 */

/**
 * Membangun prompt berita yang lengkap dan modular
 * @param {string} title - Judul berita
 * @param {string} category - Nama kategori berita
 * @param {string} [style] - Gaya penulisan (opsional)
 * @param {string} [audience] - Audiens berita (opsional)
 * @param {string} [tone] - Tone/suasana (opsional)
 * @returns {string} Prompt siap pakai untuk model AI
 *
 * @example
 * // Contoh penggunaan:
 * const prompt = buildNewsPrompt(
 *   "Perkembangan Teknologi AI di Indonesia",
 *   "Teknologi",
 *   "Populer",
 *   "Pelajar",
 *   "Optimis"
 * )
 */
export function buildNewsPrompt(
  title: string,
  category: string,
  style?: string,
  audience?: string,
  tone?: string
): string {
  let prompt = `Buatlah sebuah berita lengkap dengan gaya jurnalistik profesional.\n`
  prompt += `Topik: ${title}\n`
  if (category) prompt += `Kategori: ${category}\n`
  if (style) prompt += `Gaya penulisan: ${style}\n`
  if (audience) prompt += `Audiens: ${audience}\n`
  if (tone) prompt += `Tone: ${tone}\n`
  prompt += `Struktur berita harus mencakup judul, lead, isi, dan penutup.\n`
  prompt += `Gunakan bahasa Indonesia yang baik dan benar, serta sertakan fakta atau data jika memungkinkan.`
  return prompt
}
