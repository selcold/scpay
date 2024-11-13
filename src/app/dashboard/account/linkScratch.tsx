"use client";

import React, { useState } from "react";
import {
  LogInButton,
  LogIned,
  LogOuted,
  ScratchAuthLogin,
  UserButton,
  useUser,
} from "@scratch-auth/nextjs";
import { eventDispatch } from "@scratch-auth/nextjs/src/cookie/dispatchEvent";
import { ScPayAccountSET } from "@/components/scpay/set";
import { User } from "@/hooks/useUser";
import { Button } from "@nextui-org/react";
import { setCookie } from "cookies-next/client";

function LinkScratch({ scpay_user }: { scpay_user: User | null }) {
  const [localUser, setLocalUser] = useState<User | null>(scpay_user);
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);

  const onScratchAuthLogin = async () => {
    setCookie("scratch-auth-redirect", "/dashboard/account");
    // localStorage.setItem("scratch-auth-redirect", "/dashboard/account");
    const success = await ScratchAuthLogin(); // ログイン処理を実行
    if (!success) {
      eventDispatch(new Event("sah-sessionchange"));
    }
  };

  async function handleUpdateLinkScratch() {
    if (localUser && user) {
      setLoading(true);
      const result = await ScPayAccountSET(
        localUser.id,
        "link_scratch",
        user.username
      );
      if (result.success) {
        console.log("データの更新が成功:", result.message);
        setLocalUser({ ...localUser, link_scratch: user.username }); // 状態を更新
      } else {
        console.error("データの更新に失敗:", result.message, result.error);
      }
      setLoading(false);
    }
  }

  async function handleUpdateUnLinkScratch() {
    if (localUser && user) {
      setLoading(true);
      const result = await ScPayAccountSET(localUser.id, "link_scratch", null);
      if (result.success) {
        console.log("データの更新が成功:", result.message);
        setLocalUser({ ...localUser, link_scratch: null }); // 状態を更新
      } else {
        console.error("データの更新に失敗:", result.message, result.error);
      }
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-start">
      <div className="flex flex-col mb-5">
        <h1 className="font-bold text-xl md:!text-2xl">
          Scratchアカウントを紐付ける
        </h1>
        <p className="text-sm">
          ScPayアカウントとScratchアカウントを紐付ける。この機能を利用するとプロフィール情報やゲームの進捗状況や通貨を統合することが可能になります。
        </p>
      </div>
      <div className="flex flex-wrap justify-start items-center gap-3">
        {localUser?.link_scratch ? (
          <>
            <LogIned>
              <UserButton />
            </LogIned>
            <Button
              onClick={handleUpdateUnLinkScratch}
              color="danger"
              isLoading={loading}
            >
              連携を解除する
            </Button>
          </>
        ) : (
          <>
            <LogOuted>
              <Button
                onClick={onScratchAuthLogin}
                color="primary"
                isLoading={loading || userLoading}
              >
                ログインして連携する
              </Button>
            </LogOuted>
            <LogIned>
              <Button
                onClick={handleUpdateLinkScratch}
                color="primary"
                isLoading={loading} // ローディング中はボタンを無効化
              >
                アカウントを接続する
              </Button>
            </LogIned>
          </>
        )}
      </div>
    </div>
  );
}

export default LinkScratch;
