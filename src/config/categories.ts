import type { NewsCategory } from "@/types"
import { Newspaper, Briefcase, Microscope, Gamepad2, Landmark, HeartPulse, Plane, Lightbulb, Leaf } from "lucide-react"

export const NEWS_CATEGORIES: NewsCategory[] = [
  {
    id: "general",
    name: "General News",
    description: "Breaking news and top stories",
    icon: Newspaper,
    prompt: "Write a general news article about",
  },
  {
    id: "business",
    name: "Business",
    description: "Financial news and market updates",
    icon: Briefcase,
    prompt: "Write a business news article about",
  },
  {
    id: "technology",
    name: "Technology",
    description: "Latest tech innovations and updates",
    icon: Lightbulb,
    prompt: "Write a technology news article about",
  },
  {
    id: "science",
    name: "Science",
    description: "Scientific discoveries and research",
    icon: Microscope,
    prompt: "Write a science news article about",
  },
  {
    id: "health",
    name: "Health",
    description: "Health news and medical breakthroughs",
    icon: HeartPulse,
    prompt: "Write a health news article about",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Movies, music, and celebrity news",
    icon: Gamepad2,
    prompt: "Write an entertainment news article about",
  },
  {
    id: "politics",
    name: "Politics",
    description: "Political news and government updates",
    icon: Landmark,
    prompt: "Write a political news article about",
  },
  {
    id: "travel",
    name: "Travel",
    description: "Travel destinations and tourism news",
    icon: Plane,
    prompt: "Write a travel news article about",
  },
  {
    id: "environment",
    name: "Environment",
    description: "Climate change and environmental news",
    icon: Leaf,
    prompt: "Write an environmental news article about",
  },
]

export const DEFAULT_CATEGORY = NEWS_CATEGORIES[0]
