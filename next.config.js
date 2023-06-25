/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
