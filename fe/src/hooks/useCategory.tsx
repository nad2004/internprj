'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api/category';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
