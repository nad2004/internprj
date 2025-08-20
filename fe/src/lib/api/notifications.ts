import type { typeNotification, Notification } from '@/types/Notification';
import axios from 'axios';


export async function fetchNotifications(userId?: string) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notify`, {
    params: { userId },
    withCredentials: true,
  });
  return res.data;
}

export async function markNotificationAsRead(id: string, userId?: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/notify/read`;
  const res = await axios.patch(url, {id, userId}, { withCredentials: true });
  if (res.status === 200) {
    return res.data as Notification;
  }
  throw new Error(
    (res.data && (res.data.message || res.data.error)) || `Unexpected status ${res.status}`,
  );
}
export async function markAllNotificationsAsRead(userId: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/notify/read-all`;
  const res = await axios.patch(url, { userId }, { withCredentials: true });
    if (res.status === 200) {
    return res.data as Notification[];
  }
    throw new Error(
    (res.data && (res.data.message || res.data.error)) || `Unexpected status ${res.status}`,
  );
}
export const notificationQueries = {
  list: (params: { userId?: string }) => ({
    queryKey: ['notifications', params.userId],
    queryFn: () => fetchNotifications(params.userId),
    enabled: !!params.userId,
    staleTime: 1000 * 60 * 5, // 5 phút
    cacheTime: 1000 * 60 * 10, // 10 phút
  }),
};