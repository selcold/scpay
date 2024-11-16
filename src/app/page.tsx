import React from "react";
import Footer from "@/components/nav/footer";
import Header from "@/components/nav/header";
import TopNewsContents from "@/components/ui/(scpay)/news/topnews";

export default function Page() {
  return (
    <>
      <Header />
      <div className="w-full h-full min-h-[calc(100dvh-64px)]">
        <TopNewsContents />
      </div>
      <Footer />
    </>
  );
}
