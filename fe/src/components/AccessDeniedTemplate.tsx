import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
interface AccessDeniedProps {
  timeoutMs?: number;
  redirectTo?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  timeoutMs = 3000,
  redirectTo = "/home",
}) => {
const navigate = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate.push(redirectTo);
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, timeoutMs]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12c0 4.9706-4.0294 9-9 9s-9-4.0294-9-9 4.0294-9 9-9 9 4.0294 9 9z"
              />
            </svg>
            Không có quyền truy cập
          </h2>
          <p className="text-gray-700 mb-6">
            Bạn không đủ quyền để xem trang này. Hệ thống sẽ chuyển hướng về trang chủ trong{" "}
            <strong>{Math.floor(timeoutMs / 1000)}</strong> giây.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ animation: `loading ${timeoutMs}ms linear forwards` }}
            />
          </div>
        </div>
      </div>

      {/* Inline style cho animation thanh tiến trình */}
      <style>
        {`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default AccessDenied;
