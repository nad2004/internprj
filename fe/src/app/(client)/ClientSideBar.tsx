'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import NavigateButton from '@/components/NavigateButton';
import Logo from '@/icons/Logo.svg';

import ClientHome from '@/icons/ClientHome.svg';
import ClientSearch from '@/icons/ClientSearch.svg';
import ClientGift from '@/icons/ClientGift.svg';
import ClientBookshelf from '@/icons/ClientBookshelf.svg';

export default function UserSideBar() {
  const pathname = usePathname();
  const Item = ({
    href,
    label,
    Icon,
  }: {
    href: string;
    label: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }) => {
    const active = pathname === href;
    return (
      <NavigateButton
        href={href}
        // gói icon trong một ô w-6 để tất cả thẳng cột
        icon={
          <span
            className={clsx(
              'grid w-6 place-items-center',
              active ? 'text-slate-900' : 'text-[#8A8A8A]',
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        }
        className={clsx(
          'flex items-center gap-3 rounded-xl px-4 py-3 text-base',
          'justify-start text-slate-700 transition',
          active ? 'bg-slate-50 text-slate-900' : 'hover:bg-slate-50 hover:text-slate-900',
        )}
      >
        <span className="text-left leading-none">{label}</span>
      </NavigateButton>
    );
  };

  return (
    <aside className="sticky top-4 self-start h-[95vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-full flex-col px-6 py-7">
        {/* Logo – căn trái như mock */}
        <Link href="/" className="mb-8 block">
          <Logo className="w-28 h-auto" />
        </Link>

        {/* Nav – các mục thẳng cột nhờ ô icon w-6 */}
        <nav className="flex flex-col gap-4">
          <Item href="/home" label="Home" Icon={ClientHome} />
          <Item href="/search" label="Search" Icon={ClientSearch} />
          <Item href="/shelf" label="My Shelf" Icon={ClientGift} />
          <Item href="/contribute" label="Contribute" Icon={ClientBookshelf} />
        </nav>

        {/* Footer dọc, căn trái */}
        <div className="mt-auto flex flex-col gap-2 pb-2 text-sm text-slate-500">
          <Link href="/about" className="hover:text-slate-700">
            About
          </Link>
          <Link href="/support" className="hover:text-slate-700">
            Support
          </Link>
          <Link href="/terms" className="hover:text-slate-700">
            Terms &amp; Condition
          </Link>
        </div>
      </div>
    </aside>
  );
}
