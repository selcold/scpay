"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import AnimatedMemberContents from "@/components/ui/animatedTeamsCard";
// import dynamic from "next/dynamic";
// const AnimatedMemberContents = dynamic(
//   () => import("../../ui/animatedTeamsCard"),
//   { ssr: false }
// );

type teamMembersType = {
  name: string;
  designation: string;
  quote: string;
  src: string;
};
function HeroTeamMembersContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const teamMembers: teamMembersType[] = [
    {
      name: "Fun117",
      designation: "サービスモデレーター & 開発者",
      quote:
        "プロジェクト全体の管理を担当しています。サービスの運営から制作まで幅広い担当をしています。",
      src: "/wp-content/user/fun117/icon.png",
    },
    {
      name: "Masaabu",
      designation: "プロジェクトマネージャー",
      quote: "プロジェクトの提案...",
      src: "https://github.com/masaabu.png",
    },
  ];

  return (
    <motion.div
      className="container flex flex-col items-start max-w-[1024px] px-8 mx-auto"
      ref={ref}
      style={{
        filter: isInView ? "blur(0px)" : "blur(10px)",
        transform: isInView ? "none" : "translateY(100px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
      }}
    >
      <AnimatedMemberContents items={teamMembers} autoplay />
    </motion.div>
  );
}

export default HeroTeamMembersContent;
