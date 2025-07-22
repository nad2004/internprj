// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  loading: boolean;
}

const initialState: AuthState = {
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
    },
    authSuccess(state) {
      state.loading = false;
    },
    authFailure(state, action) {
      state.loading = false;
    },
  },
});

export const { authStart, authSuccess, authFailure } = authSlice.actions;
export default authSlice.reducer;
