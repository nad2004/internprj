import { create } from 'zustand';

interface AuthState {
  loading: boolean;
  authStart: () => void;
  authSuccess: () => void;
  authFailure: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loading: false,
  authStart: () => set({ loading: true }),
  authSuccess: () => set({ loading: false }),
  authFailure: () => set({ loading: false }),
}));
