import { availableMemory } from 'node:process';

// lib/queryKeys.ts
export const keyFactory = (root: string) => ({
  all: [root] as const,
  lists: () => [root, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [root, 'list', filters ?? {}] as const,
  detail: (slug: string | number) => [root, 'detail', slug] as const,
  availableDetail: (bookId: string) => [root, 'availableDetail', bookId] as const,
});

export const booksKeys = keyFactory('books');
