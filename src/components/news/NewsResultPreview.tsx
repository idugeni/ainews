import React from "react";
import { Card } from "@/components/ui/card";
import { ExportOptions } from "@/components/news/NewsExportOptions";
import { SeoAnalyzer } from "@/components/seo/SeoAnalyzer";

interface NewsResultPreviewProps {
  generatedContent: string;
  parsedContent: string;
  showGeneratedContent: boolean;
  highlightKeywords: (text: string) => string;
  title: string;
  wordCount: number;
}

const NewsResultPreview: React.FC<NewsResultPreviewProps> = ({
  generatedContent,
  parsedContent,
  showGeneratedContent,
  highlightKeywords,
  title,
  wordCount,
}) => {
  if (!showGeneratedContent) return null;
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md mt-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Konten Berita yang Dihasilkan:</h2>
          <div className="flex items-center gap-2">
            <ExportOptions content={generatedContent} title={title} />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center mb-2">
          <span className="text-xs text-muted-foreground">Perkiraan jumlah kata: <b>{wordCount}</b></span>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {parsedContent ? (
            <div dangerouslySetInnerHTML={{ __html: highlightKeywords(parsedContent) }} />
          ) : (
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlightKeywords(generatedContent) }} />
          )}
        </div>
        <SeoAnalyzer content={generatedContent} title={title} />
      </div>
    </Card>
  );
};

export default NewsResultPreview;
