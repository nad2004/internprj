'use client';

import { useQuery } from '@tanstack/react-query';
import NotificationCard from './NotificationCard';
import { Notification } from '@/types/Notification';
import { Bell, AlertCircle, CheckCircle2 } from 'lucide-react';
import { notificationQueries} from '@/lib/api/notifications';
import { useUserStore, UserState } from '@/store/userStore';

export default function NotificationsTab() {
    const profile = useUserStore((u) => (u as UserState).profile);
    const userId = profile?._id ?? '';
    const { data } = useQuery({ ...notificationQueries.list({ userId }) });
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold flex justify-center items-center"><span >Notifications</span> <Bell className='ml-2 w-5 h-5 '/></h2>

      {/* Header grid 3 cột */}
      <div className="hidden md:grid grid-cols-2 gap-4 px-2 py-3 text-sm font-medium uppercase tracking-wide text-slate-700">
        <div className="text-center">Title</div>
        <div className="text-center">Type</div>
      </div>

      {data?.data.length ? (
        <div className="space-y-3">
          {data.data.map((n: Notification) => (
            <NotificationCard key={n._id} n={n} userId={profile?._id} />
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground px-2 py-4">No notifications yet.</div>
      )}
    </div>
  );
}
