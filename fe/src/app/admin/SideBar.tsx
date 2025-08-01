'use client';

import { LayoutDashboard, BookOpen, Users, Bookmark, Menu, LogOut, Book } from 'lucide-react';

import NavigateButton from '@/components/NavigateButton';
import { useState } from 'react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Catalog',
    href: '/admin/catalog',
    icon: <Book className="w-5 h-5" />,
  },
  {
    label: 'Books',
    href: '/admin/book-overview',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Branches',
    href: '/admin/branches',
    icon: <Bookmark className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } h-auto bg-black text-white p-4 flex flex-col justify-between transition-all duration-300`}
    >
      {/* Logo & Toggle */}
      <div>
        <div
          className={`mb-8 ${collapsed ? 'justify-center' : 'justify-between'} flex items-center`}
        >
          {!collapsed && (
            <div className="font-bold text-lg">
              <span>📚 BookWorm</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="space-y-2 flex flex-col">
          {menuItems.map((item) => (
            <NavigateButton
              key={item.href}
              href={item.href}
              icon={item.icon}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-white/40 transition-all text-sm font-medium"
            >
              {!collapsed && <span>{item.label}</span>}
            </NavigateButton>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-6 ">
        <NavigateButton
          href="/logout"
          icon={<LogOut className="w-5 h-5" />}
          className="flex items-center gap-3 p-3 rounded-md hover:bg-white/40 text-sm font-medium w-full"
        >
          {!collapsed && <span>Log Out</span>}
        </NavigateButton>
      </div>
    </aside>
  );
}
