"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {

  const money = 748000;

  return (
    <div className="flex flex-col justify-start items-center gap-5 w-full h-fit px-2 md:px-10 py-10">
      <div className="flex justify-between items-center bg-blue-400 border-blue-300 text-white border-2 w-full max-w-3xl h-20 px-2 md:px-5 rounded-lg">
        <h1 className="text-2xl font-bold">残高</h1>
        <span className="text-xl font-semibold">
          {money}
          <span className="text-sm font-base">pt</span>
        </span>
      </div>
      <a href="http://localhost:3000/ja/docs/creator/events/imageUpload?requrl=/wallet">Open Docs</a>
    </div>
  );
}
