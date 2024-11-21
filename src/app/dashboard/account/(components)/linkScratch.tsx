"use client";

import React, { useEffect, useState } from "react";
import {
  LogIned,
  LogOuted,
  ScratchAuthLogin,
  UserButton,
  useUser,
} from "@scratch-auth/nextjs";
import { eventDispatch } from "@scratch-auth/nextjs/src/cookie/dispatchEvent";
import { Button } from "@nextui-org/react";
import { setCookie } from "cookies-next/client";
import { ScPayUserType } from "@/utils/supabase/scpay";
import ScPayUser from "./scpayUser";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import toast from "react-hot-toast";
import {
  CustomCard,
  CustomCardBody,
  CustomCardDescription,
  CustomCardHeader,
  CustomCardTitle,
} from "./customCard";

function LinkScratch() {
  const { scpayUser, scpayUser_loading } = ScPayUser();
  const [localUser, setLocalUser] = useState<ScPayUserType | null>(null);
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState<React.ReactNode | null>(null); // ボタンの状態を管理

  // 認証が成功した場合にリダイレクト
  const onScratchAuthLogin = async () => {
    setCookie("scratch-auth-redirect", "/dashboard/account");
    const success = await ScratchAuthLogin();
    if (!success) eventDispatch(new Event("sah-sessionchange"));
  };

  // スクラッチアカウントの連携・解除処理
  const handleLinkUnlinkScratch = async (link: string | null) => {
    if (localUser) {
      setLoading(true);
      const res = await reqScPayAPI({
        url: "/api/scpay/account/set",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localUser.id,
          item: "scratch",
          data: link,
        }),
      });
      if (res.ok) {
        setLocalUser({ ...localUser, scratch: link });
        console.log(link ? "連携成功" : "連携解除成功", res.message);
        toast.success(
          link ? "アカウント連携に成功しました" : "アカウント連携を解除しました"
        );
      } else {
        console.error("処理失敗", res.message, res.error_message);
        toast.error(
          res.error_message || link
            ? "アカウント連携に失敗しました"
            : "アカウント連携解除に失敗しました"
        );
      }
      setLoading(false);
    }
  };

  // ローディング中かつ`localUser`がある場合、更新が完了するまでボタンを無効化
  const renderButton = () => {
    if (scpayUser_loading || userLoading) {
      return (
        <Button color="primary" isLoading>
          読み込み中
        </Button>
      );
    }

    if (!localUser) {
      return (
        <Button onClick={() => window.location.reload()} color="danger">
          アカウント情報が取得出来ませんでした
        </Button>
      );
    }

    if (localUser?.scratch) {
      return (
        <>
          <LogIned>
            <UserButton />
          </LogIned>
          <Button
            onClick={() => handleLinkUnlinkScratch(null)}
            color="danger"
            isLoading={loading}
          >
            連携解除
          </Button>
        </>
      );
    }

    return (
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
          {user && (
            <>
              <UserButton />
              <Button
                onClick={() => handleLinkUnlinkScratch(user.username)}
                color="primary"
                isLoading={loading}
              >
                アカウントを接続する
              </Button>
            </>
          )}
        </LogIned>
      </>
    );
  };

  useEffect(() => {
    if (!scpayUser_loading) {
      setLocalUser(scpayUser);
    }
  }, [scpayUser, scpayUser_loading]);

  useEffect(() => {
    // localUser または user が変更された時にボタンを更新
    setButton(renderButton());
  }, [localUser, user, scpayUser, scpayUser_loading, loading, userLoading]); // 必要な依存関係を追加

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Scratchアカウントを紐付ける</CustomCardTitle>
        <CustomCardDescription>
          ScPayアカウントとScratchアカウントを紐付ける。この機能を利用するとプロフィール情報やゲームの進捗状況や通貨を統合することが可能になります。
        </CustomCardDescription>
      </CustomCardHeader>
      <CustomCardBody className="gap-2">{button}</CustomCardBody>
    </CustomCard>
  );
}

export default LinkScratch;
