'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { typeNotification, Notification } from '@/types/Notification';
import Lottie from "lottie-react";
import DotNotify from "@/icons/DotNotify.json";
import { markNotificationAsRead, notificationQueries } from "@/lib/api/notifications";
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
function TypeBadge({ type }: { type: typeNotification }) {
  const map: Record<typeNotification, string> = {
    loan: 'Loan',
    system: 'System',
  };
  return <Badge className="rounded-xl  text-sm">{map[type]}</Badge>;
}

export default function NotificationCard({ n, userId }: { n: Notification; userId?: string }) {
   const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const handleMarkRead = () => {
      setOpen(true);
    if (n._id) {
       markNotificationAsRead(n._id, userId);
    queryClient.invalidateQueries({ queryKey: notificationQueries.list({ userId }).queryKey });
    }
    };
    
  return (
      <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {!n.readAt && <span className="inline-block h-2 w-2 rounded-full bg-primary" />}
              {n.title}
            </DialogTitle>
            
          </DialogHeader>

          {n.message && (
            <div className="text-sm leading-relaxed">{n.message}</div>
          )}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" className="rounded-xl" onClick={() => setOpen(false)}>Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    <Card onClick={handleMarkRead} className="border rounded-2xl shadow-sm relative">
       {!n.readAt && (
        <div className="absolute top-2 right-2">
          <Lottie animationData={DotNotify} loop={true} className="w-5 h-5" />
        </div>
      )}
      <CardContent className="p-4">
        {/* Desktop: grid 3 cột giống BorrowCard */}
        <div className="hidden md:grid md:grid-cols-2 items-center gap-4">
          {/* Cột 2: Nội dung */}
          <div className="min-w-0">
             <div className="truncate font-medium leading-tight">{n.title}</div>
            {n.message && (
              <p className="text-base truncate leading-tight">{n.message}</p>
            )}
          </div>

          {/* Cột 3: Type */}
          <div className="text-center border-l pl-4">
            <TypeBadge type={n.type ?? 'system'} />
          </div>
        </div>

       
      </CardContent>
    </Card>
      </>
  );
}
