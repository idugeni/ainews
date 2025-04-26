export function highlightKeywords(text: string, keywords: (string | undefined)[]): string {
  if (!text) return "";
  let result = text;
  keywords.filter(Boolean).forEach((kw) => {
    if (kw && kw.length > 1) {
      const regex = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      result = result.replace(regex, '<b>$1</b>');
    }
  });
  return result;
}

export function wordCount(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}
