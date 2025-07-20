'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from './useLogin';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Password is required'),
});

export default function LoginForm() {
  const { login } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    try {
      await login(data);
    } catch (error: any) {
    console.error('Login failed:', error);
      alert(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center text-black">
          <input type="checkbox" className="mr-2 accent-black" />
          Remember Me
        </label>
        <a
          href="#"
          className="text-black text-sm hover:underline hover:text-gray-700 font-medium"
        >
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
  );
}
