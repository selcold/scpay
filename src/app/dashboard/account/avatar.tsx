"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/react";
import { ScPayUserType } from "@/utils/supabase/scpay";
import ScPayUser from "./scpayUser";
import toast from "react-hot-toast";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";

function SettingAvatar() {
  const { scpayUser, scpayUser_loading } = ScPayUser();
  const [localUser, setLocalUser] = useState<ScPayUserType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removeding, setRemoveding] = useState(false);

  // ユーザー情報が変更されたときに localUser を更新
  useEffect(() => {
    if (!scpayUser_loading) {
      setLocalUser(scpayUser);
      setImagePreview(scpayUser?.profile?.image || null); // プロフィール画像の更新
    }
  }, [scpayUser, scpayUser_loading]);

  useEffect(() => {
    setImagePreview(localUser?.profile?.image || null);
  }, [localUser]);

  // 画像のプレビューとサイズチェック
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 512 * 1024) {
        setImageError("画像のサイズは512KB以下にしてください。");
        return;
      }

      setImageError(null);
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 画像のアップロード
  const handleImageUpload = async () => {
    if (!image || !localUser) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("userId", `${localUser.id}`);
      formData.append("file", image);

      const res = await reqScPayAPI({
        url: "/api/scpay/avatar",
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("アバターをアップロードしました");
        setImagePreview(res.data);
        setLocalUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            profile: { ...prevUser.profile, image: res.data }, // profileのimageを更新
          };
        });
      } else {
        toast.error("アバターの更新に失敗しました");
        setImageError(res.error_message || "アバターの更新に失敗しました");
      }
    } catch (error) {
      toast.error("エラーが発生しました");
      setImageError((error as Error).message); // 型キャストしてerrorの型を解決
    }
    setUploading(false);
  };

  // 画像の削除
  const handleImageDelete = async () => {
    if (!localUser?.profile?.image) return;

    setRemoveding(true);
    try {
      const REQ = {
        userId: localUser.id,
        imageUrl: localUser.profile.image,
      };
      const res = await reqScPayAPI({
        url: "/api/scpay/avatar",
        method: "DELETE",
        body: JSON.stringify(REQ),
      });
      if (res.ok) {
        toast.success("アバターを削除しました");
        setLocalUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            profile: { ...prevUser.profile, image: null }, // imageをnullに更新
          };
        });
      } else {
        toast.error("アバターの削除に失敗しました");
        setImageError(res.error_message || "アバターの削除に失敗しました");
      }
    } catch (error) {
      toast.error("エラーが発生しました");
      setImageError((error as Error).message);
    }
    setRemoveding(false);
  };

  return (
    <div className="flex flex-col justify-start items-start w-full">
      <div className="flex flex-col mb-5 w-full">
        <h1 className="font-bold text-xl md:!text-2xl">アイコン設定</h1>
        <p className="text-sm">
          アップロード後反映に時間がかかることがあります
        </p>
      </div>
      <div className="flex flex-col sm:!flex-row justify-between items-start w-full">
        <div className="flex flex-col mb-5 w-full sm:!w-1/2">
          <label
            htmlFor="user-avatar"
            className="relative w-24 h-24 rounded-full group cursor-pointer"
          >
            <Avatar
              className="w-24 h-24 border border-neutral-300 dark:border-neutral-800 shadow"
              alt="Profile Preview"
              src={imagePreview || "/wp-content/avatar/guest90x90.png"}
            />
            <div className="absolute inset-0 rounded-full bg-neutral-500/80 backdrop-blur-sm opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 flex items-center justify-center">
              <span className="text-white">変更</span>
            </div>
            <input
              id="user-avatar"
              name="user-avatar"
              type="file"
              accept="image/png,image/webp,image/jpeg"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
          {imageError && <p className="text-red-500">{imageError}</p>}
        </div>
        <div className="flex flex-col justify-end items-stretch gap-3 w-fit max-w-full sm:!max-w-1/2 ml-auto">
          <Button
            onClick={handleImageUpload}
            isLoading={uploading}
            color="primary"
            isDisabled={image === null}
          >
            {image ? "アイコンをアップロード" : "画像を変更してください"}
          </Button>
          <Button
            onClick={handleImageDelete}
            color="danger"
            isLoading={removeding}
            isDisabled={uploading}
          >
            アイコンを削除
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingAvatar;
