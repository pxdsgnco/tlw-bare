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
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 2000 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 3000 }],
        
        // Performance scores
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
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