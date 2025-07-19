'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password is required'),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const onSubmit = (data) => {
    // handle register
    console.log(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfafa]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register('username')}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none border border-gray-200 focus:border-black transition"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          <div>
            <input
              {...register('email')}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none border border-gray-200 focus:border-black transition"
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
              className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none border border-gray-200 focus:border-black transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition text-lg mt-2 shadow"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">Already have an account? </span>
          <Link
            href="/login"
            className="text-black text-sm hover:underline hover:text-gray-700 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
