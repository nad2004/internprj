import { User, Settings } from 'lucide-react';

export default function AdminHeader() {
  const now = new Date();

  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateString = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      {/* Left: Admin Info */}
      <div className="flex items-center gap-2 text-base text-gray-800">
        <User className="w-8 h-8" />
        <div>
          <p className="font-bold">Nisal Gunasekara</p>
          <p className="text-sm font-bold ">Admin</p>
        </div>
      </div>

      {/* Right: Time, Date, Settings */}
      <div className="flex items-center gap-6">
        <div className="text-right text-sm">
          <p className="font-medium">{timeString}</p>
          <p className="text-xs text-gray-500">{dateString}</p>
        </div>
        <button className="p-2 rounded hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
