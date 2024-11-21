"use server";

import React, { Suspense } from "react";
import AccountStatus from "./accountStatus";
import AccountRegistrations from "./accountRegistrations";
import { Skeleton } from "@nextui-org/react";
import AccountScratchLinked from "./accountScratchLinked";
import AccountStatusAdmin from "./accountStatusAdmin";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "アナリティクス",
  };
}

async function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-start w-full mb-5">
        <h1 className="font-bold text-xl md:!text-2xl lg:!text-3xl">
          アナリティクス
        </h1>
      </div>
      <section className="flex flex-col justify-center items-start w-full">
        <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 justify-stretch gap-2 w-full">
          <Suspense
            fallback={
              <Skeleton className="w-full h-full min-h-48 rounded-lg" />
            }
          >
            <AccountStatus />
          </Suspense>
          <Suspense
            fallback={
              <Skeleton className="w-full h-full min-h-48 rounded-lg" />
            }
          >
            <AccountScratchLinked />
          </Suspense>
          <Suspense
            fallback={
              <Skeleton className="w-full h-full min-h-48 rounded-lg" />
            }
          >
            <AccountStatusAdmin />
          </Suspense>
        </div>
        <hr className="w-full my-5" />
        <div className="flex flex-col justify-start items-start gap-2 w-full">
          <Suspense
            fallback={
              <Skeleton className="w-full h-full min-h-48 rounded-lg" />
            }
          >
            <AccountRegistrations />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

export default AdminAnalyticsPage;
