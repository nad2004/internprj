'use client';

import { usePathname } from 'next/navigation';
import LoginForm from './login/LoginForm';
import RegisterForm from './register/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthTemplate() {
  const pathname = usePathname();
  const isLogin = pathname.includes('/login');

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcfafa] relative">
      <AnimatePresence mode="wait" initial={false}>
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center bg-[#fcfafa]  w-1/2 h-full "
          >
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md">
              <LoginForm />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center bg-[#fcfafa]  w-1/2 h-full"
          >
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md">
              <RegisterForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
