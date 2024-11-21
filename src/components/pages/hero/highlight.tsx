"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Boxes,
  Code,
  Fingerprint,
  HandCoins,
  LayoutDashboard,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import {
  CustomCardHeader,
} from "@/app/dashboard/account/(components)/customCard";

interface HeroHighlightContentCardType {
  icon: LucideIcon;
  title: string;
  description: string;
}

function HeroHighlightContentCard({
  card,
}: {
  card: HeroHighlightContentCardType;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      style={{
        filter: isInView ? "blur(0px)" : "blur(10px)",
        transform: isInView ? "none" : "translateY(100px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
      }}
      className="flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large backdrop-blur-md backdrop-saturate-150 transition-transform-background motion-reduce:transition-none bg-background/60 p-3 dark:bg-default-100/50"
      tabIndex={-1}
    >
      <div className="p-3 w-full justify-start shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large flex flex-col items-start gap-2">
        <card.icon />
        <h2 className="text-large font-medium">{card.title}</h2>
        <p className="text-medium text-default-500">{card.description}</p>
      </div>
    </div>
  );
}

export function HeroHighlightContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const ref2 = useRef(null);
  const isInView2 = useInView(ref2, { once: true });

  const cards: HeroHighlightContentCardType[] = [
    {
      icon: UserCog,
      title: "アカウントの連携",
      description:
        "Scratchアカウントを当サービスと連携させることで、ゲームデータなどの同期を実現します。",
    },
    {
      icon: Fingerprint,
      title: "アカウントの認証",
      description:
        "Scratch Authを実装することで、ご利用したいScratchアカウントを認証できる様になりました。",
    },
    {
      icon: LayoutDashboard,
      title: "ダッシュボード",
      description: "アカウントはダッシュボードで管理することができます。",
    },
    {
      icon: HandCoins,
      title: "サービス使用料",
      description:
        "当サービスは、一部のプログラマーによって無償で開発、運営をしています。",
    },
    {
      icon: Boxes,
      title: "多くの依存関係",
      description: "当サービスは、多くのサービスおよび開発者に依存しています。",
    },
    {
      icon: Code,
      title: "開発者向け機能",
      description:
        "開発者向けに認証機能を提供しようと開発を進めています。この情報を保証することは現在できません。",
    },
  ];

  return (
    <div className="container flex flex-col items-start max-w-[1024px] px-8 mx-auto">
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
          ハイライト
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
          当サービスが優れている理由、すなわち適応性、耐久性、ユーザーに優しい機能、革新性をご覧ください。
        </motion.p>
      </CustomCardHeader>
      <div className=" grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-3">
        {cards.map((card, index) => {
          return <HeroHighlightContentCard key={index} card={card} />;
        })}
      </div>
    </div>
  );
}
