import { Metadata } from "next";
import { UserInfo } from "./userInfo";
import Footer from "@/components/nav/footer";
import Header from "@/components/nav/header";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ユーザー",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;

  if (userId) {
    return (
      <>
        <Header />
        <div className="flex flex-col w-full h-dvh">
          <UserInfo userId={userId} />
        </div>
        <Footer />
      </>
    );
  }

  return null;
}
