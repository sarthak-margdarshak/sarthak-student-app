/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.sarthakmargdarshak.in",
      },
    ],
  },
};

export default nextConfig;
