'use client';
import DashboardIcon from '@/icons/DashboardIcon.svg';
import UserIcon from '@/icons/UserIcon.svg';
import BookIcon from '@/icons/BookIcon.svg';
import CatalogIcon from '@/icons/CatalogIcon.svg';
import LeftSidebar from '@/components/LeftSidebar';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon className="text-white" />,
  },
  {
    label: 'Books',
    href: '/available-books',
    icon: <BookIcon className="text-white" />,
  },
  {
    label: 'Borrowing Status',
    href: '/loan-status',
    icon: <CatalogIcon className="text-white" />,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <UserIcon className="text-white " />,
  },
];
export default function UserSideBar() {
  return (
    <>
      <LeftSidebar menuItems={menuItems} />
    </>
  );
}
