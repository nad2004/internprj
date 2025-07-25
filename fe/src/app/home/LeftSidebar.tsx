'use client';
import {
  FaBookOpen,
  FaSearch,
  FaCheckCircle,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import NavigateButton from '@/components/NavigateButton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useLogout from '@/hooks/useLogout';
const menuItems = [
  {
    label: 'Book Overview',
    href: '/book-overview',
    icon: <FaBookOpen className="text-lg" />,
  },
  {
    label: 'Available Books',
    href: '/available-books',
    icon: <FaSearch className="text-base" />,
  },
  {
    label: 'Loan Status',
    href: '/loan-status',
    icon: <FaCheckCircle className="text-base" />,
  },
  {
    label: 'Members',
    href: '/members',
    icon: <FaUsers className="text-base" />,
  },
  {
    label: 'Borrowing History',
    href: '/borrowing-history',
    icon: <FaClipboardList className="text-base" />,
  },
];
export default function LeftSidebar() {
  const profile = useSelector((state: RootState) => state.user.profile);
  const handleLogout = useLogout(profile?.id || '');
  return (
    <aside className="w-64 bg-black text-white flex flex-col min-h-screen">
      {/* User info */}
      <div className="flex items-center gap-3 p-3 rounded-t-lg bg-[#18191b]">
        <Avatar className="w-10 h-10 border border-gray-700">
          <AvatarImage key={profile?.avatar} src={profile?.avatar} alt="User" />
          <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center">
          <span className="text-base font-semibold leading-tight">{profile?.username}</span>
          <span className="text-xs text-gray-300">{profile?.email}</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 mt-4 mx-2">
        {menuItems.map((item) => (
          <NavigateButton
            key={item.href}
            href={item.href}
            icon={item.icon}
            className="flex items-center gap-3 p-4 rounded-md hover:bg-gray-800"
          >
            {item.label}
          </NavigateButton>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-700 mx-2 my-4"></div>

      {/* Bottom menu */}
      <div className="flex flex-col gap-2 mb-2">
        <button className="flex items-center gap-2 p-4 hover:bg-gray-800 rounded-md text-left">
          <FaCog className="text-base" /> Settings
        </button>
        <button
          className="flex items-center gap-2 p-4 hover:bg-gray-800 rounded-md text-left"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-base" /> Log out
        </button>
      </div>
    </aside>
  );
}
