// lib/api/category.ts
import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { keyFactory } from '@/lib/queryKeys';
import type { Category } from '@/types/Books';
const categoryKeys = keyFactory('categories');

export async function fetchCategories() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/`, {
    withCredentials: true,
  });
  return res.data.data as Category[];
}

export const categoryQueries = {
  all: () =>
    queryOptions({
      queryKey: categoryKeys.all,
      queryFn: fetchCategories,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
};
