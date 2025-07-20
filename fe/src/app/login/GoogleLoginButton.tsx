'use client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import axios from 'axios';

export default function GoogleLoginButton() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your_google_client_id';
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse: any) => {
    const { credential } = credentialResponse;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login-google`,
        { credential },
        { withCredentials: true }
      );
      dispatch(setUser(response.data.user));
      // Có thể redirect ở đây nếu muốn
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => alert('Google Login Failed')}
        logo_alignment="left"
      />
    </GoogleOAuthProvider>
  );
}
