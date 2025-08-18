'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchStore } from '@/store/searchStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore, UserState } from '@/store/userStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchInput from '@/components/SearchInput';
import localFont from 'next/font/local';
import { useClock } from '@/hooks/useClock';
import useLogout from '@/hooks/auth/useLogout';
import { useDebounce } from '@/hooks/useDebounce';

import ChevronDown from '@/icons/ChevronDown.svg';
import Globe from '@/icons/Globe.svg';
import Clock from '@/icons/Clock.svg';
import CalendarDays from '@/icons/CalendarDays.svg';
import ClientSearch from '@/icons/ClientSearch.svg';
import ClientFilter from '@/icons/ClientFilter.svg';

const digital = localFont({ src: '../../fonts/DigitalNumbers.ttf' });
type Lang = 'EN' | 'VI';

const pill =
  'h-12 rounded-full border border-slate-200 bg-white shadow-sm ' +
  'px-4 text-base text-slate-700 flex items-center gap-3';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // chỉ lấy action để tránh re-render không cần thiết
  const setQuery = useSearchStore((s) => s.setQuery);

  const [localQ, setLocalQ] = useState('');
  const debouncedQ = useDebounce(localQ, 350);

  // live-search: debounce xong thì cập nhật store
  useEffect(() => {
    const q = debouncedQ.trim();
    setQuery(q);
  }, [debouncedQ, pathname, router, setQuery]);
  const profile = useUserStore((u) => (u as UserState).profile);
  const handleLogout = useLogout(profile?._id || '');

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const name = mounted ? (profile?.username ?? 'Guest') : '';
  const avatar = mounted ? (profile?.avatar ?? '') : '';

  const [category, setCategory] = useState<'All' | 'Books' | 'Authors' | 'Tags'>('All');
  const [lang, setLang] = useState<Lang>('EN');

  const initials = useMemo(() => {
    if (!name) return 'U';
    const p = name.trim().split(' ');
    return (p[0][0] + (p[1]?.[0] || '')).toUpperCase();
  }, [name]);

  const { timeLabel, dateLabel } = useClock('minute');

  // click kính lúp: chạy ngay, không chờ debounce
  const handleSearchClick = () => {
    const q = localQ.trim();
    if (!q) return;
    setQuery(q);
    if (pathname !== '/search') router.push('/search');
  };

  return (
    <header className="sticky top-4 z-30">
      <div className="mx-6 mt-4 rounded-full p-2">
        <div
          className="
            grid items-center gap-3
            sm:grid-cols-1
            md:grid-cols-[minmax(620px,1fr)_max-content_minmax(440px,1fr)_minmax(190px,260px)]
          "
        >
          {/* All + Search */}
          <div className={`${pill} w-full min-w-[520px] pl-2`}>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 hover:bg-slate-50">
                <span className="truncate">{category}</span>
                <ChevronDown className="h-5 w-5 text-[#4D4D4D]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {(['All', 'Books', 'Authors', 'Tags'] as const).map((c) => (
                  <DropdownMenuItem key={c} onClick={() => setCategory(c)}>
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span aria-hidden className="mx-2 h-7 w-px bg-slate-200" />

            <SearchInput
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)} // chỉ cập nhật local
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()} // optional
              placeholder="Search"
              className="h-10 flex-1 min-w-0 bg-transparent border-0 px-0 py-0
                         text-base placeholder:text-slate-400 focus:border-0 focus:ring-0 outline-none"
            />

            <div className="flex items-center gap-1.5 pr-1">
              <button
                type="button"
                aria-label="Search"
                onClick={handleSearchClick}
                className="grid h-9 w-9 place-items-center rounded-full text-[#F76B56]
                           hover:bg-[#F76B56]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F76B56]/30"
              >
                <ClientSearch className="h-5 w-5 shrink-0" />
              </button>
              <span aria-hidden className="mx-2 h-7 w-px bg-slate-200" />
              <button
                disabled
                type="button"
                aria-label="Filter"
                className="grid h-9 w-9 place-items-center rounded-full text-[#F76B56]
                           hover:bg-[#F76B56]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F76B56]/30"
              >
                <ClientFilter className="h-5 w-5 shrink-0" />
              </button>
            </div>
          </div>

          {/* Lang */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`${pill} min-w-[120px] justify-between`}>
              <span className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#F76B56]" />
                <span className="hidden sm:inline">Lang</span>
              </span>
              <ChevronDown className="h-5 w-5 text-[#4D4D4D]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              {(['EN', 'VI'] as const).map((l) => (
                <DropdownMenuItem key={l} onClick={() => setLang(l)}>
                  {l}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date + Time */}
          <div
            className={`${pill} w-full min-w-[460px] px-4`}
            role="group"
            aria-label="Date and time"
          >
            <div className="flex flex-1 items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-[#F76A56]" />
              <span className={`${digital.className} text-[15px] tracking-[0.2em] tabular-nums`}>
                {timeLabel}
              </span>
            </div>
            <span aria-hidden className="mx-3 h-7 w-px bg-slate-200" />
            <div className="flex flex-1 items-center justify-center gap-2 min-w-0">
              <CalendarDays className="h-5 w-5 text-[#F76A56]" />
              <span
                className={`${digital.className} text-[15px] tracking-[0.2em] tabular-nums whitespace-nowrap`}
              >
                {dateLabel}
              </span>
            </div>
          </div>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${pill} pr-3 min-w-[190px] max-w-[200px] justify-center`}
            >
              {mounted && (
                <>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="mx-1 max-w-[140px] truncate text-center">{name}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#4D4D4D]" />
                </>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 text-base text-center">
              <DropdownMenuLabel className="truncate">{name || 'Guest'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              {profile?.role == 'admin' && (
                <DropdownMenuItem className="justify-center">
                  <Link href="/admin/dashboard">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                <button className="w-full" onClick={handleLogout}>
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
