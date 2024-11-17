import Header from "@/components/nav/header";
import { NewsContentAll } from "@/components/ui/(scpay)/news/all";
import { NewsCreateButton } from "@/components/ui/(scpay)/news/create";
import NewsContentView from "@/components/ui/(scpay)/news/view";
import { LoaderRound } from "@/components/ui/loading";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const newsId = (await params).newsId;

  function PageContent() {
    if (newsId) {
      return (
        <div className="w-full mb-10">
          <NewsContentView id={newsId} />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col justify-center items-center w-full mb-10">
          <NewsContentAll />
          <div className="w-full mt-5">
            <NewsCreateButton />
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <Header />
      <div className="relative flex h-full min-h-dvh w-full">
        <div className="container flex flex-col items-start max-w-[1024px] px-8 mx-auto">
          <div className="flex flex-col justify-center items-center w-full py-5 sm:!py-10 md:!py-20 mb-5">
            <h1 className="font-bold text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
              News
            </h1>
          </div>
          <Suspense fallback={<LoaderRound />}>
            <PageContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
