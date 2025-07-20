'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister, useVerifyOtp } from './useRegister';
import { VerifyOtpDialog } from '@/components/VerifyOtpDialog';
import { useState } from 'react';
import { Loader2 } from "lucide-react";
import { RootState, AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { registerStart, registerSuccess, registerFailure } from "@/store/authSlice";
const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password is required'),
});

export default function RegisterForm() {
  const { registerUser } = useRegister();
  const { verifyOtp } = useVerifyOtp();
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);
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
    dispatch(registerStart());
    try {
      await registerUser(data);
      setRegisteredEmail(data.email); // Lưu lại email để gửi verify OTP
      setOpenVerifyOtp(true);       
      dispatch(registerSuccess());  // Mở dialog OTP
    } catch (error: any) {
      alert(error.response?.data?.error || 'Đăng ký thất bại!');
      dispatch(registerFailure("Đăng ký thất bại!"));
    }
  };

  // Hàm xử lý khi xác thực OTP
  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtp(registeredEmail, otp);
      alert(`Đã xác thực OTP: ${otp} cho email: ${registeredEmail}`);
      setOpenVerifyOtp(false);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Xác thực OTP thất bại!');
    }
  };
  function FormOverlay({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return (
    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
  return (
    <>
    <div className="relative">
  <FormOverlay loading={loading} />
  
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 ${loading ? "pointer-events-none opacity-60" : ""}`}
    >
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
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition text-lg mt-2 shadow"
        >
          Register
        </button>
      </form>
      {/* Dialog OTP chỉ hiện khi openVerifyOtp = true */}
      <VerifyOtpDialog
        open={openVerifyOtp}
        setOpen={setOpenVerifyOtp}
        onVerify={handleVerifyOtp}
        email={registeredEmail}
      />
  
</div>
      
    </>
  );
}
