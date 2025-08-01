'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister, useVerifyOtp } from '../../../hooks/useRegister';
import { VerifyOtpDialog } from '@/components/VerifyOtpDialog';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { redirect } from 'next/navigation';
import FormOverlay from '@/components/FormOverlay';
import Link from 'next/link';
const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password is required'),
});
export const BookwormLogo = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Đây là một SVG đơn giản để minh họa, bạn nên thay bằng logo thật */}
    <circle cx="50" cy="30" r="12" />
    <circle cx="30" cy="45" r="10" />
    <circle cx="70" cy="50" r="10" />
    <circle cx="50" cy="65" r="15" />
    <circle cx="35" cy="70" r="8" />
    <circle cx="65" cy="70" r="8" />
    <circle cx="25" cy="25" r="5" />
    <circle cx="75" cy="25" r="5" />
  </svg>
);

export default function RegisterForm() {
  const [isRegisterPage, setIsRegisterPage] = useState(true);
  const { registerUser } = useRegister();
  const { verifyOtp } = useVerifyOtp();
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const loading = useAuthStore((state) => state.loading);
  const { authStart, authSuccess, authFailure } = useAuthStore();
  // Nếu xác thực bằng email, bạn có thể lưu luôn cả username hoặc ID user nếu cần gửi cho BE

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    authStart();
    try {
      await registerUser(data);
      setRegisteredEmail(data.email);
      setOpenVerifyOtp(true);
      authSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Đăng ký thất bại!');
      authFailure();
    }
  };

  // Hàm xử lý khi xác thực OTP
  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtp(registeredEmail, otp);
      alert(`Đã xác thực OTP cho email: ${registeredEmail}`);
      setOpenVerifyOtp(false);
      redirect('/login'); // Chuyển hướng đến trang đăng nhập sau khi xác thực thành công
    } catch (error: any) {
      alert(error.response?.data?.error || 'Xác thực OTP thất bại!');
    }
  };

  return (
    <>
      <FormOverlay loading={loading} />
      <div className={`flex  max-h-screen font-sans `}>
        {/* Phần bên trái - Giới thiệu */}
        <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center items-center p-12 text-center order-1 rounded-r-[60px] rounded-bl-[60px]">
          <div className="w-full max-w-sm">
            <BookwormLogo className="w-24 h-24 text-white mx-auto mb-4" />
            <h2 className="text-5xl font-bold">BookWorm</h2>
            <p className="text-lg tracking-[0.3em] font-light mt-1 mb-12">LIBRARY</p>
            <p className="mb-6">Already have an account? Sign In now.</p>
            {/* Sử dụng thẻ a thay vì Link */}
            <Link
              href="/login"
              className="w-2/3 py-3 m-auto border flex items-center justify-center border-white rounded-full font-semibold hover:bg-white hover:text-black transition"
            >
              SIGN IN
            </Link>
          </div>
        </div>

        {/* Phần bên phải - Form Đăng Ký */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 sm:p-12 order-2 rounded-l-[60px] rounded-tr-[60px]">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center text-center">
              <BookwormLogo className="w-16 h-16 text-black mb-6" />
              <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
              <p className="text-gray-500 mb-8">Please provide your information to sign up.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register('email')}
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black transition"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('email')}
                  placeholder="Email.."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black transition"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <input
                    {...register('username')}
                    placeholder="Username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black transition"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <input
                    type="password"
                    {...register('password')}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black transition"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition text-base mt-2"
              >
                SIGN UP
              </button>
              {errors.root && (
                <p className="text-red-500 text-sm mt-1 text-center">{errors.root.message}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Dialog OTP */}
      <VerifyOtpDialog
        open={openVerifyOtp}
        setOpen={setOpenVerifyOtp}
        onVerify={handleVerifyOtp}
        email={registeredEmail}
      />
    </>
  );
}
