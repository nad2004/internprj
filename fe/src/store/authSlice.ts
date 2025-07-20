// authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  loading: boolean;
}

const initialState: AuthState = {
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart(state) {
      state.loading = true;
    },
    registerSuccess(state) {
      state.loading = false;
    },
    registerFailure(state, action) {
      state.loading = false;
    },
  },
});

export const { registerStart, registerSuccess, registerFailure } = authSlice.actions;
export default authSlice.reducer;
