'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AccountSettings from './AccountSettings';
import BorrowHistory from './BorrowHistory';
import NotificationsTab from './NotificationsTab';

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="sticky top-0 z-10 mb-4 w-full justify-start rounded-full bg-white/70 p-1 shadow-sm backdrop-blur">
          <TabsTrigger
            value="account"
            className="rounded-full px-4 py-2 data-[state=active]:bg-[#ffedea] data-[state=active]:text-[#F76B56]"
          >
            Account Setting
          </TabsTrigger>

          <TabsTrigger value="borrow" className="rounded-full px-4 py-2 data-[state=active]:bg-[#ffedea] data-[state=active]:text-[#F76B56]">
            Borrow History
          </TabsTrigger>

          <TabsTrigger value="notifications" className="rounded-full px-4 py-2 data-[state=active]:bg-[#ffedea] data-[state=active]:text-[#F76B56]">
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="borrow">
          <BorrowHistory />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
