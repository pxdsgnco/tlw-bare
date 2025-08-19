#!/usr/bin/env node

/**
 * Generate optimized placeholder images for Lagos Lifestyle Platform
 * 
 * This script creates SVG-based placeholder images that are optimized
 * for performance and provide consistent visual placeholders.
 */

const fs = require('fs');
const path = require('path');

// Image configurations
const imageConfigs = [
  // Homepage placeholders
  { name: 'event-placeholder-1', width: 400, height: 300, type: 'homepage', gradient: ['#fb7102', '#ff9f43'] },
  { name: 'event-placeholder-2', width: 400, height: 300, type: 'homepage', gradient: ['#6c5ce7', '#a29bfe'] },
  { name: 'event-placeholder-3', width: 400, height: 300, type: 'homepage', gradient: ['#00b894', '#55efc4'] },
  
  // Nightlife placeholders
  { name: 'venue-placeholder-1', width: 350, height: 250, type: 'nightlife', gradient: ['#2d3436', '#636e72'] },
  { name: 'venue-placeholder-2', width: 350, height: 250, type: 'nightlife', gradient: ['#e17055', '#fab1a0'] },
  { name: 'venue-placeholder-3', width: 350, height: 250, type: 'nightlife', gradient: ['#0984e3', '#74b9ff'] },
  
  // Blog placeholders
  { name: 'article-placeholder-1', width: 300, height: 200, type: 'blog', gradient: ['#fd79a8', '#fdcb6e'] },
  { name: 'article-placeholder-2', width: 300, height: 200, type: 'blog', gradient: ['#6c5ce7', '#fd79a8'] },
  { name: 'article-placeholder-3', width: 300, height: 200, type: 'blog', gradient: ['#00b894', '#00cec9'] },
  
  // Events placeholders
  { name: 'event-detail-placeholder', width: 800, height: 500, type: 'events', gradient: ['#fb7102', '#e17055'] },
  { name: 'event-card-placeholder', width: 350, height: 250, type: 'events', gradient: ['#a29bfe', '#6c5ce7'] },
  
  // Hero placeholders
  { name: 'hero-placeholder-1', width: 1200, height: 600, type: 'homepage', gradient: ['#fb7102', '#fd79a8', '#6c5ce7'] },
  { name: 'hero-placeholder-2', width: 1200, height: 400, type: 'events', gradient: ['#00b894', '#00cec9', '#74b9ff'] },
];

function generateSVGPlaceholder(config) {
  const { name, width, height, gradient } = config;
  
  // Create gradient stops
  const gradientStops = gradient.map((color, index) => {
    const offset = (index / (gradient.length - 1)) * 100;
    return `<stop offset="${offset}%" style="stop-color:${color};stop-opacity:1" />`;
  }).join('\\n      ');
  
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradientStops}
    </linearGradient>
    <pattern id="texture-${name}" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.5" fill="rgba(255,255,255,0.1)"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${name})" />
  <rect width="100%" height="100%" fill="url(#texture-${name})" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
        fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="18" font-weight="500">
    ${width} × ${height}
  </text>
</svg>`;

  return svg;
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generatePlaceholders() {
  console.log('🎨 Generating optimized placeholder images...');
  
  // Group configs by type
  const groupedConfigs = imageConfigs.reduce((acc, config) => {
    if (!acc[config.type]) acc[config.type] = [];
    acc[config.type].push(config);
    return acc;
  }, {});
  
  let totalGenerated = 0;
  
  Object.entries(groupedConfigs).forEach(([type, configs]) => {
    const outputDir = path.join(__dirname, '..', 'public', 'images', type);
    ensureDirectoryExists(outputDir);
    
    console.log(`\\n📁 Generating ${type} placeholders...`);
    
    configs.forEach(config => {
      const svg = generateSVGPlaceholder(config);
      const outputPath = path.join(outputDir, `${config.name}.svg`);
      
      fs.writeFileSync(outputPath, svg);
      console.log(`  ✅ Generated: ${config.name}.svg (${config.width}×${config.height})`);
      totalGenerated++;
    });
  });
  
  console.log(`\\n🎉 Successfully generated ${totalGenerated} placeholder images!`);
  console.log('\\n📋 Next steps:');
  console.log('  1. Update components to use Next.js Image component');
  console.log('  2. Replace backgroundImage CSS with optimized images');
  console.log('  3. Add proper preloading for above-the-fold images');
}

// Also generate a mapping file for easy reference
function generateImageMapping() {
  const mapping = imageConfigs.reduce((acc, config) => {
    const key = config.name.replace('-placeholder', '').replace(/-/g, '_');
    acc[key] = `/images/${config.type}/${config.name}.svg`;
    return acc;
  }, {});
  
  const mappingContent = `/**
 * Auto-generated image mapping for optimized placeholders
 * Generated at: ${new Date().toISOString()}
 */

export const PLACEHOLDER_IMAGES = ${JSON.stringify(mapping, null, 2)} as const;

export type PlaceholderImageKey = keyof typeof PLACEHOLDER_IMAGES;
`;

  const mappingPath = path.join(__dirname, '..', 'lib', 'placeholderImages.ts');
  fs.writeFileSync(mappingPath, mappingContent);
  console.log('\\n📝 Generated image mapping file: lib/placeholderImages.ts');
}

// Run the generator
if (require.main === module) {
  try {
    generatePlaceholders();
    generateImageMapping();
    console.log('\\n✨ Image optimization setup complete!');
  } catch (error) {
    console.error('❌ Error generating placeholders:', error.message);
    process.exit(1);
  }
}

module.exports = { generatePlaceholders, generateImageMapping };