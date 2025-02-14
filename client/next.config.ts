import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    ADDRESS: 'https://link-nest-backend.vercel.app'
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
