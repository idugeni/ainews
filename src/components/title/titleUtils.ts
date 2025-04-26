export function wordCount(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}
