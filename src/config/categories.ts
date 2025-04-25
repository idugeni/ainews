import type { IconType } from "react-icons"
import { FiGlobe, FiBriefcase, FiCpu, FiActivity, FiHeart, FiAward, FiFilm, FiBookOpen, FiSmile, FiFlag } from "react-icons/fi"

export interface NewsCategory {
  id: string
  name: string
  description: string
  icon: IconType // Tipe komponen ikon react-icons
  prompt: string
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  {
    id: "general",
    name: "Berita Umum",
    description: "Berita terkini dan peristiwa utama",
    icon: FiGlobe,
    prompt: "Tulis artikel berita umum tentang",
  },
  {
    id: "business",
    name: "Bisnis",
    description: "Update pasar dan ekonomi",
    icon: FiBriefcase,
    prompt: "Tulis artikel berita bisnis tentang",
  },
  {
    id: "technology",
    name: "Teknologi",
    description: "Inovasi dan perkembangan teknologi",
    icon: FiCpu,
    prompt: "Tulis artikel berita teknologi tentang",
  },
  {
    id: "science",
    name: "Sains",
    description: "Penemuan ilmiah dan riset",
    icon: FiActivity,
    prompt: "Tulis artikel berita sains tentang",
  },
  {
    id: "health",
    name: "Kesehatan",
    description: "Berita kesehatan dan medis",
    icon: FiHeart,
    prompt: "Tulis artikel berita kesehatan tentang",
  },
  {
    id: "government",
    name: "Pemerintahan",
    description: "Berita politik, kebijakan, dan pemerintahan",
    icon: FiFlag,
    prompt: "Tulis artikel berita pemerintahan tentang",
  },
  {
    id: "sports",
    name: "Olahraga",
    description: "Berita dan hasil olahraga",
    icon: FiAward,
    prompt: "Tulis artikel berita olahraga tentang",
  },
  {
    id: "entertainment",
    name: "Hiburan",
    description: "Film, musik, dan selebriti",
    icon: FiFilm,
    prompt: "Tulis artikel berita hiburan tentang",
  },
  {
    id: "education",
    name: "Pendidikan",
    description: "Info dan perkembangan pendidikan",
    icon: FiBookOpen,
    prompt: "Tulis artikel berita pendidikan tentang",
  },
  {
    id: "lifestyle",
    name: "Gaya Hidup",
    description: "Tren, tips, dan inspirasi hidup",
    icon: FiSmile,
    prompt: "Tulis artikel gaya hidup tentang",
  },
  {
    id: "international",
    name: "Internasional",
    description: "Berita dunia dan mancanegara",
    icon: FiFlag,
    prompt: "Tulis artikel berita internasional tentang",
  },
  {
    id: "travel",
    name: "Travel & Pariwisata",
    description: "Destinasi wisata dan berita pariwisata",
    icon: FiGlobe,
    prompt: "Tulis artikel berita travel atau pariwisata tentang",
  },
  {
    id: "environment",
    name: "Lingkungan",
    description: "Perubahan iklim dan berita lingkungan",
    icon: FiGlobe,
    prompt: "Tulis artikel berita lingkungan tentang",
  },
]

export const DEFAULT_CATEGORY = NEWS_CATEGORIES[0]
