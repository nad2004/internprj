import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, userQueries } from '@/lib/api/user';
import type { User } from '@/types/User';

type Vars = { id: string };

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation<User, Error, Vars>({
    mutationFn: ({ id }) => deleteUser(id),
    onSuccess: async (server) => {
      qc.invalidateQueries({ queryKey: userQueries.all().queryKey });
    },
  });
}
