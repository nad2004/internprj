import Header from './Header';
import CardModules from './CardModules';
import Calendar from './Calendar';
import { Suspense } from 'react';
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc]">
      <header className="h-16 flex items-center justify-between px-6 border-b bg-white sticky top-0 z-10">
        <Header />
      </header>
      <div className="p-6 flex flex-col gap-6 flex-1 ">
        <Suspense fallback={<div>Loading...</div>}>
          <CardModules />
          <Calendar />
        </Suspense>
      </div>
    </div>
  );
}
