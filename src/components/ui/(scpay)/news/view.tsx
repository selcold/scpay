"use client";

import React, { Suspense, useEffect, useState } from "react";
import { NewsType } from "@/utils/supabase/scpay";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
  Tab,
  Tabs,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Skeleton,
  Button,
} from "@nextui-org/react";
import { ScPayAdminProviderContent } from "@/components/admin/block";
import { NewsEditContent } from "./edit";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../../alert";
import { AlertCircle } from "lucide-react";

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
    <Card className="w-full p-5">
      <CardHeader className="flex flex-wrap justify-between items-end gap-2 w-full">
        <h1 className="font-bold text-xl sm:!text-2xl md:!text-3xl w-1/3">
          <Skeleton className="w-full h-7 sm:!h-8 md:!h-9 rounded-lg" />
        </h1>
        <div className="flex flex-col w-1/3 gap-1">
          <div className="flex justify-between items-center">
            <Skeleton className="w-full h-4 rounded-lg" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="w-full h-4 rounded-lg" />
          </div>
        </div>
      </CardHeader>
      <Divider className="my-2" />
      <CardBody>
        <Skeleton className="w-full h-36 rounded-lg" />
      </CardBody>
    </Card>
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
      if (res.ok && res.data) {
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
    if (isLoading) {
      return <NewsCardSkeleton />;
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

    if (news) {
      return (
        <Card className="p-1 sm:!p-3 md:!p-5">
          <CardHeader className="flex flex-wrap justify-between items-end gap-2">
            <h1 className="font-bold text-xl sm:!text-2xl md:!text-3xl">
              {news?.title || (
                <Skeleton className="w-full h-7 sm:!h-8 md:!h-9 rounded-lg" />
              )}
            </h1>
            <div className="flex flex-col w-auto">
              <div className="flex justify-between items-center gap-1">
                <span className="text-sm mr-auto">作成日:</span>
                <span className="text-xs">
                  {formatISODate(news?.created_at) || (
                    <Skeleton className="w-full h-4 rounded-lg" />
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm mr-auto">更新日:</span>
                <span className="text-xs">
                  {formatISODate(news?.updated_at) || (
                    <Skeleton className="w-full h-4 rounded-lg" />
                  )}
                </span>
              </div>
            </div>
          </CardHeader>
          <Divider className="my-2" />
          <CardBody>
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
                {news?.description}
              </ReactMarkdown>
            </Suspense>
          </CardBody>
        </Card>
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
    <div className="flex flex-col justify-center gap-3 w-full">
      <ScPayAdminProviderContent noAdmin={<NewsContentNow />}>
        {news ? (
          <Tabs
            aria-label="Options"
            selectedKey={selected as string | null | undefined}
            onSelectionChange={setSelected}
          >
            <Tab key="now" title="現在">
              <NewsContentNow />
            </Tab>
            <Tab key="preview" title="プレビュー">
              {newsPreview ? (
                <Card className="p-1 sm:!p-3 md:!p-5">
                  <CardHeader className="flex flex-wrap justify-between items-end gap-2">
                    <h1 className="font-bold text-xl sm:!text-2xl md:!text-3xl">
                      {newsPreview?.title}
                    </h1>
                    <div className="flex flex-col w-auto">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-sm mr-auto">作成日:</span>
                        <span className="text-xs">
                          {formatISODate(newsPreview?.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm mr-auto">更新日:</span>
                        <span className="text-xs">
                          {formatISODate(newsPreview?.updated_at)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <Divider className="my-2" />
                  <CardBody>
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
                  </CardBody>
                </Card>
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
      <div className="flex justify-center items-center">
        <Link href="/news">
          <Button>一覧を見る</Button>
        </Link>
      </div>
    </div>
  );
}

export default NewsContentView;
