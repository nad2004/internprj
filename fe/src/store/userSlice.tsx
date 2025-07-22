import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../types/User';

// Định nghĩa interface cho state
interface UserState {
  profile: User | null;
}

// Giá trị khởi tạo
const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.profile = action.payload;
    },
    logout(state) {
      state.profile = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
