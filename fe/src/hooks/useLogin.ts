import { useUserStore } from '@/store/userStore';
import axios from 'axios';

export function useLogin() {
  const setUser = useUserStore((state) => state.setUser);

  const login = async (data: { email: string; password: string }) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login-local`, data, {
      withCredentials: true,
    });
    setUser(response.data.data);
    return response.data.data;
  };

  return { login };
}
