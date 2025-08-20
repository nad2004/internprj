'use client';

import StatCard from '@/app/admin/dashboard/StatCard';
import BranchIcon from '@/icons/BranchIcon.svg';
import ReceiptIcon from '@/icons/ReceiptIcon.svg';

import UserIcon from '@/icons/UserIcon.svg';
import BookIcon from '@/icons/BookIcon.svg';

import { booksQueries } from '@/lib/api/book';
import { userQueries } from '@/lib/api/user';
import { loanQueries } from '@/lib/api/loan';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Rocket, ThumbsDown, ThumbsUp } from 'lucide-react';

export default function Dashboard() {
  const { data } = useQuery({ ...booksQueries.list() });
  const totalBooks = data?.pagination?.total ?? 0;

  const { data: users = [] } = useQuery(userQueries.all());
  const { data: loans = [] } = useQuery({ ...loanQueries.all() });

  const issued = loans.filter((x) => x.status === 'pending').length;
  const returned = loans.filter((x) => x.status === 'returned').length;
  const notReturned = loans.filter((x) => x.status !== 'returned' && x.status !== 'pending').length;
  const Loans = loans.length;
  const overdueUsers =
    loans
      .filter((l) => l.status === 'overdue' && l.userId && l.userId.username)
      .map((l) => l.userId!.username) || [];

  const today = new Date().toLocaleDateString('en-US'); // MM/DD/YYYY

  return (
    <div className="space-y-6">
      {/* Hàng 1: 4 thẻ màu kiểu control panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BookIcon />} value={totalBooks} label="Books" tone="sky" />
        <StatCard icon={<UserIcon />} value={users.length} label="Members" tone="green" />
        <StatCard icon={<ReceiptIcon />} value={Loans} label="Total Loans" tone="amber" />
        <StatCard icon={<BranchIcon />} value={overdueUsers.length} label="Overdue" tone="rose" />
      </div>

      {/* Hàng 2: 3 ô nhỏ + 1 ô ngày hiện tại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat
          tone="sky"
          icon={<Rocket className="w-7 h-7" />}
          title="PENDING"
          value={issued}
        />
        <MiniStat
          tone="emerald"
          icon={<ThumbsUp className="w-7 h-7" />}
          title="RETURNED"
          value={returned}
        />
        <MiniStat
          tone="rose"
          icon={<ThumbsDown className="w-7 h-7" />}
          title="NOT RETURNED"
          value={notReturned}
        />
        <DateCard value={today} />
      </div>
  
    </div>
  );
}



function MiniStat({
  icon,
  title,
  value,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  tone: "sky" | "emerald" | "rose";
}) {
  const leftBg =
    tone === "sky"
      ? "bg-sky-500"
      : tone === "emerald"
      ? "bg-emerald-500"
      : "bg-rose-500";

  return (
    <div className="flex overflow-hidden rounded-md border bg-white shadow-sm">
      <div className={`${leftBg} text-white w-24 flex items-center justify-center`}>
        {icon}
      </div>
      <div className="flex-1 p-4">
        <p className="text-xs tracking-wide text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function DateCard({ value }: { value: string }) {
  return (
    <div className="flex overflow-hidden rounded-md border bg-white shadow-sm">
      <div className="bg-amber-500 text-white w-24 flex items-center justify-center">
        <CalendarDays className="w-7 h-7" />
      </div>
      <div className="flex-1 p-4">
        <p className="text-xs tracking-wide text-gray-500">DATE TODAY</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
