// lib/api/book.ts
import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { keyFactory, booksKeys } from '@/lib/queryKeys';
import type { Book, UpdateBookInput, GoogleItem } from '@/types/Books'; // --- API ---
export async function fetchBooks(params?: Record<string, string | number>) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book/`, {
    params,
    withCredentials: true,
  });
  return res.data.data;
}

export async function fetchBookTrending() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book/trending`, {
    withCredentials: true,
  });
  return res.data.data as Book[];
}

export async function fetchGoogleBook(q: string) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/google/books`, {
    params: { q, maxResults: 12 },
    withCredentials: true,
  });
  return res.data.data as GoogleItem[];
}

export async function updateBook(data: UpdateBookInput) {
  const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/book`, data, {
    withCredentials: true,
  });
  return res.data.data as Book;
}
export async function deleteBook(id: string) {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/book/delete`,
    { id },
    { withCredentials: true },
  );
  return res.data.data as Book;
}
export async function addBook(payload: UpdateBookInput) {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/book/create-one`, payload);
    if (res.status === 200 || res.status === 201) {
    } else {
      console.error('API trả về lỗi:', res.data);
    }
  } catch (err) {
    console.error('Lỗi khi thêm sách:', err);
  }
}
// --- Keys phụ cho Google Books (tạo tại chỗ bằng keyFactory, KHÔNG cần sửa queryKeys.ts) ---
const googleBooksKeys = keyFactory('googleBooks');

// --- QueryOptions Factories ---
export const booksQueries = {
  list: (params?: Record<string, string | number>) =>
    queryOptions({
      queryKey: booksKeys.list(params),
      queryFn: () => fetchBooks(params),
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),

  // /book/trending → gom vào list với flag để tái dùng keyFactory
  trending: () =>
    queryOptions({
      queryKey: booksKeys.list({ trending: true }),
      queryFn: fetchBookTrending,
      staleTime: 60_000,
    }),

  // /google/books?q=... → key: ["googleBooks","list",{ q }]
  google: (q: string) =>
    queryOptions({
      queryKey: googleBooksKeys.list({ q }),
      queryFn: () => fetchGoogleBook(q),
      enabled: q.length > 2,
      staleTime: 5 * 60_000,
    }),
};
