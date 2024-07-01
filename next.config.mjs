/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  reactStrictMode: true,
  poweredByHeader: false,
  // Log webpack compilation errors
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.optimization.minimizer.push(
        new (require("terser-webpack-plugin"))({
          terserOptions: {
            compress: {
              drop_console: false,
            },
          },
        })
      );
    }
    return config;
  },
};

export default nextConfig;
