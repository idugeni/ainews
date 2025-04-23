import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Memotong teks jika melebihi panjang maksimum dan menambahkan elipsis.
 * @param {string} text - Teks yang akan dipotong
 * @param {number} maxLength - Panjang maksimum
 * @returns {string}
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format tanggal ke string lokal (ID) sederhana.
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string}
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}
