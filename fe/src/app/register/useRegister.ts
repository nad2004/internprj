import axios from 'axios';

export function useRegister() {
  const registerUser = async (data: { username: string; email: string; password: string }) => {
    // Gọi API đăng ký ở đây, có thể handle lỗi hoặc xử lý response
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register-local`, data, {
      withCredentials: true,
    });
    return res.data;
  };
  return { registerUser };
}
export function useVerifyOtp() {
  const verifyOtp = async (email: string, otp: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, { email, otp }, {
      withCredentials: true,
    });
    return res.data;
  };
  return { verifyOtp };
}
