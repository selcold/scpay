"use client";

import React, { useEffect, useState } from "react";
import { NewsType } from "@/utils/supabase/scpay";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Skeleton } from "@nextui-org/react";
import { NewsCreateButton } from "./create";
import { Alert, AlertDescription, AlertTitle } from "../../alert";
import { AlertCircle } from "lucide-react";

function TopNewsContents() {
  const [topnews, setTopnews] = useState<NewsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getAPI = async () => {
      setIsLoading(true);
      setError(undefined);
      const res = await reqScPayAPI({
        url: "/api/scpay/news?limit=5",
        method: "GET",
      });
      if (res.ok && res.data) {
        setTopnews(res.data);
      } else {
        toast.error(res.message || "ニュースの取得に失敗しました");
        setError(res.message || "ニュースの取得に失敗しました");
      }
      setIsLoading(false);
    };
    getAPI();
  }, []);

  function formatISODate(isoString: any) {
    // ISO文字列をDateオブジェクトに変換
    const date = new Date(isoString);
    // 各要素を抽出
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月は0始まりなので+1
    const day = String(date.getDate()).padStart(2, "0");
    // const hours = String(date.getHours()).padStart(2, "0");
    // const minutes = String(date.getMinutes()).padStart(2, "0");
    // const seconds = String(date.getSeconds()).padStart(2, "0");
    // // フォーマットを適用
    // return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    return `${year}.${month}.${day}`;
  }

  function NewsContents() {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center gap-2 w-full max-w-xl bg-neutral-900 rounded-lg p-5">
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    if (topnews.length > 0) {
      return (
        <div className="flex flex-col justify-center items-center gap-2 w-full bg-neutral-50 dark:bg-neutral-950 rounded-lg p-2 border border-neutral-100 dark:border-neutral-900 shadow">
          {topnews?.map((item, index) => {
            return (
              <Link
                key={index}
                href={`/news/${item.id}`}
                className="flex flex-wrap justify-start items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-in-out"
              >
                <h2 className="text-sm mr-5">{`${formatISODate(
                  item.created_at
                )}`}</h2>
                <h1 className="font-bold text-sm md:!text-base">
                  {item.title}
                </h1>
              </Link>
            );
          })}
          <Link href="/news" className="w-full">
            <Button className="w-full">もっと見る</Button>
          </Link>
        </div>
      );
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>データ取得</AlertTitle>
        <AlertDescription>
          ニュースが存在しないまたは取得できませんでした。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 container max-w-xl p-5">
      <NewsContents />
    </div>
  );
}

export default TopNewsContents;
