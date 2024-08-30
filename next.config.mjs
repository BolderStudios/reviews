/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    domains: [
      'lh5.googleusercontent.com',
      'www.google.com',
      's3-media0.fl.yelpcdn.com',
      's3-media1.fl.yelpcdn.com',
      's3-media2.fl.yelpcdn.com',
      's3-media3.fl.yelpcdn.com',
      's3-media4.fl.yelpcdn.com',
      'res.cloudinary.com',
      '127.0.0.1',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: '**.yelpcdn.com',
      },
    ],
  },
};

export default nextConfig;