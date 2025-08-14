import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/User';

interface UserState {
  profile: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setUser: (user) => set({ profile: user }),
      logout: () => set({ profile: null }),
    }),
    {
      name: 'user-storage',
    },
  ),
);
