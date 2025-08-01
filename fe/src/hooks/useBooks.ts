'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBooks } from '@/lib/api/book';

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => fetchBooks(),
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
