"use client"

import React, { useState } from "react";
import { TitleForm } from "@/components/title/TitleForm";
import { TitleResultList } from "@/components/title/TitleResultList";
import { DEFAULT_MODEL } from "@/config/Models";
import { DEFAULT_CATEGORY } from "@/config/Categories";
import { generateTitles } from "@/lib/api";
import { saveToHistory } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { HistoryList } from "@/components/history/HistoryList";
import { buildTitlePrompt } from "@/lib/titles/titlePromptBuilder";
import { FiX } from "react-icons/fi";

export default function TitleGenerator() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5) // Default 5 sesuai backend
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // --- Prompt builder utama judul ---
  const { prompt: titlePrompt } = buildTitlePrompt(
    topic,
    selectedCategory?.name || "-",
    count
  )

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedTitles([]);
    try {
      const response = await generateTitles(topic, selectedModel.id, selectedCategory.id, count);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to generate titles");
      }
      setGeneratedTitles(response.data.titles || []);
      if ((response.data.titles || []).length > 0) {
        saveToHistory({
          id: uuidv4(),
          type: "title",
          content: response.data.titles.join("\n"),
          topic,
          category: selectedCategory.name,
          model: selectedModel.id,
          createdAt: new Date().toISOString(),
        });
        toast.success("Judul berhasil dibuat!");
      } else {
        toast.error("Tidak ada judul yang dihasilkan!");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Gagal membuat judul: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTitle = () => {
    // Implementasi routing/aksi lain sesuai kebutuhan
  };

  return (
    <>
      <TitleForm
        topic={topic}
        setTopicAction={setTopic}
        count={count}
        setCountAction={setCount}
        selectedModel={selectedModel}
        setSelectedModelAction={setSelectedModel}
        selectedCategory={selectedCategory}
        setSelectedCategoryAction={setSelectedCategory}
        isGenerating={isGenerating}
        onSubmitAction={handleSubmit}
        onShowHistoryAction={() => setShowHistory(true)}
        promptPreview={titlePrompt}
      />
      {(generatedTitles.length > 0) && (
        <div className="mt-8">
          <TitleResultList
            titles={generatedTitles}
            onUse={handleUseTitle}
            topic={topic}
            categoryPrompt={selectedCategory.name}
            count={count}
          />
        </div>
      )}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" onClick={() => setShowHistory(false)}>
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-4 border border-border" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="absolute right-2 top-2 text-xl text-muted-foreground hover:text-primary"
              onClick={() => setShowHistory(false)}
              aria-label="Tutup riwayat"
            >
              <FiX className="w-6 h-6" />
            </button>
            <HistoryList showDeleteAtBottom />
          </div>
        </div>
      )}
    </>
  );
}
