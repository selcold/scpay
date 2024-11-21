"use server";

import React from "react";
import Footer from "@/components/nav/footer";
import Header from "@/components/nav/header";
import TopNewsContents from "@/components/ui/(scpay)/news/topnews";
import { HeroTopTitle } from "@/components/pages/hero/topTitle";
import HeroTopImage from "@/components/pages/hero/topImage";
import HeroTopGradient from "@/components/pages/hero/topGradient";
import HeroPricingContent from "@/components/pages/hero/pricing";
import HeroTeamMembersContent from "@/components/pages/hero/teamMembers";
import { TopNewsContent } from "@/components/nav/news";
import { HeroAnimateBrands } from "@/components/pages/hero/animateBrands";
import { HeroHighlightContent } from "@/components/pages/hero/highlight";

export default async function Page() {
  return (
    <>
      <TopNewsContent />
      <Header />
      <div className="relative flex h-screen min-h-dvh w-full flex-col overflow-hidden bg-background">
        <HeroTopTitle />
        <HeroTopImage />
        <HeroTopGradient />
      </div>
      <HeroTeamMembersContent />
      <HeroAnimateBrands />
      <HeroHighlightContent />
      <HeroPricingContent />
      <TopNewsContents />
      <div className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="container flex flex-col items-start max-w-[1024px] px-8 mx-auto"></div>
      </div>
      <Footer />
    </>
  );
}
