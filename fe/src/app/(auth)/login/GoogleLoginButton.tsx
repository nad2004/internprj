'use client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import FormOverlay from '@/components/FormOverlay';
export default function GoogleLoginButton() {
  const loading = useAuthStore((state) => state.loading);
  const { authStart, authSuccess, authFailure } = useAuthStore();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const handleSuccess = async (credentialResponse: any) => {
    authStart();
    const { credential } = credentialResponse;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login-google`,
        { credential },
        { withCredentials: true },
      );
      setUser(response.data.data);
      authSuccess();
      alert('Login successful!');
      router.push('/home');
    } catch (error) {
      console.error('Google login failed:', error);
      authFailure();
      alert('Login failed. Please try again.');
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <FormOverlay loading={loading} />
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => alert('Google Login Failed')}
        logo_alignment="left"
      />
    </GoogleOAuthProvider>
  );
}
