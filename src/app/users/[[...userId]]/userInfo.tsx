"use client";

import { ScPayUserType } from "@/utils/supabase/scpay";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import { Avatar } from "@nextui-org/react";
import { useEffect, useState } from "react";

export function UserInfo({ userId }: { userId: string }) {
  const [user, setUser] = useState<ScPayUserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  console.log(loading,error)

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      setError(undefined);
      const res = await reqScPayAPI({
        url: `/api/scpay/account?userId=${userId}`,
        method: "GET",
      });
      if (res.ok) {
        setUser(res.data);
      } else {
        setError(res.message || "ユーザー情報の取得に失敗しました");
      }
      setLoading(false);
    };
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div
      className="flex flex-col justify-center items-center w-full h-dvh bg-cover bg-center"
      style={{ backgroundImage: "url(https://i.imgur.com/Qollom8.png)" }}
    >
      <div className="flex flex-col justify-center items-center w-fit max-w-full h-auto bg-white/40 dark:bg-black/40 shadow backdrop-blur p-5 sm:!p-7 md:!p-10 rounded-large">
        <div className="flex flex-col justify-center items-center mb-7">
          <Avatar
            src={`${user.profile?.image}`}
            alt={user.username}
            className="w-28 h-auto"
          />
          <p className="mt-3 text-sm">@{user.user_id}</p>
        </div>
        <div className="">
          <h1 className="font-bold text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl">
            {user.username}
          </h1>
        </div>
      </div>
    </div>
  );
}
