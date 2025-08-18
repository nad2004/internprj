'use client';
import Vector1 from '@/icons/Vector1.svg';
import Vector2 from '@/icons/Vector2.svg';
import ClientSideBar from './ClientSideBar';
import Header from './Header';
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen isolate bg-[#f6f6f7] text-slate-800 overflow-hidden">
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute h-full" />
        <Vector1 className="pointer-events-none select-none absolute top-0 left-0 w-full h-full" />
        <Vector2 className="pointer-events-none select-none absolute w-full h-full" />
      </div>

      <div className="h-full p-4 md:p-5 lg:p-6">
        {/* Grid 2 cột: sidebar co giãn bằng clamp, main 1fr */}
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-[clamp(200px,18vw,260px)_1fr] rounded-2xl bg-[#F2F2F2]">
          <ClientSideBar />

          {/* Main */}
          <div className="min-w-0 min-h-0 flex flex-col">
            <Header />
            <main className="mt-3 rounded-xl flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
