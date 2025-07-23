'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBookTrending } from '@/lib/api/book';

export function useTrendingBooks() {
  return useQuery({
    queryKey: ['trendingBooks'],
    queryFn: () => fetchBookTrending(),
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: false,
  });
}
