"use client";

import React, { useState } from "react";
import { NewsType } from "@/utils/supabase/scpay";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import { NewsCardSkeleton } from "./view";
import { useRouter } from "next/navigation";

export function NewsEditContent({
  news,
  newsPreview,
  setNewsPreview,
}: {
  news: NewsType | null;
  newsPreview: NewsType | null;
  setNewsPreview: React.Dispatch<React.SetStateAction<NewsType | null>>;
}) {
  const router = useRouter();
  const [submitType, setSubmitType] = useState<
    "PREVIEW" | "PATCH" | "DELETE" | null
  >(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = z.object({
    title: z.string(),
    description: z.string(),
  });
  // useForm を使ってバリデーションと入力管理を実装
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setFormLoading(true);
    setError(null);
    if (submitType === "PREVIEW") {
      setNewsPreview((prev: any) => ({
        ...prev,
        title: data.title,
        description: data.description,
      }));
      toast.success("プレビューを更新しました");
    } else {
      if (submitType === "DELETE") {
        const response = await reqScPayAPI({
          url: "/api/scpay/news",
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: news?.id,
          }),
        });
        if (response.ok) {
          console.log("ニュースを削除しました");
          toast.success(response.message || "ニュースを削除しました");
          router.push("/news");
        } else {
          console.warn("作成エラー:", response.message, response.error);
          setError(response.message || "ニュースの削除に失敗しました");
        }
      } else {
        const response = await reqScPayAPI({
          url: "/api/scpay/news",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: news?.id,
            title: data.title,
            description: data.description,
          }),
        });
        if (response.ok) {
          console.log("ニュースを更新しました");
          toast.success(response.message || "ニュースを更新しました");
        } else {
          console.warn("作成エラー:", response.message, response.error);
          setError(response.message || "ニュースの更新に失敗しました");
        }
      }
    }
    setFormLoading(false);
  };

  if (!news || !newsPreview || !setNewsPreview) {
    return <NewsCardSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <Card className="p-1 sm:!p-3 md:!p-5">
        <CardHeader className="flex flex-wrap justify-between items-end gap-2">
          <Input
            {...register("title")}
            label="Title"
            placeholder={news?.title}
            defaultValue={newsPreview?.title}
            variant="bordered"
            color={errors.title ? "danger" : "success"}
            isInvalid={errors.title ? true : false}
            errorMessage={errors.title?.message as string | undefined}
          />
        </CardHeader>
        <CardBody>
          <Textarea
            {...register("description")}
            defaultValue={newsPreview?.description}
            disableAnimation
            disableAutosize
            variant="bordered"
            color={errors.description ? "danger" : "success"}
            isInvalid={errors.description ? true : false}
            errorMessage={errors.description?.message as string | undefined}
            classNames={{
              base: "w-full",
              input: "resize-y min-h-[300px]",
            }}
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </CardBody>
        <CardFooter className="flex flex-wrap gap-2">
          <Button
            type="submit"
            isLoading={formLoading}
            onClick={() => setSubmitType("PREVIEW")}
          >
            プレビューを更新する
          </Button>
          <Button
            type="submit"
            isLoading={formLoading}
            onClick={() => setSubmitType("PATCH")}
          >
            変更を保存する
          </Button>
          <Button
            type="submit"
            isLoading={formLoading}
            onClick={() => setSubmitType("DELETE")}
            color="danger"
          >
            削除する
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
