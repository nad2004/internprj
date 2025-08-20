"use client";

import { ReactNode } from "react";
import AccessDenied from "@/components/AccessDeniedTemplate";
import { useUserStore, UserState } from '@/store/userStore';

export default function AdminGate({ children }: { children: ReactNode }) {
    const profile = useUserStore((u) => (u as UserState).profile);

  const isAdmin = profile?.role === "admin"; 
  if (!isAdmin) {
    return <AccessDenied timeoutMs={3000} redirectTo="/home" />;
  }
  return <>{children}</>;
}
