import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Category = 'All' | string;
type State = { query: string; category: Category; page: number; limit: number };
type Actions = {
  setQuery: (q: string) => void;
  setCategory: (c: Category) => void;
  setPage: (p: number) => void;
  setLimit: (n: number) => void;
  reset: () => void;
};

export const useSearchStore = create<State & Actions>()(
  devtools((set) => ({
    query: '',
    category: '',
    page: 1,
    limit: 20,
    setQuery: (query) => set({ query, page: 1 }),
    setCategory: (category) => set({ category, page: 1 }),
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit, page: 1 }),
    reset: () => set({ query: '', category: '', page: 1, limit: 20 }),
  })),
);
