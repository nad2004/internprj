import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBook, booksQueries } from '@/lib/api/book';
import type { Book } from '@/types/Books';

type Vars = { id: string };

export function useDeleteBook() {
  const qc = useQueryClient();

  return useMutation<Book, Error, Vars>({
    mutationFn: ({ id }) => deleteBook(id),
    onSuccess: async (server) => {
      qc.invalidateQueries({ queryKey: booksQueries.list().queryKey });
    },
  });
}
