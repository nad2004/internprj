// components/OneShotNotice.tsx
"use client";

import { X } from "lucide-react";
import * as React from "react";
import Lottie from "lottie-react";
import bellAnim from "@/icons/Bell.json";
export default function OneShotNotice({
  children = "Welcome! Library has new features 🎉",
  duration = 600, // ms: thời gian trượt vào
}: {
  children?: React.ReactNode;
  duration?: number;
}) {
  const [show, setShow] = React.useState(true);
  if (!show) return null;

  return (
    // đặt ở góc phải, cách phải 1rem (right-4)
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full
                   bg-neutral-900 text-white px-4 py-2 shadow mr-4"
        // chỉ animate vào, dừng lại (forwards), KHÔNG onAnimationEnd
        style={{ animation: `notice-slide-right-in ${duration}ms ease-out 1 forwards` }}
      >
        <Lottie animationData={bellAnim} loop autoplay className="w-5 h-5" />;
        <span className="text-sm whitespace-nowrap">{children}</span>
        <button
          aria-label="Close"
          className="ml-2 opacity-70 hover:opacity-100"
          onClick={() => setShow(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
