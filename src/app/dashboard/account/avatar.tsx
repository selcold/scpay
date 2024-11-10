import React, { useEffect, useState } from "react";
import { User } from "@/hooks/useUser";
import { LoaderRound } from "@/components/ui/loading";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/react";

function SettingAvatar({ scpay_user }: { scpay_user: User | null }) {
  const [localUser, setLocalUser] = useState<User | null>(scpay_user);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removeding, setRemoveding] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    localUser?.profile?.image || null
  );

  useEffect(() => {
    if (localUser?.profile?.image) {
      setImagePreview(localUser.profile.image);
    }
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
    if (!image) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("userId", `${localUser?.id}`);
      formData.append("file", image);

      const res = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const response = await res.json();
        setImageError(response.message);
      }

      const { url } = await res.json();
      setImageUrl(url);

      setLocalUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          profile: { ...prevUser.profile, image: url }, // profileのimageを更新
        };
      });
    } catch (error) {
      setImageError((error as Error).message); // 型キャストしてerrorの型を解決
    }
    setUploading(false);
  };

  // 画像の削除
  const handleImageDelete = async () => {
    if (!imageUrl) return;

    setRemoveding(true);
    try {
      const REQ = {
        userId: localUser?.id,
        imageUrl: imageUrl,
      };
      const res = await fetch("/api/avatar", {
        method: "DELETE",
        body: JSON.stringify(REQ),
      });

      const response = await res.json();
      if (!res.ok) {
        setImageError(response.message);
      }

      setLocalUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          profile: { ...prevUser.profile, image: null }, // imageをnullに更新
        };
      });
    } catch (error) {
      setImageError((error as Error).message);
    }
    setRemoveding(false);
  };

  return (
    <div className="flex flex-col justify-center items-start">
      <div className="flex flex-col mb-5">
        <h1 className="font-bold text-xl md:!text-2xl">アイコン設定</h1>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-5 w-full">
        <div className="flex flex-col justify-center items-start gap-2">
          <label
            htmlFor="user-avatar"
            className="relative w-24 h-24 rounded-full group cursor-pointer"
          >
            <Avatar
              className="w-24 h-24"
              alt="Profile Preview"
              src={imagePreview || "/wp-content/avatar/guest90x90.png"}
              id={`avatar-${new Date().toISOString()}`}
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
        <div className="flex flex-wrap md:!flex-col gap-2 w-fit">
          <Button
            onClick={handleImageUpload}
            isLoading={uploading}
            color="primary"
            isDisabled={image === null}
          >
            {image ? "アイコンをアップロード" : "画像を変更してください"}
          </Button>
          {imageUrl && (
            <Button
              onClick={handleImageDelete}
              color="danger"
              isLoading={removeding}
            >
              アイコンを削除
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingAvatar;
