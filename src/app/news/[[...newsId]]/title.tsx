"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

function NewsPageTitle() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const ref2 = useRef(null);
  const isInView2 = useInView(ref2, { once: true });
  return (
    <div className="flex flex-col justify-center items-center w-full py-5 sm:!py-10 md:!py-20 mb-5">
      <motion.h1
        ref={ref}
        style={{
          filter: isInView ? "blur(0px)" : "blur(10px)",
          transform: isInView ? "none" : "translateY(100px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
        }}
        className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#00000066] dark:from-[#FFFFFF] dark:to-[#FFFFFF66] font-bold text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl mb-3"
      >
        ニュース
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
        当サービスのニュースはすべての利用者が無料で見ることができます。
      </motion.p>
    </div>
  );
}

export default NewsPageTitle;
