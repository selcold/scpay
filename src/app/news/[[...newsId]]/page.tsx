import Header from "@/components/nav/header";
import { NewsContentAll } from "@/components/ui/(scpay)/news/all";
import NewsContentView from "@/components/ui/(scpay)/news/view";
import { LoaderRound } from "@/components/ui/loading";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const newsId = (await params).newsId;

  if (newsId) {
    return (
      <>
        <Header />
        <div className="flex flex-col container p-2 sm:!p-4 md:!p-5">
          <div className="flex flex-col justify-center items-center w-full py-5 sm:!py-10 md:!py-20 mb-5">
            <h1 className="font-bold text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
              News
            </h1>
          </div>
          <Suspense fallback={<LoaderRound />}>
            <NewsContentView id={newsId} />
          </Suspense>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <div className="flex flex-col container p-2 sm:!p-4 md:!p-5">
          <div className="flex flex-col justify-center items-center w-full py-5 sm:!py-10 md:!py-20 mb-5">
            <h1 className="font-bold text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
              News
            </h1>
          </div>
          <Suspense fallback={<LoaderRound />}>
            <NewsContentAll />
          </Suspense>
        </div>
      </>
    );
  }
}
