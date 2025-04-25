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
• Memastikan keutuhan kalimat (tidak terpotong di tengah ide),  
• Bebas typo dan ejaan sempurna sesuai EYD dan KBBI,  
• Mematuhi etika jurnalistik, serta  
• Meningkatkan CTR (Click-Through Rate) di mesin pencari dan media sosial.

Sebagai seorang profesional:
Anda menghindari clickbait murahan namun tetap mampu memicu rasa ingin tahu pembaca.  
Setiap judul harus berdiri sendiri dan dapat memikat pembaca hanya dengan satu kali baca.  
Anda memastikan setiap kata tersusun dengan presisi tinggi — tidak ada kata yang tergabung salah atau spasi hilang.

Hasilkan tepat ${count} judul artikel yang unik dan berbeda satu sama lain.
`.trim()

/**
 * PROMPT_TEMPLATE
 * Template prompt yang minimalis dan berbentuk kalimat natural.
 */
const PROMPT_TEMPLATE = (topic: string, category: string, count: number) => `
Buatkan ${count} judul artikel atau berita tentang "${topic}" dalam kategori "${category}".

Output yang diharapkan:
• Hanya daftar judul, satu judul per baris.  
• Tidak perlu nomor, penjelasan, atau kalimat tambahan.  
• Judul harus dalam Bahasa Indonesia yang baik, menarik, dan mudah dipahami.  
• Setiap judul harus unik, tidak boleh ada yang duplikat.

Contoh format output:
Judul artikel pertama  
Judul artikel kedua  
Judul artikel ketiga  
... hingga ${count}
`.trim()

/**
 * TitlePromptBuild
 * Interface untuk hasil builder prompt.
 */
export interface TitlePromptBuild {
  prompt: string
  systemInstruction: string
}

/**
 * buildTitlePrompt
 * Fungsi builder utama untuk membuat prompt dan sistem instruksi.
 *
 * @param topic - Topik utama artikel
 * @param categoryPrompt - Kategori atau konteks tambahan (default: '-')
 * @param count - Jumlah judul yang ingin dibuat (default: 5)
 * @returns Object berisi prompt dan systemInstruction
 */
export function buildTitlePrompt(
  topic: string,
  categoryPrompt: string = '-',
  count: number = 5
): TitlePromptBuild {
  return {
    prompt: PROMPT_TEMPLATE(topic, categoryPrompt, count),
    systemInstruction: SYSTEM_INSTRUCTION_TEMPLATE(count)
  }
}
