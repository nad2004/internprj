import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../types/User';

// Định nghĩa interface cho state
interface UserState {
  user: User | null;
}

// Giá trị khởi tạo
const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
