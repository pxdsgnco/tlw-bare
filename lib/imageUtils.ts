/**
 * Image optimization utilities for Lagos Lifestyle Platform
 * 
 * This module provides utilities for optimized image loading,
 * placeholder generation, and performance-focused image management.
 */

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Generate optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: Partial<OptimizedImageProps> = {}
): OptimizedImageProps {
  return {
    src: getOptimizedImageSrc(src),
    alt,
    width: options.width || 400,
    height: options.height || 300,
    priority: options.priority || false,
    quality: options.quality || 75,
    placeholder: options.placeholder || 'blur',
    blurDataURL: options.blurDataURL || generateBlurDataURL(options.width || 400, options.height || 300),
  };
}

/**
 * Convert external image URLs to local optimized versions
 */
export function getOptimizedImageSrc(originalSrc: string): string {
  // Convert localhost:3845 URLs to local placeholder images
  if (originalSrc.includes('localhost:3845')) {
    const filename = originalSrc.split('/').pop();
    const hash = filename?.split('.')[0];
    
    // Map to content type based on file hash patterns or generate placeholder
    if (hash) {
      return getPlaceholderImage(hash);
    }
  }
  
  return originalSrc;
}

/**
 * Generate placeholder images based on content type
 */
export function getPlaceholderImage(hash: string): string {
  // Use a deterministic mapping based on hash to ensure consistency
  const imageTypes = [
    '/images/homepage/event-placeholder-1.jpg',
    '/images/homepage/event-placeholder-2.jpg', 
    '/images/homepage/event-placeholder-3.jpg',
    '/images/nightlife/venue-placeholder-1.jpg',
    '/images/nightlife/venue-placeholder-2.jpg',
    '/images/nightlife/venue-placeholder-3.jpg',
    '/images/blog/article-placeholder-1.jpg',
    '/images/blog/article-placeholder-2.jpg',
    '/images/blog/article-placeholder-3.jpg'
  ];
  
  // Use hash to deterministically select placeholder
  const hashSum = hash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const index = hashSum % imageTypes.length;
  
  return imageTypes[index];
}

/**
 * Generate blur data URL for placeholder effect
 */
export function generateBlurDataURL(width: number, height: number): string {
  // Generate a simple blur data URL
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Image size configurations for different content types
 */
export const IMAGE_SIZES = {
  homepage: {
    hero: { width: 1200, height: 600 },
    card: { width: 400, height: 300 },
    thumbnail: { width: 200, height: 150 },
  },
  events: {
    hero: { width: 1200, height: 400 },
    card: { width: 350, height: 250 },
    detail: { width: 800, height: 500 },
  },
  nightlife: {
    hero: { width: 1200, height: 400 },
    card: { width: 350, height: 250 },
    gallery: { width: 600, height: 400 },
  },
  blog: {
    hero: { width: 1200, height: 600 },
    featured: { width: 800, height: 400 },
    card: { width: 300, height: 200 },
  },
} as const;

/**
 * Get responsive image sizes string for Next.js Image component
 */
export function getResponsiveImageSizes(type: keyof typeof IMAGE_SIZES): string {
  const _sizes = IMAGE_SIZES[type];
  
  return `
    (max-width: 768px) 100vw,
    (max-width: 1200px) 50vw,
    33vw
  `.trim();
}

/**
 * Priority image detection for LCP optimization
 */
export function shouldPrioritizeImage(
  component: string,
  index: number,
  isAboveFold: boolean = true
): boolean {
  // Prioritize first few images that are likely to be LCP
  const priorityRules = {
    hero: index === 0,
    featured: index < 2 && isAboveFold,
    card: index < 3 && isAboveFold,
    default: index < 1 && isAboveFold,
  };
  
  return priorityRules[component as keyof typeof priorityRules] || priorityRules.default;
}

/**
 * Image optimization recommendations
 */
export const IMAGE_OPTIMIZATION_TIPS = {
  formats: ['WebP', 'AVIF'] as const,
  quality: {
    high: 85,
    medium: 75, 
    low: 60,
  },
  compression: {
    lossless: false,
    progressive: true,
  },
} as const;