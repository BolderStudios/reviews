/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "admin.stashideas.com" }],
        destination: "/admin/:path*",
      },
      // Add localhost entry for development
      {
        source: "/:path*",
        has: [{ type: "host", value: "admin.localhost" }],
        destination: "/admin/:path*",
      },
    ];
  },
};

export default nextConfig;
