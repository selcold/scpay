import React from "react";

import type { Metadata, ResolvingMetadata } from 'next'
import { getTranslations } from "next-intl/server"

import { LayoutProps } from "../../../layout";
import PageClient from "./_page";

export async function generateMetadata(
  { params }: LayoutProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lang = params.locale;
  const t = await getTranslations({ lang, namespace: "Docs.creator.imageUpload" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

function Page() {
  return (
    <>
      <PageClient/>
    </>
  );
}

export default Page;
