"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { InfiniteMovingCards } from "./infinite-moving-cards";
import {
  CustomCardHeader,
} from "@/app/dashboard/account/(components)/customCard";

function CustomInfiniteMovingCards({
  items,
  direction,
}: {
  items: {
    src: string;
  }[];
  direction: "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      style={{
        filter: isInView ? "blur(0px)" : "blur(10px)",
        transform: isInView
          ? "none"
          : direction === "left"
          ? "translateX(100px)"
          : "translateX(-100px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
      }}
      className="w-full overflow-hidden"
    >
      <InfiniteMovingCards
        items={items}
        speed="normal"
        direction={direction}
        pauseOnHover={false}
      />
    </motion.div>
  );
}

export function HeroAnimateBrands() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const ref2 = useRef(null);
  const isInView2 = useInView(ref2, { once: true });

  const items = [
    {
      src: "/wp-content/brand/vercel/brand.svg",
    },
    {
      src: "/wp-content/brand/nextjs/brand.svg",
    },
    {
      src: "/wp-content/brand/supabase/brand.svg",
    },
    {
      src: "/wp-content/brand/tailwindcss/brand.svg",
    },
    {
      src: "/wp-content/brand/openai/brand.svg",
    },
  ];
  return (
    <div className="container flex flex-col justify-center items-center max-w-[1024px] px-8 my-20 mx-auto">
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
          当サービスが依存している製品
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
          サービスの開発、運営をするにあたって利用している製品やサービス
        </motion.p>
      </CustomCardHeader>
      <CustomInfiniteMovingCards items={items} direction="left" />
      <CustomInfiniteMovingCards items={items} direction="right" />
    </div>
  );
}
