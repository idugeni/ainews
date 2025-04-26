/**
 * SYSTEM_INSTRUCTION_NEWS
 * Instruksi sistem utama untuk pembuatan berita.
 */
const SYSTEM_INSTRUCTION_NEWS = `
Anda adalah seorang Jurnalis Profesional dengan keahlian dalam menulis berita akurat, menarik, dan sesuai kaidah jurnalistik.
Tugas Anda adalah menyusun berita berdasarkan topik, kategori, dan gaya penulisan yang diberikan.

Pastikan berita memenuhi kriteria berikut:
• **Menggunakan bahasa Indonesia yang baik, benar, dan sesuai PUEBI.**
• **Menyertakan fakta, data, atau kutipan jika relevan.**
• **Struktur artikel: Pembuka (2 paragraf), 6–10 subjudul berurutan logis (umum ke spesifik), kesimpulan, dan FAQ relevan.**
• **Setiap subjudul fokus pada satu ide dan mengandung kata kunci/topik utama atau variasi long-tail keyword.**
• Menyesuaikan gaya penulisan, audiens, dan tone sesuai instruksi.
• **Hindari clickbait, hoaks, dan bahasa provokatif.**
• **Ikuti instruksi jumlah kata dan struktur dari prompt utama.**
• **Tulisan harus benar-benar orisinal, bukan hasil parafrase atau penyalinan dari sumber manapun di internet.**
• **Gunakan gaya penulisan manusia yang natural, bervariasi, dan tidak kaku seperti AI. Sertakan opini, sudut pandang, atau analisis ringan jika relevan.**
• **Hindari pola kalimat yang generik, repetitif, atau terlalu sempurna seperti hasil AI.**
• **Pastikan seluruh isi adalah karya asli, tidak menjiplak atau mengambil kalimat langsung dari sumber lain.**
• **Jika memungkinkan, tambahkan insight atau sudut pandang unik yang belum banyak ditemukan di internet.**
`.trim()

/**
 * Helper untuk formatting kata menjadi lowercase namun tetap natural.
 * Contoh: "Pelajar" -> "pelajar", "Resmi" -> "resmi"
 */
function formatLower(text: string | undefined): string {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : ''
}

/**
 * PROMPT_TEMPLATE_NEWS
 * Template prompt berita berbentuk paragraf natural.
 */
const PROMPT_TEMPLATE_NEWS = (
  title: string,
  category: string,
  style?: string,
  audience?: string,
  tone?: string
) => {
  let prompt = `Buatlah artikel berita dengan judul "${title}" dalam kategori "${category}" secara terstruktur dan mendalam, dengan panjang 2.000–2.500 kata, serta memenuhi ketentuan berikut:\n\n`;
  prompt += `1. Pembuka: 2 paragraf (180–250 kata) yang memperkenalkan topik secara menarik dan informatif. Pastikan kedua paragraf ini mengandung kata kunci utama/judul.\n`;
  prompt += `2. Subjudul: 6–10 subjudul, masing-masing 200–250 kata, disusun secara logis dari pembahasan umum ke spesifik. Setiap subjudul fokus pada satu ide dan mengandung kata kunci atau variasi long-tail keyword yang relevan.\n`;
  prompt += `3. Kesimpulan: Paragraf penutup (100–150 kata) yang merangkum inti artikel dan memberikan insight atau ajakan kepada pembaca.\n`;
  prompt += `4. FAQ: Sertakan 5 pertanyaan dan jawaban singkat (total 250–400 kata), relevan dengan judul dan isi artikel.\n\n`;
  prompt += `Gunakan bahasa Indonesia yang baik, benar, dan sesuai PUEBI. Hindari clickbait, hoaks, dan gaya penulisan yang terkesan dibuat oleh AI.`;

  if (style) {
    prompt += `\nGaya penulisan: ${formatLower(style)}.`;
  }
  if (audience) {
    prompt += `\nAudiens target: ${formatLower(audience)}.`;
  }
  if (tone) {
    prompt += `\nTone penulisan: ${formatLower(tone)}.`;
  }

  return prompt.trim()
}

/**
 * NewsPromptBuild
 * Struktur hasil builder prompt berita.
 */
export interface NewsPromptBuild {
  prompt: string
  systemInstruction: string
  meta?: Record<string, unknown>
}

/**
 * buildNewsPrompt
 * Builder utama untuk membuat prompt berita dan instruksi sistem.
 *
 * @param title - Judul berita
 * @param category - Kategori berita
 * @param style - Gaya penulisan (opsional)
 * @param audience - Audiens target (opsional)
 * @param tone - Tone/suasana berita (opsional)
 * @returns Objek berisi prompt, systemInstruction, dan metadata opsional
 */
export function buildNewsPrompt(
  title: string,
  category: string,
  style?: string,
  audience?: string,
  tone?: string
): NewsPromptBuild {
  if (!title.trim()) {
    throw new Error('Parameter "title" wajib diisi.')
  }

  if (!category.trim()) {
    throw new Error('Parameter "category" wajib diisi.')
  }

  return {
    prompt: PROMPT_TEMPLATE_NEWS(title, category, style, audience, tone),
    systemInstruction: SYSTEM_INSTRUCTION_NEWS,
    meta: {
      title,
      category,
      style,
      audience,
      tone
    }
  }
}
