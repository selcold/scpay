"use client";

import { LoaderRound } from "@/components/ui/loading";
import { ScPayUserType } from "@/utils/supabase/scpay";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState, ReactNode } from "react";

interface UserContextType {
  user: ScPayUserType | null;
}

interface UseUserResult {
  user: ScPayUserType | null;
  loading: boolean;
  error: string | null;
}

export const useScPayUser = (): UseUserResult => {
  const [user, setUser] = useState<ScPayUserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie("scpay-account-token"); // クッキーからトークンを取得
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/scpay/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      if (res.ok && res.data) {
        setUser(res.data);
      } else {
        setError("ユーザー情報の取得に失敗しました");
        console.log(res.message);
        setUser(null);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

const UserContext = createContext<UserContextType | undefined>(undefined);
export const ScPayUserProvider = ({
  children,
  Loading: LoadingComponent,
  Error: ErrorComponent,
  noLogin,
}: {
  children: ReactNode;
  Loading?: React.ElementType;
  Error?: React.ElementType;
  noLogin?: string | React.ElementType;
}) => {
  const router = useRouter();
  const { user, loading, error } = useScPayUser();

  // ログインしていないユーザーのリダイレクト処理を useEffect で管理
  useEffect(() => {
    if (!loading && !user) {
      if (typeof noLogin === "string") {
        router.push(noLogin);
      } else {
        router.push("/login");
      }
    }
  }, [loading, user, noLogin, router]);

  if (loading) {
    return LoadingComponent ? <LoadingComponent /> : <LoaderRound />;
  }

  if (error) {
    console.warn(error);
    return ErrorComponent ? (
      <ErrorComponent />
    ) : (
      <div className="flex justify-center items-center w-full h-full">
        エラーが発生しました
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

const ScPayAdminProviderUserContext = createContext<
  UserContextType | undefined
>(undefined);
export const ScPayAdminProvider = ({
  children,
  Loading: LoadingComponent,
  Error: ErrorComponent,
  noAdmin,
}: {
  children: ReactNode;
  Loading?: React.ElementType;
  Error?: React.ElementType;
  noAdmin?: string | React.ElementType;
}) => {
  const router = useRouter();
  const { user, loading, error } = useScPayUser();

  // ログインしていないユーザーのリダイレクト処理を useEffect で管理
  useEffect(() => {
    if (!loading) {
      if (!user || !user.admin) {
        if (typeof noAdmin === "string") {
          router.push(noAdmin);
        } else {
          router.push("/login");
        }
      }
    }
  }, [loading, user, noAdmin, router]);

  if (loading) {
    return LoadingComponent ? <LoadingComponent /> : <LoaderRound />;
  }

  if (error) {
    console.warn(error);
    return ErrorComponent ? (
      <ErrorComponent />
    ) : (
      <div className="flex justify-center items-center w-full h-full">
        エラーが発生しました
      </div>
    );
  }

  if (!user?.admin) {
    return null;
  }

  return (
    <ScPayAdminProviderUserContext.Provider value={{ user }}>
      {children}
    </ScPayAdminProviderUserContext.Provider>
  );
};
