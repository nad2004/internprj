// lib/api/user.ts
import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { keyFactory } from '@/lib/queryKeys';
import type { User } from '@/types/User';
const userKeys = keyFactory('users');

export async function fetchUsers() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
    withCredentials: true,
  });
  return res.data.data as User[];
}
export async function updateUser(data: User) {
  const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user`, data, {
    withCredentials: true,
  });
  return res.data.data as User;
}
export async function deleteUser(id: string) {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/delete`,
    { id },
    { withCredentials: true },
  );
  return res.data.data as User;
}
export const userQueries = {
  all: () =>
    queryOptions({
      queryKey: userKeys.all,
      queryFn: fetchUsers,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
};
