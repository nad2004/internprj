// mutations/useReturnLoanMutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { returnLoan } from '@/lib/api/loan';
import { loanQueries } from '@/lib/api/loan';

export function useReturnLoanMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['loans'],
    mutationFn: (id: string) => returnLoan(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: loanQueries.all().queryKey });
    },
  });
}
