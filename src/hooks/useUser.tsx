"use client";

import { deleteCookie, getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  achievements?: any;
  profile: {
    image: string | null;
  };
  history?: any;
  connection?: any;
  game_data?: any;
  role?: any;
  link_scratch?: string | null;
}

interface UserContextType {
  user: User | null;
}

interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getCookie("scpay-account-token"); // クッキーからトークンを取得
    if (token) {
      fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(() => {
              deleteCookie("scpay-account-token"); // エラーの場合はクッキーを削除
            });
          }
          return res.json();
        })
        .then((data) => {
          setUser(data.user); // ユーザー情報を設定
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          router.push("/login"); // 認証エラーの場合はログインページにリダイレクト
        });
    } else {
      router.push("/login"); // トークンがない場合はログインページにリダイレクト
    }
  }, [router]); // routerを依存関係に含める

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = (): UseUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie("scpay-account-token"); // クッキーからトークンを取得
      if (!token) {
        setError("認証情報が見つかりません");
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("ユーザー情報の取得に失敗しました");
        setUser(null);
      } else {
        const data = await response.json();
        setUser(data.user);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

// const token = localStorage.getItem("scpay-account-token"); // 旧ローカルストレージからの取得
// if (token) {
//   fetch("/api/auth/me", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   .then((res) => {
//     if (!res.ok) {
//       return res.json().then(() => {
//         localStorage.removeItem("scpay-account-token"); // エラー時にローカルストレージから削除
//       });
//     }
//     return res.json();
//   })
//   .then((data) => {
//     setUser(data.user); // ユーザー情報を設定
//   })
//   .catch((error) => {
//     console.error("Error fetching user:", error);
//     router.push("/login"); // 認証エラー時にリダイレクト
//   });
// } else {
//   router.push("/login"); // トークンがなければログインページにリダイレクト
// }
