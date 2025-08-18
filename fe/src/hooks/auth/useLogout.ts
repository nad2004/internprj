import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

import axios from 'axios';
export default function useLogout(userId: string) {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  return async function handleLogout() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        { _id: userId },
        {
          withCredentials: true,
        },
      );
      alert('Đăng xuất thành công!');
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Đăng xuất thất bại!');
    }
  };
}
