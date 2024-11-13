"use client";

import { useRouter } from "next/navigation";

export function useScPayAccountLogOut() {
  const router = useRouter();
  
  return () => {
    localStorage.removeItem("scpay-account-token");
    router.refresh(); // ページをリフレッシュ
  };
}