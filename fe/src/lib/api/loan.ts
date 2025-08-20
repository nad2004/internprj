// apis/loans.ts
import axios from 'axios';
import type { BorrowPayload, Loan } from '@/types/Borrow';
import { queryOptions } from '@tanstack/react-query';
import { keyFactory } from '@/lib/queryKeys';

export type LoanFilters = {
  userId?: string;
  status?: 'pending' | 'reserve' | 'borrowed' | 'returned' | 'overdue' | 'cooldown' | 'rejected';
  bookId?: string;
  q?: string; // tìm nhanh
  page?: number;
  limit?: number;
  from?: string; // ISO yyyy-mm-dd
  to?: string; // ISO yyyy-mm-dd
};

const loanKeys = keyFactory('loans');

export async function createLoan(payload: BorrowPayload) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/loan`;
  try {
    const res = await axios.post(url, payload, { withCredentials: true });
    if (res.status === 200 || res.status === 201) {
      return res.data as Loan;
    }
    throw new Error(
      (res.data && (res.data.message || res.data.error)) || `Unexpected status ${res.status}`,
    );
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const msg = (err.response?.data as any)?.message || err.message || 'Request failed';
      throw new Error(msg);
    }
    throw err;
  }
}

export async function fetchLoans(params?: LoanFilters) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/loan`, {
    params,
    withCredentials: true,
  });
  // tuỳ backend có thể là { data: Loan[] } hay { items, pagination }
  return (res.data.data ?? res.data.items ?? res.data) as Loan[];
}
export async function returnLoan(id?: string) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/loan/return`,
    { id },
    {
      withCredentials: true,
    },
  );
}
export async function nextActionLoan(id?: string) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/loan/next`,
    { id },
    {
      withCredentials: true,
    },
  );
}
export type RejectLoanPayLoad = {
  id: string;
  reason: string;
};
export async function rejectLoan(payload: RejectLoanPayLoad) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/loan/reject`,
    { payload },
    {
      withCredentials: true,
    },
  );
}
export const loanQueries = {
  /** Tất cả (không filter) */
  all: () =>
    queryOptions({
      queryKey: loanKeys.all,
      queryFn: () => fetchLoans(), // <-- truyền hàm, KHÔNG gọi ngay
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: [],
      gcTime: 5 * 60_000,
    }),

  /** Danh sách có filter */
  list: (filters?: LoanFilters) =>
    queryOptions({
      queryKey: loanKeys.list(filters ?? {}),
      queryFn: () => fetchLoans(filters), // <-- truyền hàm, có filters
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: (prev) => prev ?? [], // giữ UI mượt khi đổi filter
      gcTime: 5 * 60_000,
    }),
};
