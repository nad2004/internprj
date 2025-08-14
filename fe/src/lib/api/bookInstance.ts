// lib/api/book.ts
import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { keyFactory } from '@/lib/queryKeys';
import type { BookInstance, BookInstanceInput } from '@/types/BookInstance'; // --- API ---
export async function fetchBooksInstance(params?: Record<string, string | number>) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book-instance/`, {
    params,
    withCredentials: true,
  });
  return res.data.data;
}
export async function updateBookInstance(data: BookInstanceInput) {
  const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/book-instance`, data, {
    withCredentials: true,
  });
  return res.data.data as BookInstance;
}
export async function deleteBookInstance(id: string) {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/book-instance/delete`,
    { id },
    { withCredentials: true },
  );
  return res.data.data as BookInstance;
}
export async function addBookInstance(payload: BookInstanceInput) {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/book-instance`, payload);
    if (res.status === 200 || res.status === 201) {
    } else {
      console.error('API trả về lỗi:', res.data);
    }
  } catch (err) {
    console.error('Lỗi khi thêm sách:', err);
  }
}
// --- Keys phụ cho Google Books (tạo tại chỗ bằng keyFactory, KHÔNG cần sửa queryKeys.ts) ---
const bookInstanceKey = keyFactory('bookInstance');

// --- QueryOptions Factories ---
export const bookInstanceQueries = {
  list: (params?: Record<string, string | number>) =>
    queryOptions({
      queryKey: bookInstanceKey.list(params),
      queryFn: () => fetchBooksInstance(params),
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
};
