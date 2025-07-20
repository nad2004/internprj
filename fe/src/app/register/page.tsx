'use client';
import RegisterForm from './RegisterForm';
import Link from 'next/link';

export default function Register() {
  return (
   <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfafa]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Create Account</h2>
        <RegisterForm />
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
