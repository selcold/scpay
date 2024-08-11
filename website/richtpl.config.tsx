import Config from "@/types/richtpl.config";

// icons
import { Home, LibraryBig, Mail, UserRound, Wallet } from "lucide-react";

/**
 * Site configuration object.
 * Contains general site information, i18n settings, and theme configuration.
 */
const config: Config = {
  // Tagline for the site
  tagline: "Scratch",

  // URL to the favicon
  favicon: "/favicon.ico",

  // Production URL of the site
  url: "https://scpay.vercel.app",

  // Base URL pathname (for GitHub Pages deployment)
  baseUrl: "/",

  // GitHub deployment configuration
  organizationName: "selcold", // GitHub organization/user name
  projectName: "scpay", // GitHub repository name

  // Internationalization (i18n) configuration
  i18n: {
    // Default locale for the site
    defaultLocale: "ja",
    // List of supported locales
    locales: ["ja", "en"],
    // Locale-specific configurations
    localeConfigs: {
      ja: {
        label: "日本語", // Label for the Japanese locale
        htmlLang: "ja-JP", // HTML language attribute for Japanese
        path: "ja", // Path prefix for Japanese locale
      },
      en: {
        label: "English", // Label for the English locale
        htmlLang: "en-US", // HTML language attribute for English
        path: "en", // Path prefix for English locale
      },
    },
    selectButton: true, // Option to include a locale selection button
  },

  // Theme and layout configuration
  themeConfig: {
    // Color mode settings
    colorMode: {
      defaultMode: "system", // Default color mode (light, dark, or system)
      selectSwitch: true, // Whether to allow switching color modes
    },
    // URL to the social card image (replace with your project's image)
    image: "/image/upload/front/nextjs/twitter-card.png",
    // Metadata for the site
    metadata: {
      keywords: ["scratch", "scpay", "selcold"],
      authors: { name: "selcold", url: "https://github.com/selcold" },
      creator: "selcold",
      icons: "/favicon.ico",
      generator: "Next.js",
      publisher: "Vercel",
      robots: "follow, index",
      metadataBase: new URL("https://scpay.vercel.app"),
    },
    // Header configuration
    header: {
      // Title for the header
      title: "ScPay",
      // Navigation items in the header
      items: {
        left: [
          {
            icon: <Home className="w-7 h-7" />,
            label: "Home",
            to: "/",
            i18n_link: true,
            i18n_text: true,
          },
          {
            icon: <LibraryBig className="w-7 h-7" />,
            label: "Projects",
            to: "/projects",
            i18n_link: true,
            i18n_text: true,
          },
          {
            icon: <UserRound className="w-7 h-7" />,
            label: "Users",
            to: "/users",
            i18n_link: true,
            i18n_text: true,
          },
          {
            icon: <Wallet className="w-7 h-7" />,
            label: "Wallet",
            to: "/wallet",
            i18n_link: true,
            i18n_text: true,
          },
        ],
        right: [
          {
            custom: <></>,
            label: "",
          },
        ],
      },
    },
    // Sitemap Configuration
    sitemap: {
      excludedDirs: [
        "error", // Directory for error pages
        "not-found", // Directory for 404 pages
        "[...rest]", // Directory for [...rest] pages
      ],
    },
  },
};

export default config;
