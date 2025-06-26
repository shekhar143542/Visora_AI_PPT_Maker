import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ucarecdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kokonutui.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;