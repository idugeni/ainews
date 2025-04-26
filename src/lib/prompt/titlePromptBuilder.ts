/**
 * SYSTEM_INSTRUCTION_TEMPLATE
 * Instruksi sistem utama yang mendefinisikan peran AI dan aturan penulisan judul.
 */
const SYSTEM_INSTRUCTION_TEMPLATE = (count: number) => `
Anda adalah seorang Content Strategist dan SEO Specialist tingkat ahli di industri media digital.
Tugas Anda adalah merancang dan menyusun judul artikel yang:

• Sangat menarik,  
• Relevan dengan tren pencarian,  
• Dioptimalkan untuk SEO dengan keyword utama dan long-tail keyword,  
• Memastikan kalimat utuh dan tidak terpotong ide,  
• Bebas typo serta sesuai kaidah EYD (atau PUEBI) dan KBBI,  
• Mematuhi etika jurnalistik, dan  
• Meningkatkan CTR (Click-Through Rate) di mesin pencari maupun media sosial.

Sebagai seorang profesional:
Anda menghindari clickbait murahan namun tetap mampu memicu rasa ingin tahu pembaca.  
Setiap judul harus berdiri sendiri dan mampu memikat hanya dengan sekali baca.  
Pastikan setiap kata tersusun presisi — tanpa kesalahan spasi atau penggabungan kata.

Hasilkan tepat ${count} judul artikel yang unik dan berbeda satu sama lain.
`.trim()

/**
 * PROMPT_TEMPLATE
 * Template prompt dengan format instruksi natural dan konsisten.
 */
const PROMPT_TEMPLATE = (topic: string, category: string = '-', count: number) => `
Hasilkan tepat ${count} judul artikel yang unik dan berbeda satu sama lain tentang "${topic}" dalam kategori "${category}".

Petunjuk format output:
• Tulis hanya daftar judul, satu judul per baris.
• Jangan sertakan nomor, deskripsi, atau kalimat tambahan apa pun.
• Judul harus dalam Bahasa Indonesia yang baik, menarik, dan mudah dipahami.
• Setiap judul harus unik dan tidak boleh ada duplikat.

Contoh format output:
Judul artikel pertama  
Judul artikel kedua  
Judul artikel ketiga  
... hingga ${count}
`.trim()

/**
 * TitlePromptBuild
 * Struktur hasil dari builder prompt.
 */
export interface TitlePromptBuild {
  prompt: string
  systemInstruction: string
  meta?: Record<string, unknown> // metadata tambahan opsional untuk fleksibilitas masa depan
}

/**
 * buildTitlePrompt
 * Builder utama untuk membuat prompt dan instruksi sistem berdasarkan input.
 *
 * @param topic - Topik utama artikel
 * @param category - Kategori atau konteks tambahan (default: '-')
 * @param count - Jumlah judul yang ingin dibuat (default: 5)
 * @returns Objek berisi prompt, systemInstruction, dan metadata opsional
 */
export function buildTitlePrompt(
  topic: string,
  category: string = '-',
  count: number = 5
): TitlePromptBuild {
  return {
    prompt: PROMPT_TEMPLATE(topic, category, count),
    systemInstruction: SYSTEM_INSTRUCTION_TEMPLATE(count),
    meta: {
      topic,
      category,
      count
    }
  }
}
