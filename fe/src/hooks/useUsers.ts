'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api/user';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
