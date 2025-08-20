'use client';
import { useQuery } from '@tanstack/react-query';
import { loanQueries } from '@/lib/api/loan';
import { useUserStore, UserState } from '@/store/userStore';
import BorrowCard from './BorrowCard';
export default function BorrowHistory() {
  const profile = useUserStore((u) => (u as UserState).profile);
  const { data, isLoading, isError, error } = useQuery({
    ...loanQueries.list({ userId: profile?._id }),
  });
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Borrow History</h2>
      <div
        className={`hidden md:grid grid-cols-5 gap-4 px-2 py-3 text-sm font-medium uppercase tracking-wide text-slate-700`}
      >
        <div>Cover</div>
        <div className="text-center">Title</div>
        <div className="text-center">Serial</div>
        <div className="text-center">Due At</div>
        <div className="text-center">Status</div>
        
        <div />
      </div>
      {data?.map((l) => (
        <BorrowCard key={l._id} loan={l} />
      ))}
    </div>
  );
}
