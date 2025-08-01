'use client';
import { LogOut, Menu } from 'lucide-react';
import { ReactNode } from 'react';
import { useState } from 'react';
import NavigateButton from '@/components/NavigateButton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import useLogout from '@/hooks/useLogout';
import { useUserStore } from '@/store/userStore';
type MenuItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export default function LeftSidebar({ menuItems }: { menuItems?: MenuItem[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const profile = useUserStore((state) => state.profile);
  const handleLogout = useLogout(profile?.id || '');
  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-black text-white flex flex-col min-h-screen transition-all duration-300`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-10 h-10 p-2 rounded hover:bg-white/10 flex items-center justify-center "
      >
        <Menu className="w-5 h-5" />
      </button>
      {/* User info */}
      <div className="flex items-center gap-3 p-3 rounded-t-lg bg-[#18191b]">
        <Avatar className="w-10 h-10 border border-gray-700">
          <AvatarImage key={profile?.avatar} src={profile?.avatar} alt="User" />
          <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center">
          {!collapsed && (
            <>
              <span className="text-base font-semibold leading-tight">{profile?.username}</span>
              <span className="text-xs text-gray-300">{profile?.email}</span>
            </>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 mt-4 mx-2">
        {menuItems?.map((item) => (
          <NavigateButton
            key={item.href}
            href={item.href}
            icon={item.icon}
            className="flex items-center gap-3 p-4 rounded-md hover:bg-gray-800"
          >
            {!collapsed && <span>{item.label}</span>}
          </NavigateButton>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-700 mx-2 my-4"></div>

      {/* Bottom menu */}
      <div className="flex flex-col gap-2 mb-2">
        <button
          className="flex items-center gap-2 p-4 hover:bg-gray-800 rounded-md text-left"
          onClick={handleLogout}
        >
          <LogOut className="text-base" /> {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
