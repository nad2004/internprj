import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import type { AppDispatch } from '@/store';
import axios from 'axios';

export function useLogin() {
  const dispatch = useDispatch<AppDispatch>();

  const login = async (data: { email: string; password: string }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login-local`,
      data,
      { withCredentials: true }
    );
    dispatch(setUser(response.data.user));
    return response.data.user;
  };

  return { login };
}
