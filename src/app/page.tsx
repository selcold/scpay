import React from "react";
import {
  LogInButton,
  LogIned,
  LogOuted,
  UserButton,
} from "@scratch-auth/nextjs";
import Footer from "@/components/nav/footer";
import Header from "@/components/nav/header";

export default function Page() {
  return (
    <>
      <Header />
      <div className="w-full h-full min-h-[calc(100dvh-64px)]">
        <LogOuted>
          <LogInButton />
        </LogOuted>
        <LogIned>
          <UserButton />
        </LogIned>
      </div>
      <Footer />
    </>
  );
}
