import LoginForm from './LoginForm';
import GoogleLoginButton from './GoogleLoginButton';
import Link from 'next/link';
export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfafa]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Welcome Back</h2>
        <LoginForm />
        <div className="mt-4">
          <GoogleLoginButton />
        </div>
        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">Don&#39;t have an account? </span>
          <Link
            href="/register"
            className="text-black text-sm hover:underline hover:text-gray-700 font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
