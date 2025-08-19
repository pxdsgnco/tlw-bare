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
    // Bundle analyzer configuration
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      
      // Always use static mode to avoid port conflicts and CI issues
      // This generates HTML files that can be viewed locally or uploaded as artifacts
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false, // Never try to open browser automatically
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
