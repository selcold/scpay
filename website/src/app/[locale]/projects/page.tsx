import type { Metadata, ResolvingMetadata } from 'next'
import { getTranslations } from "next-intl/server";
import { LayoutProps } from "../layout";

import PageClient from "./page-client";

export async function generateMetadata(
  { params }: LayoutProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lang = params.locale;
  const t = await getTranslations({ lang, namespace: "Pages.Projects.Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <>
      <PageClient />
    </>
  );
}
