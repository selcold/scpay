import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: "/" // Currently you need to set the `baseUrl` yourself
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mtthwkpbwxbzwwwwfefl.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'scratch.mit.edu',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },  
};

export default withNextIntl(nextConfig);
