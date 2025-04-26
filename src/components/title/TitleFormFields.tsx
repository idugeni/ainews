import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CategorySelector } from "@/components/common/CategorySelector";
import { ModelSelector } from "@/components/common/ModelSelector";
import type { NewsCategory, ModelOption } from "@/types";

interface TitleFormFieldsProps {
  topic: string;
  setTopicAction: (v: string) => void;
  count: number;
  setCountAction: (v: number) => void;
  isGenerating: boolean;
  selectedCategory: NewsCategory;
  setSelectedCategoryAction: (category: NewsCategory) => void;
  selectedModel: ModelOption;
  setSelectedModelAction: (model: ModelOption) => void;
}

const TitleFormFields: React.FC<TitleFormFieldsProps> = ({
  topic,
  setTopicAction,
  count,
  setCountAction,
  isGenerating,
  selectedCategory,
  setSelectedCategoryAction,
  selectedModel,
  setSelectedModelAction,
}) => (
  <>
    {/* Topik Berita dan Jumlah Judul dalam satu baris benar-benar sejajar */}
    <div className="grid md:grid-cols-[8fr_2fr] gap-4 mb-4 items-start">
      <div className="flex flex-col">
        <label htmlFor="topic" className="text-sm font-medium">Topik Berita <span className="text-destructive">*</span></label>
        <Input
          id="topic"
          type="text"
          value={topic}
          onChange={e => setTopicAction(e.target.value)}
          placeholder="Contoh: Teknologi AI di Indonesia, Ekonomi Syariah, Startup Kesehatan Digital, dll."
          disabled={isGenerating}
          className="mb-1"
          autoFocus
        />
        <p className="text-xs text-muted-foreground mb-2">Tulis topik utama yang ingin dijadikan judul berita. Semakin spesifik, hasil judul akan semakin relevan.</p>
      </div>
      <div className="flex flex-col">
        <label htmlFor="count-select" className="text-sm font-medium mb-1">Jumlah Judul</label>
        <Select
          value={String(count)}
          onValueChange={v => setCountAction(Number(v))}
          disabled={isGenerating}
        >
          <SelectTrigger id="count-select" className="w-full">
            <SelectValue placeholder="Pilih jumlah judul" />
          </SelectTrigger>
          <SelectContent>
            {[3,4,5,6,7,8,9,10].map(val => (
              <SelectItem key={val} value={String(val)}>{val}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    {/* Kategori dan Model AI dalam satu baris sama lebar */}
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div>
        <label htmlFor="category-select" className="text-sm font-medium">Kategori Berita</label>
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChangeAction={setSelectedCategoryAction}
          disabled={isGenerating}
        />
      </div>
      <div>
        <label htmlFor="model-select" className="text-sm font-medium">Model AI</label>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChangeAction={setSelectedModelAction}
          disabled={isGenerating}
        />
      </div>
    </div>
  </>
);

export default TitleFormFields;
