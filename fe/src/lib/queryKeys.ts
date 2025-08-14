// lib/queryKeys.ts
export const keyFactory = (root: string) => ({
  all: [root] as const,
  lists: () => [root, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [root, 'list', filters ?? {}] as const,
  detail: (id: string | number) => [root, 'detail', id] as const,
});

export const booksKeys = keyFactory('books');
