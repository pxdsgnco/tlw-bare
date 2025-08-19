module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/blog',
        'http://localhost:3000/events',
        'http://localhost:3000/nightlife',
        'http://localhost:3000/community',
      ],
      startServerCommand: 'npm run start',
      numberOfRuns: 3,
    },
    assert: {
      // Performance budgets
      assertions: {
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.2 }],
        'first-meaningful-paint': ['warn', { maxNumericValue: 3000 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        'interactive': ['warn', { maxNumericValue: 5000 }],
        
        // Performance scores
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.8 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        
        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 250000 }], // 250KB JS
        'resource-summary:image:size': ['error', { maxNumericValue: 500000 }], // 500KB images
        'resource-summary:document:size': ['error', { maxNumericValue: 50000 }], // 50KB HTML
        'resource-summary:font:size': ['error', { maxNumericValue: 100000 }], // 100KB fonts
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 50000 }], // 50KB CSS
        'resource-summary:total:size': ['error', { maxNumericValue: 1000000 }], // 1MB total
        
        // Other performance metrics
        'uses-optimized-images': 'error',
        'uses-webp-images': 'warn',
        'uses-responsive-images': 'error',
        'efficient-animated-content': 'error',
        'preload-lcp-image': 'warn',
        'unused-javascript': ['warn', { maxLength: 1 }],
        'unused-css-rules': ['warn', { maxLength: 1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};