"use client";

import { useScPayUser } from "@/hooks/useScPayUser";

function ScPayUser() {
  const { user, loading } = useScPayUser();
  return { scpayUser: user, scpayUser_loading: loading };
}

export default ScPayUser;
