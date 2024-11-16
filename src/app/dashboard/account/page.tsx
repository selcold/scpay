import React, { Suspense } from "react";
import LinkScratch from "./linkScratch";
import { Skeleton } from "@nextui-org/react";
import SettingAvatar from "./avatar";

async function AccountPage() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col justify-start items-start">
        <Suspense
          fallback={<Skeleton className="w-full h-full min-h-32 rounded-lg" />}
        >
          <SettingAvatar />
        </Suspense>
        <hr className="w-full my-5" />
        <Suspense
          fallback={<Skeleton className="w-full h-full min-h-32 rounded-lg" />}
        >
          <LinkScratch />
        </Suspense>
      </section>
    </div>
  );
}

export default AccountPage;
