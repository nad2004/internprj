// hooks/useLogout.ts
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { AppDispatch } from '@/store';
import { logout } from '@/store/userSlice';
import axios from 'axios';
export default function useLogout(userId: string) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
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
      dispatch(logout());
      router.push('/login'); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Đăng xuất thất bại!');
    }
  };
}
