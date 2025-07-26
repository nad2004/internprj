'use client';

import {
  FaHome,
  FaBook,
  FaUsers,
  FaBookmark,
  FaCog,
  FaBars,
} from 'react-icons/fa';
import NavigateButton from '@/components/NavigateButton';
import { useState } from 'react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <FaHome className="text-lg" />,
  },
  {
    label: 'Book',
    href: '/admin/book-overview',
    icon: <FaBook className="text-base" />,
  },
  {
    label: 'BookMark',
    href: '/admin/bookmarks',
    icon: <FaBookmark className="text-base" />,
  },
  {
    label: 'Members',
    href: '/admin/users',
    icon: <FaUsers className="text-base" />,
  },
  {
    label: 'Borrowing',
    href: '/admin/borrowing',
    icon: <FaCog className="text-base" />,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: <FaCog className="text-base" />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } h-screen bg-gray-50 border-r p-4 flex flex-col transition-all duration-300`}
    >
      {/* Toggle button */}
     <div className={`mb-6 ${collapsed ? 'flex justify-center' : 'flex items-center justify-between'}`}>
        {!collapsed && (
            <div>
            <h1 className="text-base font-semibold text-gray-800">Library Admin</h1>
            <p className="text-sm text-gray-500">Manage your library</p>
            </div>
        )}
        <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-black p-2 rounded-md"
        >
            <FaBars />
        </button>
    </div>

      {/* Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavigateButton
            key={item.href}
            href={item.href}
            icon={item.icon}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-200"
          >
            {!collapsed && <span>{item.label}</span>}
          </NavigateButton>
        ))}
      </nav>
    </aside>
  );
}
