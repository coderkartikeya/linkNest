import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    ADDRESS: 'https://link-nest-backend.vercel.app'
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
       config.output.publicPath = "";
    }
    return config;
 },
 eslint: {
  // Warning: This allows production builds to successfully complete even if

  ignoreDuringBuilds: true,
},
};

export default nextConfig;
