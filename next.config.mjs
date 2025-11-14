/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@/config', '@/lib'],
  },
  webpack: (config, { isServer }) => {
    // Optimize large config files
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            config: {
              test: /[\\/]config[\\/]/,
              name: 'config',
              priority: 10,
            },
            lib: {
              test: /[\\/]lib[\\/]/,
              name: 'lib',
              priority: 5,
            },
          },
        },
      };
    }
    return config;
  },
}

export default nextConfig
