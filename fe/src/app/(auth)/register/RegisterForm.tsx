'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister, useVerifyOtp } from '@/hooks/auth/useRegister';
import { VerifyOtpDialog } from '@/components/VerifyOtpDialog';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import FormOverlay from '@/components/FormOverlay';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/icons/Logo.svg';

const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password is required'),
});
type RegisterFormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const router = useRouter();
  const { registerUser } = useRegister();
  const { verifyOtp } = useVerifyOtp();

  const loading = useAuthStore((s) => s.loading);
  const { authStart, authSuccess, authFailure } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', password: '' },
  });

  // Only-UI confirm password (không submit lên server)
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const onSubmit = async (data: RegisterFormData) => {
    authStart();
    try {
      await registerUser(data);
      setRegisteredEmail(data.email);
      setOpenVerifyOtp(true);
      authSuccess();
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Đăng ký thất bại!');
      authFailure();
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtp(registeredEmail, otp);
      alert(`Đã xác thực OTP cho email: ${registeredEmail}`);
      setOpenVerifyOtp(false);
      router.push('/login');
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Xác thực OTP thất bại!');
    }
  };

  const inputCls =
    'h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm ' +
    'placeholder:text-slate-400 shadow-sm ' +
    'focus:border-[#ff6b57] focus:ring-2 focus:ring-[#ff6b57]/20 outline-none';

  return (
    <>
      <FormOverlay loading={loading} />

      <div className="rounded-2xl border border-black/5 bg-white/95 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] sm:p-8">
        {/* Logo + Title */}
        <div className="mb-5 text-center">
          <Logo aria-hidden="true" className="mx-auto block h-auto w-28 sm:w-32" />
          <h2 className="mt-4 text-sm font-medium text-slate-700">Registration</h2>
          <p className="mt-1 text-xs text-slate-500">For your staff & students</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-3 ${loading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Name</label>
            <input
              {...register('username')}
              placeholder="User Name"
              className={inputCls}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Email
            </label>
            <input
              {...register('email')}
              placeholder="username@email.com"
              className={inputCls}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
            <input
              type={showPwd ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              aria-label={showPwd ? 'Hide password' : 'Show password'}
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 top-[34px] rounded px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
            >
              {showPwd ? 'Hide' : 'Show'}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-[#ff6b57] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 active:translate-y-[1px]"
          >
            Register
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-5 grid grid-cols-2 items-center text-center text-xs text-slate-600">
          <p className="justify-self-start">
            Already a User?{' '}
            <Link href="/login" className="font-medium underline-offset-2 hover:underline">
              Login now
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Dialog (giữ nguyên logic) */}
      <VerifyOtpDialog
        open={openVerifyOtp}
        setOpen={setOpenVerifyOtp}
        onVerify={handleVerifyOtp}
        email={registeredEmail}
      />
    </>
  );
}
