"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";

export function HeroTopTitle() {
  return (
    <div className="container mx-auto mt-[80px] flex max-w-[1024px] flex-col items-start px-8">
      <section className="z-20 flex flex-col items-start justify-center gap-[18px] sm:gap-6">
        <Link href="#pricing">
          <button
            className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-20 gap-2 rounded-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover h-9 overflow-hidden border-1 border-default-100 bg-default-50 px-[18px] py-2 text-small font-normal leading-5 text-default-500"
            type="button"
          >
            新しい連携サービスを無料で体験
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              className="flex-none outline-none [&>path]:stroke-[2] iconify iconify--solar"
              focusable="false"
              tabIndex={-1}
              width={20}
              height={20}
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
              />
            </svg>
          </button>
        </Link>
        <div className="flex flex-col gap-6 w-auto">
          <motion.div
            className="text-start text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]"
            initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: "linear",
            }}
          >
            <div className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#00000066] dark:from-[#FFFFFF] dark:to-[#FFFFFF66]">
              Scratchの体験を <br /> 拡張するサービスです。
            </div>
          </motion.div>
          <motion.div
            className="text-start font-normal leading-7 text-default-500 sm:w-[466px] sm:text-[18px]"
            initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: 0.7,
              ease: "linear",
            }}
          >
            ScPayは、Scratchアカウントを当サービスと連携して、ゲームの進捗情報などのデータを同期します。開発者向けに認証サービスも提供します。
          </motion.div>
          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
            initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: 0.9,
              ease: "linear",
            }}
          >
            <Link href="/dashboard">
              <Button radius="full" color="primary" className="w-fit px-10">
                ダッシュボード
              </Button>
            </Link>
            <Link href="#pricing">
              <button
                className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-20 gap-2 rounded-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-transparent text-foreground data-[hover=true]:opacity-hover h-10 w-[163px] border-1 border-default-100 px-[16px] py-[10px] text-small font-medium leading-5"
                type="button"
              >
                プランを見る
                <span
                  className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full bg-default-100"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    className="text-default-500 [&>path]:stroke-[1.5] iconify iconify--solar"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 12h16m0 0l-6-6m6 6l-6 6"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
