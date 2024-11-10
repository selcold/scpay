"use client";

import React from "react";
import { useUser } from "@/hooks/useUser";
import { LoaderRound } from "@/components/ui/loading";
import LinkScratch from "./linkScratch";
import DataList from "./datalist";
import SettingAvatar from "./avatar";

function AccountPage() {
  const { user, loading } = useUser();

  if (loading) {
    return <LoaderRound />;
  }

  return (
    <div className="flex flex-col w-full p-5">
      <section>
        <SettingAvatar scpay_user={user} />
        {/* <hr className="w-full my-5" />
        <DataList scpay_user={user} /> */}
        <hr className="w-full my-5" />
        <LinkScratch scpay_user={user} />
      </section>
    </div>
  );
}

export default AccountPage;
