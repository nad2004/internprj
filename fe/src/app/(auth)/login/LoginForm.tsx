'use client';
import axios from 'axios';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../../../hooks/auth/useLogin';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import FormOverlay from '@/components/FormOverlay';
import Link from 'next/link';
import GoogleLoginButton from './GoogleLoginButton';
import { BookwormLogo } from '@/components/BookwormLogo';
const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Password is required'),
});
type LoginFormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const loading = useAuthStore((state) => state.loading);
  const { authStart, authSuccess, authFailure } = useAuthStore();
  const { login } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    authStart();
    try {
      await login(data);
      authSuccess();
      router.push('/home');
      alert('Đăng nhập thành công');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Đây là AxiosError: có thể đọc response
        const msg = error.response?.data?.error || error.message || 'Đăng nhập thất bại';
        console.error('Axios error:', msg, error.response?.data);
        authFailure();
        alert(msg);
      } else if (error instanceof Error) {
        // Lỗi JS thông thường
        console.error('Error message:', error.message);
        authFailure();
        alert('Đăng nhập thất bại');
      } else {
        // Bất kỳ thứ gì khác (string, number, object lạ)
        console.error('Unknown error:', error);
        authFailure();
        alert('Đăng nhập thất bại');
      }
    }
  };

  return (
    <>
      <FormOverlay loading={loading} />
      <main className="flex flex-col md:flex-row max-h-screen font-sans">
        {/* Phần bên trái - Form Đăng Nhập */}
        <div className="w-full max-w-1/2 bg-white flex flex-col justify-center items-center p-8 sm:p-12 order-2 md:order-1">
          <div className="w-full ">
            <div className="flex flex-col items-center text-center">
              <BookwormLogo className="w-16 h-16 text-black mb-6" />
              <h1 className="text-3xl font-bold mb-2">Welcome Back !!</h1>
              <p className="text-gray-500 mb-8">Please enter your credentials to log in</p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            >
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
              <div>
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

              <Link href="#" className="text-sm text-black hover:underline block pt-1 pb-2">
                Forgot password?
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition text-base"
              >
                {loading ? 'Signing In...' : 'SIGN IN'}
              </button>
            </form>
            <div className="mt-4 ">
              <GoogleLoginButton />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center items-center p-12 text-center order-1 md:order-2 rounded-l-[60px]">
          <div className="w-full max-w-sm ">
            <BookwormLogo className="w-24 h-24 text-white mx-auto mb-4" />
            <h2 className="text-5xl font-bold">BookWorm</h2>
            <p className="text-lg tracking-[0.3em] font-light mt-1 mb-12">LIBRARY</p>
            <p className="mb-6">New to our platform? Sign Up now.</p>

            <Link
              href="/register"
              className="w-2/3 py-3 m-auto border flex items-center justify-center border-white rounded-full font-semibold hover:bg-white hover:text-black transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
