"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion, useInView } from "motion/react";
import { Skeleton } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { NewsType } from "@/utils/supabase/scpay";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import { Alert, AlertDescription, AlertTitle } from "../../alert";
import { CustomCardHeader } from "@/app/dashboard/account/(components)/customCard";

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

function NewsContentCard({ item }: { item: NewsType }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.a
      href={`/news/${item.id}`}
      ref={ref}
      style={{
        filter: isInView ? "blur(0px)" : "blur(10px)",
        transform: isInView ? "none" : "translateY(100px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
      }}
      className="mb-2"
    >
      <div className="flex flex-wrap justify-start items-center gap-2 w-full px-3 py-2 text-foreground box-border outline-none shadow-medium rounded-large backdrop-blur-md backdrop-saturate-150 transition-transform-background motion-reduce:transition-none bg-background/60 p-3 dark:bg-default-100/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50">
        <h2 className="text-sm mr-5">{`${formatISODate(item.created_at)}`}</h2>
        <h1 className="font-bold text-sm md:!text-base">{item.title}</h1>
      </div>
    </motion.a>
  );
}

function TopNewsContents() {
  const [topnews, setTopnews] = useState<NewsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const ref2 = useRef(null);
  const isInView2 = useInView(ref2, { once: true });

  useEffect(() => {
    const getAPI = async () => {
      setIsLoading(true);
      setError(undefined);
      const res = await reqScPayAPI({
        url: "/api/scpay/news?limit=5",
        method: "GET",
      });
      if (res.ok) {
        setTopnews(res.data);
      } else {
        toast.error(res.message || "ニュースの取得に失敗しました");
        setError(res.message || "ニュースの取得に失敗しました");
      }
      setIsLoading(false);
    };
    getAPI();
  }, []);

  function NewsContents() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    if (isLoading) {
      return (
        <div className="flex flex-col gap-2 relative w-full h-auto">
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
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

    if ((topnews.length === 0)) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>データ取得</AlertTitle>
          <AlertDescription>ニュースが存在しません</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="flex flex-col relative w-full h-auto">
        {topnews?.map((item, index) => {
          return <NewsContentCard key={index} item={item} />;
        })}
        <motion.a
          ref={ref}
          style={{
            filter: isInView ? "blur(0px)" : "blur(10px)",
            transform: isInView ? "none" : "translateY(100px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
          }}
          href="/news"
          className="w-full"
        >
          <Button className="w-full">もっと見る</Button>
        </motion.a>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-start max-w-[1024px] px-8 mx-auto mb-20">
      <CustomCardHeader className="w-full text-center mb-10">
        <motion.h1
          ref={ref}
          style={{
            filter: isInView ? "blur(0px)" : "blur(10px)",
            transform: isInView ? "none" : "translateY(100px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
          }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#00000066] dark:from-[#FFFFFF] dark:to-[#FFFFFF66] font-bold text-xl sm:!text-3xl md:!text-4xl mb-3"
        >
          最新のニュース
        </motion.h1>
        <motion.p
          ref={ref2}
          style={{
            filter: isInView2 ? "blur(0px)" : "blur(10px)",
            transform: isInView2 ? "none" : "translateY(100px)",
            opacity: isInView2 ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
          }}
          className="text-sm text-foreground-500"
        >
          当サービスのニュースはすべての利用者が無料で見ることができます。
        </motion.p>
      </CustomCardHeader>
      <NewsContents />
    </div>
  );
}

export default TopNewsContents;
