/*
 * page.tsx
 * このファイルは、認証ページのコンポーネントです。
 * リダイレクトURLからprivateCodeを取得し、認証処理を行います。
 */

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ScratchAuthSET_session } from "scratch-auth-react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const privateCode = searchParams.get("privateCode");

  useEffect(() => {
    async function auth() {
      if (privateCode) {
        await ScratchAuthSET_session(privateCode); // アカウント認証

        window.location.href = "/";
      } else {
        window.location.href = "/";
      }
    }
    auth();
  }, [privateCode]);

  return (
    <html>
      <body>
        <span>処理中...</span>
      </body>
    </html>
  );
}
