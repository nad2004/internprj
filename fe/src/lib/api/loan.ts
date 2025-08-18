// apis/loans.ts
import axios from 'axios';
import type { BorrowPayload, Loan } from '@/types/Borrow';
import { queryOptions } from '@tanstack/react-query';
import { keyFactory } from '@/lib/queryKeys';

const loanKeys = keyFactory('loans');
export async function createLoan(payload: BorrowPayload) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/loan`;
  try {
    const res = await axios.post(url, payload);
    // chấp nhận 200/201
    if (res.status === 200 || res.status === 201) {
      return res.data as Loan;
    }
    // non-2xx: quăng lỗi với message server
    throw new Error(
      (res.data && (res.data.message || res.data.error)) || `Unexpected status ${res.status}`,
    );
  } catch (err: any) {
    // chuẩn hoá message từ axios
    if (axios.isAxiosError(err)) {
      const msg = (err.response?.data as any)?.message || err.message || 'Request failed';
      throw new Error(msg);
    }
    throw err;
  }
}
export async function fetchLoans(params?: Record<string, string | number>) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/loan/`, {
    params,
    withCredentials: true,
  });
  return res.data.data as Loan[];
}
export const loanQueries = {
  all: () =>
    queryOptions({
      queryKey: loanKeys.all,
      queryFn: fetchLoans(),
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
  list: (params?: Record<string, string | number>) =>
    queryOptions({
      queryKey: loanKeys.list(params),
      queryFn: fetchLoans(params),
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
};
