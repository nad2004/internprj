// hooks/useUpdateBook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookInstance, bookInstanceQueries } from '@/lib/api/bookInstance';
import type { BookInstance, BookInstanceInput } from '@/types/BookInstance';

type Vars = { data: BookInstanceInput };

export function useUpdateBookInstance() {
  const qc = useQueryClient();

  return useMutation<BookInstance, Error, Vars>({
    mutationFn: ({ data }) => updateBookInstance(data),
    onSuccess: async (server) => {
      qc.invalidateQueries({ queryKey: bookInstanceQueries.list().queryKey });
    },
  });
}
