'use client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { authStart, authSuccess, authFailure } from '@/store/authSlice';
import FormOverlay from '@/components/FormOverlay';
export default function GoogleLoginButton() {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const dispatch = useDispatch<AppDispatch>();
  const handleSuccess = async (credentialResponse: any) => {
    dispatch(authStart());
    const { credential } = credentialResponse;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login-google`,
        { credential },
        { withCredentials: true },
      );
      dispatch(setUser(response.data.data));
      dispatch(authSuccess());
      alert('Login successful!');
      router.push('/home');
    } catch (error) {
      console.error('Google login failed:', error);
      dispatch(authFailure('Google login failed!'));
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
