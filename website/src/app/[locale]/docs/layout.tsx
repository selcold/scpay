import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { Inter } from "next/font/google";
import "./docs.css";

const inter = Inter({ subsets: ["latin"] });

// config
import config from "../../../../richtpl.config";

// next-intl (i18n)
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import CloseDocsButton from "./_components/closeDocs";

export type LayoutProps = {
  params: { locale: string };
};

export async function generateMetadata(
  { params }: LayoutProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lang = params.locale;
  const t = await getTranslations({ lang, namespace: "Metadata" });

  return {
    title: {
      template: `%s | ${
        config.themeConfig?.metadata?.title || config.title || t(`title`)
      } Docs`,
      default: `${
        config.themeConfig?.metadata?.title || config.title || t(`title`)
      } Docs`,
    },
    authors: config.themeConfig?.metadata?.authors || [
      { name: "Fun117", url: "https://fun117.dev" },
    ],
    creator: config.themeConfig?.metadata?.creator || "Fun117",
    metadataBase:
      config.themeConfig?.metadata?.metadataBase || new URL(config.url),
    openGraph: {
      type: "website",
      url: config.url,
      siteName:
        config.themeConfig?.metadata?.openGraph?.siteName ||
        config.title ||
        t(`title`),
      title:
        config.themeConfig?.metadata?.openGraph?.title ||
        config.title ||
        t(`title`),
      description:
        config.themeConfig?.metadata?.openGraph?.description ||
        config.description ||
        t(`description`),
      images:
        config.themeConfig.metadata?.openGraph?.images ||
        config.themeConfig.image,
      locale:
        config.themeConfig?.metadata?.openGraph?.locale ||
        config.i18n.localeConfigs[lang].htmlLang ||
        "ja-JP",
    },
    twitter: {
      card: "summary_large_image",
      site: `@${
        config.themeConfig?.metadata?.twitter?.site ||
        config.themeConfig?.metadata?.creator ||
        "Fun_117"
      }`,
      title:
        config.themeConfig?.metadata?.twitter?.title ||
        config.title ||
        t(`title`),
      description:
        config.themeConfig?.metadata?.twitter?.description ||
        config.description ||
        t(`description`),
      creator: `@${
        config.themeConfig?.metadata?.twitter?.creator ||
        config.themeConfig?.metadata?.creator ||
        "Fun_117"
      }`,
      images:
        config.themeConfig.metadata?.twitter?.images ||
        config.themeConfig.image,
    },
    ...config.themeConfig?.metadata,
  };
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="docs container flex flex-col pt-5"><CloseDocsButton/>{children}</div>;
}
