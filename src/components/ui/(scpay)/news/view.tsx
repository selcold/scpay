"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import remarkGfm from "remark-gfm";
import { AlertCircle } from "lucide-react";
import { Tab, Tabs, Skeleton, Button } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";
import { NewsType } from "@/utils/supabase/scpay";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import { ScPayAdminProviderContent } from "@/components/admin/block";
import { NewsEditContent } from "./edit";
import { Alert, AlertDescription, AlertTitle } from "../../alert";

export function formatISODate(isoString: any) {
  // ISO文字列をDateオブジェクトに変換
  const date = new Date(isoString);
  // 各要素を抽出
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月は0始まりなので+1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export function NewsCardSkeleton() {
  return (
    <div className="w-full p-5">
      <div className="flex flex-col justify-center items-center w-full py-5 sm:!py-10 md:!py-20 mb-5">
        <Skeleton className="w-full h-7 sm:!h-8 md:!h-9 lg:!h-10 rounded-lg mb-3" />
        <Skeleton className="w-full h-4 rounded-lg" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full h-6 rounded-lg" />
        <Skeleton className="w-2/3 h-6 rounded-lg" />
        <Skeleton className="w-1/3 h-6 rounded-lg" />
      </div>
    </div>
  );
}

function NewsContentView({ id }: { id: string }) {
  const [news, setNews] = useState<null | NewsType>(null);
  const [newsPreview, setNewsPreview] = useState<null | NewsType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();

  const getSelectTab = searchParams.get("tab");
  const [selected, setSelected] = React.useState<React.Key>(
    getSelectTab || "now"
  );

  useEffect(() => {
    const getAPI = async () => {
      setIsLoading(true);
      setError(undefined);
      const res = await reqScPayAPI({
        url: `/api/scpay/news?id=${id}`,
        method: "GET",
      });
      if (res.ok) {
        setNews(res.data);
        setNewsPreview(res.data);
      } else {
        toast.error(res.message || "ニュースの取得に失敗しました");
        setError(res.message || "ニュースの取得に失敗しました");
      }
      setIsLoading(false);
    };
    getAPI();
  }, []);

  function NewsContentNow() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const ref2 = useRef(null);
    const isInView2 = useInView(ref2, { once: true });

    if (isLoading) {
      return <NewsCardSkeleton />;
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <motion.h1
            ref={ref}
            style={{
              filter: isInView ? "blur(0px)" : "blur(10px)",
              transform: isInView ? "none" : "translateY(100px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
            }}
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#00000066] dark:from-[#FFFFFF] dark:to-[#FFFFFF66] font-bold text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl mb-3"
          >
            ニュース
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
            あなたがアクセスしようとしたニュースは削除された、または非公開になっている可能性があります。
          </motion.p>
        <Alert variant="destructive" className="mt-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        </div>
      );
    }

    if (news) {
      return (
        <>
          <div className="flex flex-col justify-center items-center w-full py-5 sm:!py-10 md:!py-20 mb-5">
            <motion.h1
              ref={ref}
              style={{
                filter: isInView ? "blur(0px)" : "blur(10px)",
                transform: isInView ? "none" : "translateY(100px)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
              }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#00000066] dark:from-[#FFFFFF] dark:to-[#FFFFFF66] font-bold text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl mb-3"
            >
              {news.title}
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
              {formatISODate(news?.created_at) || (
                <Skeleton className="w-full h-4 rounded-lg" />
              )}
            </motion.p>
          </div>
          <Suspense fallback={<Skeleton className="w-full h-16 rounded-lg" />}>
            <ReactMarkdown
              className="markdown-body"
              remarkPlugins={[remarkGfm]}
              components={{
                a(props) {
                  const { children, href } = props;
                  return (
                    <Link href={href || "/"} target="_blank">
                      {children}
                    </Link>
                  );
                },
              }}
            >
              {news?.description}
            </ReactMarkdown>
          </Suspense>
        </>
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
    <div className="flex flex-col justify-start gap-3 w-full h-full">
      <ScPayAdminProviderContent noAdmin={<NewsContentNow />}>
        {news ? (
          <Tabs
            aria-label="Options"
            selectedKey={selected as string | null | undefined}
            onSelectionChange={setSelected}
            variant="light"
          >
            <Tab key="now" title="現在">
              <NewsContentNow />
            </Tab>
            <Tab key="preview" title="プレビュー">
              {newsPreview ? (
                <>
                  <div className="flex flex-col justify-center items-center w-full py-5 sm:!py-10 md:!py-20 mb-5">
                    <motion.h1 className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#00000066] dark:from-[#FFFFFF] dark:to-[#FFFFFF66] font-bold text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl mb-3">
                      {newsPreview.title}
                    </motion.h1>
                    <motion.p className="text-sm text-foreground-500">
                      {formatISODate(newsPreview?.created_at) || (
                        <Skeleton className="w-full h-4 rounded-lg" />
                      )}
                    </motion.p>
                  </div>
                  <Suspense
                    fallback={<Skeleton className="w-full h-16 rounded-lg" />}
                  >
                    <ReactMarkdown
                      className="markdown-body"
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a(props) {
                          const { children, href } = props;
                          return (
                            <Link href={href || "/"} target="_blank">
                              {children}
                            </Link>
                          );
                        },
                      }}
                    >
                      {newsPreview?.description}
                    </ReactMarkdown>
                  </Suspense>
                </>
              ) : (
                <NewsCardSkeleton />
              )}
            </Tab>
            <Tab key="edit" title="編集">
              <NewsEditContent
                news={news}
                newsPreview={newsPreview}
                setNewsPreview={setNewsPreview}
              />
            </Tab>
          </Tabs>
        ) : (
          <NewsContentNow />
        )}
      </ScPayAdminProviderContent>
      <div className="flex justify-center items-center mt-20">
        <Link href="/news">
          <Button>一覧を見る</Button>
        </Link>
      </div>
    </div>
  );
}

export default NewsContentView;
