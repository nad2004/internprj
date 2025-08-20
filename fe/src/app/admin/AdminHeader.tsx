"use client";
import { Settings } from 'lucide-react';

export default function AdminHeader() {
  const now = new Date();

  const dateString = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  return (
    <header className="flex items-center justify-end p-4 border-b bg-white">
      <div className="flex items-center gap-6">
        <div className="text-right text-sm">
          <p className="text-sm text-gray-700 font-medium">{dateString}</p>
        </div>
        <button className="p-2 rounded hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
