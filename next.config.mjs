/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude all native modules from the build
    config.externals = [...(config.externals || []), 'better-sqlite3', 'sqlite3', 'sqlite'];
    
    // For better-sqlite3 and other native modules
    if (!isServer) {
      // Don't attempt to load native modules in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        "child_process": false,
        "better-sqlite3": false,
        "sqlite3": false,
        "sqlite": false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
