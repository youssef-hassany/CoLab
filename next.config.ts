import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // Add other domains as needed
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      // R2 domain with both HTTP and HTTPS support
      {
        protocol: "http",
        hostname: "pub-ff2ca37b533641ffa6a9cffe678a70d6.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-ff2ca37b533641ffa6a9cffe678a70d6.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // ADD THIS WEBPACK CONFIGURATION BELOW
  webpack: (config, { dev, webpack }) => {
    // Only apply this in development mode
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },
};

export default nextConfig;
