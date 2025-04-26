import React from "react";

export interface HistoryDetailProps {
  item?: {
    title: string;
    description: string;
    content: string;
    [key: string]: string | number | boolean | null | undefined;
  };
  parsedContent?: string;
  isLoading?: boolean;
  router?: {
    push: (path: string) => void;
  };
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ item, parsedContent, isLoading, router }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="animate-spin w-8 h-8 text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <p className="text-lg text-muted-foreground mb-4">History item not found.</p>
        {router && (
          <button className="btn btn-secondary" onClick={() => router.push("/history")}>Back to History</button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
      <div className="prose dark:prose-invert max-w-none mb-8">
        {parsedContent ? (
          <div dangerouslySetInnerHTML={{ __html: parsedContent.replace(/'/g, "&#39;") }} />
        ) : (
          <div className="whitespace-pre-wrap">{item.content}</div>
        )}
      </div>
      <div className="mb-4 text-muted-foreground">{item.description}</div>
    </div>
  );
};

export { HistoryDetail };
export default HistoryDetail;
