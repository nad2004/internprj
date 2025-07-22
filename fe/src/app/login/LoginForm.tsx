'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from './useLogin';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure } from '@/store/authSlice';
import FormOverlay from '@/components/FormOverlay';
const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Password is required'),
});

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const { login } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    dispatch(authStart());
    try {
      await login(data);
      dispatch(authSuccess());
      alert('Login successful!');
      router.push('/home'); 
    } catch (error: any) {
      console.log('Login failed:', error);
      dispatch(authFailure('Login failed!'));
      alert(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <>
    <FormOverlay loading={loading} />
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${loading ? 'pointer-events-none opacity-60' : ''}`}>
      <div>
        <input
          {...register('email')}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none border border-gray-200 focus:border-black transition"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <input
          type="password"
          {...register('password')}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none border border-gray-200 focus:border-black transition"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center text-black">
          <input type="checkbox" className="mr-2 accent-black" />
          Remember Me
        </label>
        <a href="#" className="text-black text-sm hover:underline hover:text-gray-700 font-medium">
          Forgot Password?
        </a>
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition text-lg mt-2 shadow"
      >
        Login
      </button>
    </form>
    </>
  );
}
