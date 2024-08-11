import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { LayoutProps } from "../../layout";

import PageClient from "./page-client";
import { GetProjectById } from "@/lib/supabase/projects";

type LayoutProps_ = {
  params: {
    locale: string;
    id: number;
  };
};

export async function generateMetadata(
  { params }: LayoutProps_,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lang = params.locale;
  const projectId = params.id;
  const t = await getTranslations({
    lang,
    namespace: "Pages.Project/[id].Metadata",
  });

  const project = await GetProjectById(projectId);

  return {
    title: `${project?.title || t("title")}`,
    description: t("description"),
  };
}

export default function Page({ params: { id } }: { params: { id: number } }) {
  id = id - 0;

  return (
    <>
      <PageClient id={id} />
    </>
  );
}
