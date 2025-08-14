import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBookInstance, bookInstanceQueries } from '@/lib/api/bookInstance';
import type { BookInstance } from '@/types/BookInstance';

type Vars = { id: string };

export function useDeleteBookInstance() {
  const qc = useQueryClient();

  return useMutation<BookInstance, Error, Vars>({
    mutationFn: ({ id }) => deleteBookInstance(id),
    onSuccess: async (server) => {
      qc.invalidateQueries({ queryKey: bookInstanceQueries.list().queryKey });
    },
  });
}
