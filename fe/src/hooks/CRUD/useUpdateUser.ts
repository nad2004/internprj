import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, userQueries } from '@/lib/api/user';
import type { User } from '@/types/User';

type Vars = { data: User };

export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation<User, Error, Vars>({
    mutationFn: ({ data }) => updateUser(data),
    onSuccess: async (server) => {
      qc.invalidateQueries({ queryKey: userQueries.all().queryKey });
    },
  });
}
