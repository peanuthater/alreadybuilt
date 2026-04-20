import type { SearchResult } from './types';

// Global singleton to survive Next.js hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var _searchStore: SearchResult[] | undefined;
}

if (!global._searchStore) {
  global._searchStore = [];
}

const store = global._searchStore;

export function addSearch(result: SearchResult): void {
  store.unshift(result);
  if (store.length > 100) {
    store.splice(100);
  }
}

export function getSearch(id: string): SearchResult | undefined {
  return store.find((s) => s.id === id);
}

export function getAllSearches(): SearchResult[] {
  return [...store];
}
