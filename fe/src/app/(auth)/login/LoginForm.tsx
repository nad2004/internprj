'use client';
import GoogleLoginButton from './GoogleLoginButton';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../../../hooks/auth/useLogin';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/icons/Logo.svg';
const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Password is required'),
});
type LoginFormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const loading = useAuthStore((s) => s.loading);
  const { authStart, authSuccess, authFailure } = useAuthStore();
  const { login } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    authStart();
    try {
      await login(data);
      authSuccess();
      router.push('/home');
      alert('Đăng nhập thành công');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.error || error.message || 'Đăng nhập thất bại';
        console.error('Axios error:', msg, error.response?.data);
        authFailure();
        alert(msg);
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
        authFailure();
        alert('Đăng nhập thất bại');
      } else {
        console.error('Unknown error:', error);
        authFailure();
        alert('Đăng nhập thất bại');
      }
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-white/95 p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] sm:p-8">
        {/* Logo / Title */}
        <div className="mb-6 text-center">
          <Logo
            aria-hidden="true"
            className="mx-auto h-auto w-28 sm:w-32" // <= thu nhỏ logo
          />
          <p className="mt-4 text-sm font-medium text-slate-700">Welcome Back !</p>
          <p className="mt-1 text-xs text-slate-500">Sign in to continue to your digital Library</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-4 ${loading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
            <input
              {...register('email')}
              placeholder="username@bookworms.ac.th"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-[#ff6b57]"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-[#ff6b57]"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 rounded px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300 text-[#ff6b57] focus:ring-0"
              />
              Remember me
            </label>
            <Link
              href="#"
              className="text-xs text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-[#ff6b57] py-2.5 text-sm font-semibold text-white transition hover:brightness-95 active:translate-y-[1px]"
          >
            Login
          </button>
          <GoogleLoginButton />
        </form>

        <div className="mt-5 space-y-1 text-center text-xs">
          <p>
            New User?{' '}
            <Link
              href="/register"
              className="font-medium text-slate-700 underline-offset-2 hover:underline"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
