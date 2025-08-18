// hooks/useAddBookInstance.ts
import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { createLoan } from '@/lib/api/loan';
import type { BorrowPayload, Loan } from '@/types/Borrow';
import { bookInstanceQueries } from '@/lib/api/bookInstance';

export function useCreateLoan(opts?: {
  bookId?: string; // để invalidate "availableDetail"
  onSuccess?: (loan: Loan) => void;
  onError?: (err: Error) => void;
}) {
  const qc = useQueryClient();
  const availKey: QueryKey | null = opts?.bookId
    ? (bookInstanceQueries.availableDetail(opts.bookId).queryKey as QueryKey)
    : null;

  return useMutation({
    mutationKey: ['loan', 'create'],
    mutationFn: (payload: BorrowPayload) => createLoan(payload),

    // (tuỳ chọn) onMutate: có thể optimistic giảm count available...
    // onMutate: async (payload) => {},

    // onSuccess: (data) => {
    //   // Làm tươi các list/detail liên quan
    //   qc.invalidateQueries({ queryKey: ['loans'] });
    //   if (availKey) qc.invalidateQueries({ queryKey: availKey });
    // },

    onError: (err: Error) => {
      opts?.onError?.(err);
    },

    onSettled: () => {
      // Có thể refresh thêm các query khác nếu bạn có
      // qc.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
