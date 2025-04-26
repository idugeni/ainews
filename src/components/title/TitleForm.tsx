"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TitlePromptPreview from "@/components/title/TitlePromptPreview";
import TitleFormFields from "@/components/title/TitleFormFields";
import type { ModelOption, NewsCategory } from "@/types";
import { DEFAULT_MODEL } from "@/config/Models";
import { DEFAULT_CATEGORY } from "@/config/Categories";
import { TitleResultList } from "@/components/title/TitleResultList";
import { HistoryList } from "@/components/history/HistoryList";
import { generateTitles } from "@/lib/api";
import { saveToHistory } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FiLoader } from "react-icons/fi";

interface TitleFormProps {
  topic: string;
  setTopicAction: (v: string) => void;
  count: number;
  setCountAction: (v: number) => void;
  isGenerating: boolean;
  onSubmitAction: () => void;
  onShowHistoryAction: () => void;
  promptPreview?: string;
  selectedCategory: NewsCategory;
  setSelectedCategoryAction: (category: NewsCategory) => void;
  selectedModel: ModelOption;
  setSelectedModelAction: (model: ModelOption) => void;
}

export function TitleForm({
  topic,
  setTopicAction,
  count,
  setCountAction,
  isGenerating,
  onSubmitAction,
  onShowHistoryAction,
  promptPreview,
  selectedCategory,
  setSelectedCategoryAction,
  selectedModel,
  setSelectedModelAction,
}: TitleFormProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isGenerating) {
      const startTime = Date.now();
      intervalId = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setShowTimer(false);
      setTimer(0);
    }
    return () => clearInterval(intervalId);
  }, [isGenerating]);

  return (
    <Card className="space-y-6 relative p-6">
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2 md:mt-0"
          onClick={onShowHistoryAction}
          disabled={isGenerating}
        >
          Riwayat
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Generate News Titles</h1>
        <p className="text-muted-foreground">
          Masukkan topik berita, pilih kategori dan model AI, lalu dapatkan beberapa opsi judul berita yang menarik dan siap pakai.
        </p>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmitAction();
        }}
        className="space-y-4"
      >
        <TitleFormFields
          topic={topic}
          setTopicAction={setTopicAction}
          count={count}
          setCountAction={setCountAction}
          isGenerating={isGenerating}
          selectedCategory={selectedCategory}
          setSelectedCategoryAction={setSelectedCategoryAction}
          selectedModel={selectedModel}
          setSelectedModelAction={setSelectedModelAction}
        />
        <Button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="w-full transition-all duration-200 hover:shadow-md mt-4"
          aria-busy={isGenerating}
          onClick={() => {
            if (!isGenerating && topic.trim()) setShowTimer(true);
          }}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <FiLoader className="animate-spin h-5 w-5" />
              Membuat Judul...
            </span>
          ) : (
            "Buat Judul"
          )}
        </Button>
        {showTimer && (
          <Alert className="mt-4">
            <AlertTitle>{isGenerating ? "Sedang membuat judul..." : "Judul berhasil dibuat!"}</AlertTitle>
            <AlertDescription>
              Waktu proses: {timer} detik
            </AlertDescription>
          </Alert>
        )}
        <TitlePromptPreview prompt={promptPreview || ""} />
      </form>
    </Card>
  );
}

export function TitleGenerator() {
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelOption>(DEFAULT_MODEL)
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(DEFAULT_CATEGORY)
  const router = useRouter()
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    setGeneratedTitles([])

    try {
      const response = await generateTitles(topic, selectedModel.id, selectedCategory.id)
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to generate titles")
      }
      setGeneratedTitles(response.data.titles || [])
      if ((response.data.titles || []).length > 0) {
        saveToHistory({
          id: uuidv4(),
          type: "title",
          content: response.data.titles.join("\n"),
          topic,
          category: selectedCategory.name,
          model: selectedModel.id,
          createdAt: new Date().toISOString(),
        })
        toast.success("Judul berhasil dibuat!")
      } else {
        toast.error("Tidak ada judul yang dihasilkan!")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      toast.error(`Gagal membuat judul: ${errorMessage}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseTitle = (title: string) => {
    router.push(`/news?title=${encodeURIComponent(title.trim())}&category=${encodeURIComponent(selectedCategory.id)}`)
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-end mb-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowHistory(true)}
        >
          Riwayat
        </Button>
      </div>
      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
          onClick={() => setShowHistory(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-4 border border-border"
            onClick={e => e.stopPropagation()}
          >
            {/* Tombol close di kanan atas, tidak overlap tombol lain */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowHistory(false)}
              aria-label="Tutup riwayat"
            >
              ✕
            </Button>
            <HistoryList showDeleteAtBottom />
          </div>
        </div>
      )}
      <TitleForm
        topic={topic}
        setTopicAction={setTopic}
        count={count}
        setCountAction={setCount}
        isGenerating={isGenerating}
        onSubmitAction={handleSubmit}
        onShowHistoryAction={() => setShowHistory(true)}
        promptPreview={`Generate ${count} judul berita tentang "${topic}" dengan model "${selectedModel.name}" dan kategori "${selectedCategory.name}".`}
        selectedCategory={selectedCategory}
        setSelectedCategoryAction={setSelectedCategory}
        selectedModel={selectedModel}
        setSelectedModelAction={setSelectedModel}
      />
      {(generatedTitles.length > 0) && (
        <div className="mt-8">
          <TitleResultList
            titles={generatedTitles}
            onUse={handleUseTitle}
          />
        </div>
      )}
    </div>
  )
}
