/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/:path*",
  //       has: [
  //         {
  //           type: "host",
  //           value: "admin.localhost",
  //         },
  //       ],
  //       destination: "/admin/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
