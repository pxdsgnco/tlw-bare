import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3845',
        pathname: '/assets/**',
      },
    ],
    // Image optimization settings
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
  },
  
  // Performance optimizations
  experimental: {
    // Enable optimized images
    optimizePackageImports: ['lucide-react'],
  },
  
  // Bundle analyzer configuration
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      
      // Use static mode in CI environments to avoid port conflicts
      const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
      
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: isCI ? 'static' : 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: !isCI, // Don't try to open browser in CI
          reportFilename: isServer 
            ? '../analyze/server.html' 
            : './analyze/client.html',
        })
      );
    }
    
    return config;
  },
};

export default nextConfig;
