'use client';
import { useQuery } from "@tanstack/react-query";
import { loanQueries } from "@/lib/api/loan";
export default function BorrowHistory() {
    const { data, isLoading, isError, error } = useQuery({ ...loanQueries.all() });
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Borrow History</h2>
      <p className="text-sm text-slate-600">Coming soon…</p>
    </div>
  );
}
