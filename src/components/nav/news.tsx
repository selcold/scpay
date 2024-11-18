"use client";

import { motion } from "motion/react";

export function TopNewsContent() {
  return (
    <motion.div
      className="relative flex justify-center items-center w-full p-3 bg-neutral-200/20 dark:bg-neutral-800/20 backdrop-blur-md border-b border-neutral-300 dark:border-neutral-700 overflow-hidden"
      initial={{ opacity: 0, y: -30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: "linear",
      }}
    >
      <div className="absolute top-16 left-0 right-0 z-0 -translate-x-[350px] w-auto h-auto transform-gpu overflow-hidden blur-3xl md:h-auto md:w-auto">
        <div className="mx-auto aspect-[1155/678] w-52 bg-gradient-to-tr from-[#ff7171] to-[#e9d4a9] opacity-30" />
      </div>
      <div className="absolute top-0 left-0 right-0 z-0 -translate-x-16 w-auto h-auto transform-gpu overflow-hidden blur-3xl md:h-auto md:w-auto">
        <div className="mx-auto aspect-[1155/678] w-52 bg-gradient-to-tr from-[#71a7ff] to-[#a9c2e9] opacity-30" />
      </div>
      <div className="absolute -top-10 left-0 right-0 z-0 translate-x-56 w-auto h-auto transform-gpu overflow-hidden blur-3xl">
        <div className="mx-auto aspect-[1155/678] w-52 bg-gradient-to-tr from-[#ff71f6] to-[#a9c2e9] opacity-30" />
      </div>
      <span>現在開発環境です</span>
    </motion.div>
  );
}
