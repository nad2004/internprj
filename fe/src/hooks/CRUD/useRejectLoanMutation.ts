// mutations/useRejectLoanMutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectLoan, loanQueries } from '@/lib/api/loan';

// Biến gửi vào mutation
type Vars = {
  id: string;
  reason: string;
};

// Kiểu dữ liệu trả về từ API (suy ra từ hàm)
type Loan = Awaited<ReturnType<typeof rejectLoan>>;

export function useRejectLoanMutation() {
  const qc = useQueryClient();

  return useMutation<Loan, unknown, Vars>({
    mutationKey: ['loans', 'reject'],
    mutationFn: (vars) => rejectLoan(vars),
    onSuccess: async (loan) => {
      await qc.invalidateQueries({ queryKey: loanQueries.all().queryKey });
    },
  });
}
