"use client";

import { useEffect } from "react";
import { ScratchAuthGET_session, useAuthSession } from "scratch-auth-react";

export function ScratchAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const auth = async () => {
      const session = await ScratchAuthGET_session();
      if (!session) {
        if (typeof window) {
          window.location.href = `/`;
        }
        return null;
      }
    };

    auth();
  }, []);

  return children;
}
