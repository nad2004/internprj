"use client";

import { ReactNode, useEffect, useState } from "react";
import AccessDenied from "@/components/AccessDeniedTemplate";
import { useUserStore, UserState } from "@/store/userStore";

export default function AdminGate({ children }: { children: ReactNode }) {
  const profile = useUserStore(u => (u as UserState).profile);

  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Nếu có dùng persist
    const hasHydrated = (useUserStore as any).persist?.hasHydrated?.() ?? true;
    setHydrated(hasHydrated);
    const unsub = (useUserStore as any).persist?.onFinishHydration?.(() => setHydrated(true));
    return () => unsub?.();
  }, []);

  // 1) Trước khi client mount/rehydrate xong: đừng render gì
  if (!mounted || !hydrated) return null; // hoặc skeleton

  // 2) Khi đã sẵn sàng, mới quyết định
  const isAdmin = profile?.role === "admin";
  if (!isAdmin) {
    return <AccessDenied timeoutMs={3000} redirectTo="/home" />;
  }
  return <>{children}</>;
}
