// Konfigurasi default Gemini untuk judul berita
export const GEMINI_DEFAULT_CONFIG = {
  temperature: 1.2, // Lebih kreatif, tetap relevan
  topP: 1, // Sampling penuh
  maxOutputTokens: 2048, // Cukup untuk 10 judul panjang
  responseMimeType: "text/plain",
}
