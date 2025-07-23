// app/components/BookLogo.tsx
'use client';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import bookAnim from '@/assets/Book.json';
import { useRef, useEffect } from 'react';
export default function BookLogo() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.65);
    }
  }, []);
  return (
    <div className="w-16 h-16">
      <Lottie
        animationData={bookAnim}
        loop={true}
        autoplay={true}
        lottieRef={lottieRef}
        style={{ width: 64, height: 64 }}
      />
    </div>
  );
}
