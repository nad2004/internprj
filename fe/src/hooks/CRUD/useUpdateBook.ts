// hooks/useUpdateBook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBook, booksQueries } from '@/lib/api/book';
import type { Book, UpdateBookInput } from '@/types/Books';

type Vars = { data: UpdateBookInput };

export function useUpdateBook() {
  const qc = useQueryClient();

  return useMutation<Book, Error, Vars>({
    mutationFn: ({ data }) => updateBook(data),
    onSuccess: async (server) => {
      qc.invalidateQueries({ queryKey: booksQueries.list().queryKey });
    },
  });
}
