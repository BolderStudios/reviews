/** @type {import('next').NextConfig} */
const nextConfig = {
  // Update app's hostname
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
