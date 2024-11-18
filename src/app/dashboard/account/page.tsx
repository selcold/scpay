import React, { Suspense } from "react";
import { Skeleton } from "@nextui-org/react";
import LinkScratch from "./(components)/linkScratch";
import SettingAvatar from "./(components)/avatar";
import { AccountSettingUserId } from "./(components)/userId";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "アカウント",
  };
}

async function AccountPage() {
  function CustomSkeleton() {
    return <Skeleton className="w-full h-full min-h-32 rounded-lg" />;
  }
  return (
    <div className="flex flex-col items-start max-w-[1024px] ml-0 mr-auto">
      <section className="flex flex-col justify-start items-start gap-5">
        <Suspense fallback={<CustomSkeleton />}>
          <SettingAvatar />
        </Suspense>
        <Suspense fallback={<CustomSkeleton />}>
          <LinkScratch />
        </Suspense>
        <Suspense fallback={<CustomSkeleton />}>
          <AccountSettingUserId />
        </Suspense>
      </section>
    </div>
  );
}

export default AccountPage;
