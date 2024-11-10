"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const password = process.env.NEXT_PUBLIC_SITE_PASSWORD;
    if (inputPassword === password) {
      document.cookie = `auth-token=true; max-age=${10 * 24 * 60 * 60}; path=/`; // 10日間のクッキーを設定
      router.push("/"); // 認証後、トップページにリダイレクト
    } else {
      setError("パスワードが間違っています");
    }
  };

  return (
    <div>
      <h1>パスワード認証</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="パスワードを入力してください"
          required
        />
        <button type="submit">認証</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
