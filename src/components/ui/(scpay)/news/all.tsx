"use client";

import { NewsType } from "@/utils/supabase/scpay";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import {
  Card,
  CardHeader,
  Pagination,
  Skeleton,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { motion, useInView } from "motion/react";
import { Alert, AlertDescription, AlertTitle } from "../../alert";

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

function NewsCardContent({ item }: { item: NewsType }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.a
      id={`news-${item.id}`}
      href={`/news/${item.id}`}
      ref={ref}
      style={{
        filter: isInView ? "blur(0px)" : "blur(10px)",
        transform: isInView ? "none" : "translateY(100px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
      }}
    >
      <Card>
        <CardHeader className="flex flex-wrap justify-start items-center gap-2">
          <div className="flex flex-col w-auto mr-5">
            <span className="text-base">
              {formatISODate(item.created_at) || (
                <Skeleton className="w-full h-4 rounded-lg" />
              )}
            </span>
          </div>
          <h1 className="font-bold text-xl sm:!text-2xl">
            {item.title || (
              <Skeleton className="w-full h-7 sm:!h-8 md:!h-9 rounded-lg" />
            )}
          </h1>
        </CardHeader>
      </Card>
    </motion.a>
  );
}

export function NewsContentAll() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [news, setNews] = useState<NewsType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | undefined>(undefined);

  const itemsPerPage = 10;

  const onScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const getNewsCount = async () => {
      setIsLoading(true);
      setError(undefined);
      const res = await reqScPayAPI({
        url: "/api/scpay/news/count",
        method: "GET",
      });
      if (res.ok) {
        setTotal(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    };
    getNewsCount();
  }, []);

  useEffect(() => {
    const getNewsContent = async () => {
      setIsLoading(true);
      setError(undefined);
      onScrollToTop();
      const res = await reqScPayAPI({
        url: `/api/scpay/news?limit=${itemsPerPage}&offset=${
          (currentPage - 1) * itemsPerPage
        }`,
        method: "GET",
      });
      if (res.ok) {
        setNews(res.data);
      } else {
        console.error(res.error, res.error_message);
        setError(res?.message);
      }
      setIsLoading(false);
    };
    getNewsContent();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function NewsSkeleton() {
    return (
      <>
        <Skeleton className="w-full h-16 rounded-lg" />
        <Skeleton className="w-full h-16 rounded-lg" />
        <Skeleton className="w-full h-16 rounded-lg" />
        <Skeleton className="w-full h-16 rounded-lg" />
        <Skeleton className="w-full h-16 rounded-lg" />
        <Skeleton className="w-full h-16 rounded-lg" />
        <Skeleton className="w-full h-16 rounded-lg" />
      </>
    );
  }

  function NewsPagination() {
    const PageTotal =
      Math.ceil(total / itemsPerPage) > 0 ? Math.ceil(total / itemsPerPage) : 1;
    return (
      <>
        <Pagination
          key="xs"
          className="block sm:!hidden"
          isCompact
          loop
          showControls
          showShadow
          total={PageTotal}
          page={currentPage}
          initialPage={1}
          siblings={0}
          onChange={handlePageChange}
        />
        <Pagination
          key="sm"
          className="hidden sm:!block md:!hidden"
          isCompact
          loop
          showControls
          showShadow
          total={PageTotal}
          page={currentPage}
          initialPage={1}
          siblings={1}
          onChange={handlePageChange}
        />
        <Pagination
          key="md"
          className="hidden md:!block lg:!hidden"
          isCompact
          loop
          showControls
          showShadow
          total={PageTotal}
          page={currentPage}
          initialPage={1}
          siblings={2}
          onChange={handlePageChange}
        />
        <Pagination
          key="lg"
          className="hidden lg:!block"
          isCompact
          loop
          showControls
          showShadow
          total={PageTotal}
          page={currentPage}
          initialPage={1}
          siblings={3}
          onChange={handlePageChange}
        />
      </>
    );
  }

  function NewsContent() {
    if (isLoading) {
      return <NewsSkeleton />;
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

    if (news.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>データ取得</AlertTitle>
          <AlertDescription>ニュースが存在しません</AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        {news.map((item, index) => {
          return <NewsCardContent key={index} item={item} />;
        })}
      </>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
      <div className="flex flex-col justify-start items-center gap-3 w-full h-full">
        <section
          id="news"
          className="flex flex-col justify-center items-stretch gap-3 w-full max-w-2xl"
        >
          <NewsContent />
        </section>
        <div className="flex flex-col justify-center items-center w-full">
          {news.length > 0 && <NewsPagination />}
        </div>
      </div>
    </div>
  );
}
