import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  matcher: ["/auth", "/dashboard/:path*"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4200",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "ya-budu.ru",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "t.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.t.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdn-telegram.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
