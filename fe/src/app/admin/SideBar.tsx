'use client';
import LeftSidebar from '@/components/LeftSidebar';
import DashboardIcon from '@/icons/DashboardIcon.svg';
import UserIcon from '@/icons/UserIcon.svg';
import BookIcon from '@/icons/BookIcon.svg';
import CatalogIcon from '@/icons/CatalogIcon.svg';
const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <DashboardIcon className="text-white" />,
  },
  {
    label: 'Books',
    href: '/admin/books',
    icon: <BookIcon className="text-white" />,
  },
  {
    label: 'Borrowing Status',
    href: '/admin/borrowing',
    icon: <CatalogIcon className="text-white" />,
  },
  {
    label: 'User',
    href: '/admin/users',
    icon: <UserIcon className="text-white " />,
  },
];

export default function Sidebar() {
  return (
    <>
      <LeftSidebar menuItems={menuItems} />
    </>
  );
}
