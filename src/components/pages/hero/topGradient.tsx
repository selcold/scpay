"use client";

import React from "react";
import { motion } from "motion/react";

function HeroTopGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 top-[-25%] z-10 scale-150 select-none sm:scale-125">
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: "linear",
        }}
      >
        <img
          alt="Gradient background"
          className="opacity-20 dark:opacity-100"
          decoding="async"
          data-nimg="fill"
          sizes="100vw"
          src="/wp-content/bg-gradient.webp"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: 0,
            color: "transparent",
          }}
        />
      </motion.div>
    </div>
  );
}

export default HeroTopGradient;
