import { Metadata } from "next";
import React from "react";
import GetMarkdownContent from "./getContent";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy",
  };
}

function DocsPrivacyPolicy() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-start w-full mb-5">
        <h1 className="font-bold text-xl md:!text-2xl lg:!text-3xl">
          プライバシポリシー
        </h1>
      </div>
      <GetMarkdownContent />
    </div>
  );
}

export default DocsPrivacyPolicy;