import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PrismaPlugin = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  /* Fix prisma client issue when deploying to Vercel */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin())
    }
    return config
  },
  turbopack: {},
};

export default nextConfig;
