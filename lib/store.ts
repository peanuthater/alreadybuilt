import type { SearchResult } from './types';

const LS_KEY = 'peanuthater_searches';

export interface StoredEntry {
  result: SearchResult;
  encodedData: string;
}

export function saveSearchLocally(result: SearchResult, encodedData: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalSearchEntries();
    const updated = [
      { result, encodedData },
      ...existing.filter((e) => e.result.id !== result.id),
    ].slice(0, 100);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable (private browsing, storage full, etc.)
  }
}

export function getLocalSearchEntries(): StoredEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
  } catch {
    return [];
  }
}
