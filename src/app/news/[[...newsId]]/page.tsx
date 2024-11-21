import { Suspense } from "react";
import Header from "@/components/nav/header";
import { NewsContentAll } from "@/components/ui/(scpay)/news/all";
import { NewsCreateButton } from "@/components/ui/(scpay)/news/create";
import NewsContentView, {
  NewsCardSkeleton,
} from "@/components/ui/(scpay)/news/view";
import { LoaderRound } from "@/components/ui/loading";
import NewsPageTitle from "./title";
import Footer from "@/components/nav/footer";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ニュース",
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const newsId = (await params).newsId;

  function PageContent() {
    if (newsId) {
      return (
        <div className="container flex flex-col items-start max-w-[1024px] px-8 mx-auto">
          <div className="w-full h-full mb-10">
            <Suspense fallback={<NewsCardSkeleton />}>
              <NewsContentView id={newsId} />
            </Suspense>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container flex flex-col items-start max-w-[1024px] px-8 mx-auto">
          <NewsPageTitle />
          <div className="flex flex-col justify-center items-center w-full mb-10">
            <NewsContentAll />
            <div className="w-full mt-5">
              <NewsCreateButton />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <Header />
      <div className="relative flex h-full min-h-dvh w-full">
        <Suspense fallback={<LoaderRound />}>
          <PageContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
