"use client";

import { deleteCookie } from "cookies-next/client";

export const ScPayAccountLogout = () => {
  deleteCookie("scpay-account-token");
  if (typeof window !== undefined) {
    window.location.reload();
  }
};
