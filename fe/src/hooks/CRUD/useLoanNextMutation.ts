// mutations/useReturnLoanMutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nextActionLoan } from '@/lib/api/loan';
import { loanQueries } from '@/lib/api/loan';

export function useLoanNextMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['loans'],
    mutationFn: (id: string) => nextActionLoan(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: loanQueries.all().queryKey });
    },
  });
}
