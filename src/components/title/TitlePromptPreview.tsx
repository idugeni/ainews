import React, { useState } from "react";
import { Card } from "@/components/ui/card";

interface TitlePromptPreviewProps {
  prompt: string;
}

// Regex untuk highlight variabel seperti {topic} atau {category}
const VAR_REGEX = /\{([a-zA-Z0-9_]+)\}/g;

function highlightVariables(text: string) {
  return text.split(VAR_REGEX).map((part, i) => {
    if (i % 2 === 1) {
      if (part === "topic") {
        return <span key={i} className="bg-success/20 text-success px-1 rounded font-semibold">{`{${part}}`}</span>;
      }
      if (part === "category") {
        return <span key={i} className="bg-warning/20 text-warning px-1 rounded font-semibold">{`{${part}}`}</span>;
      }
      return <span key={i} className="bg-primary/20 text-primary px-1 rounded font-semibold">{`{${part}}`}</span>;
    }
    return part;
  });
}

const MAX_VISIBLE_LINES = 3;
const COLLAPSED_HEIGHT = `${1.6 * MAX_VISIBLE_LINES}em`;
const EXPANDED_HEIGHT = '1000px'; // cukup besar agar muat semua baris

const TitlePromptPreview: React.FC<TitlePromptPreviewProps> = ({ prompt }) => {
  const [expanded, setExpanded] = useState(false);

  if (!prompt.trim()) return null; // Sembunyikan preview jika prompt kosong

  const lines = prompt.split("\n");
  const isCollapsible = lines.length > MAX_VISIBLE_LINES;

  return (
    <Card
      className="bg-neutral-900/90 border rounded p-0 mt-2 shadow-lg relative overflow-hidden cursor-pointer group"
      onClick={() => setExpanded(e => !e)}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
      style={{ transition: 'box-shadow 0.2s' }}
    >
      <pre
        className="font-mono text-xs text-neutral-100 whitespace-pre-wrap px-4 pt-4 pb-4 relative transition-all duration-500 ease-in-out"
        style={{
          maxHeight: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s',
          boxShadow: expanded ? '0 6px 32px 0 rgba(0,0,0,0.24)' : '0 2px 8px 0 rgba(0,0,0,0.16)',
          borderRadius: '0.5rem',
          willChange: 'max-height',
        }}
      >
        {lines.map((line, i) => (
          <React.Fragment key={i}>{highlightVariables(line)}{i < lines.length - 1 && "\n"}</React.Fragment>
        ))}
        {/* Meta info hanya tampil jika expanded */}
        {expanded && (
          <span
            className="absolute right-6 bottom-4 text-[11px] text-muted-foreground opacity-80 font-normal bg-neutral-900/90 px-2 rounded"
          >
            {prompt.length} karakter &nbsp;·&nbsp; {lines.length} baris
          </span>
        )}
        {/* Efek gradiasi atas bawah tanpa blur, transisi halus */}
        {!expanded && isCollapsible && (
          <>
            <div className="absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-neutral-900/90 to-transparent pointer-events-none transition-opacity duration-500 opacity-80" />
            <div className="absolute left-0 right-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900/90 to-transparent pointer-events-none transition-opacity duration-500 opacity-80" />
          </>
        )}
      </pre>
    </Card>
  );
};

export default TitlePromptPreview;
