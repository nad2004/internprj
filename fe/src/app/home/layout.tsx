import LeftSidebar from './LeftSidebar';
import { Suspense } from 'react';
import RightSidebar from './RightSidebar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black text-white flex flex-col z-20">
      <Suspense fallback={<div>Loading...</div>}>
        <LeftSidebar />
      </Suspense>
      </aside>
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Nếu bạn dùng header sticky ở đây, thêm vào */}
        <div className="flex-1 flex flex-row overflow-hidden">
          <section className="flex-1 pt-6 overflow-auto">{children}</section>
          <aside className="w-80 h-[100vh] sticky top-0 border-l border-gray-200 bg-white p-2">
            <Suspense fallback={<div>Loading...</div>}>
            <RightSidebar />
            </Suspense>
          </aside>
        </div>
      </div>
    </div>
  );
}
