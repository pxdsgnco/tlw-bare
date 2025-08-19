# Lagos Lifestyle Platform (TLW)

A high-performance Next.js application for discovering Lagos events, nightlife, and lifestyle content. Built with modern web technologies and optimized for exceptional user experience.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/) with strict mode
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Development:** [Turbopack](https://turbo.build/pack)
- **Performance:** Lighthouse CI, Image Optimization
- **Authentication:** Role-based access control system

## ✨ Key Features

- 🎨 Beautiful, responsive UI components with shadcn/ui
- 🎯 TypeScript support with strict type checking
- ⚡ Lightning-fast development with Turbopack
- 🚀 **95%+ performance improvements** (LCP: 83.2s → 3.9s)
- 📱 Mobile-first responsive design
- 🔐 **Role-based access control** (Viewer, Curator, Admin)
- 🖼️ **Optimized image loading** with Next.js Image component
- 📊 **Performance monitoring** with automated Lighthouse CI
- 🎪 Modern styling with Tailwind CSS v4 and CSS variables
- 📦 Component-based architecture with reusable patterns

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone git@github.com:pxdsgnco/tlw-bare.git
cd tlw-bare
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks

### Performance & Optimization
- `npm run analyze` - Analyze bundle size with webpack-bundle-analyzer
- `npm run lighthouse` - Run Lighthouse performance audit
- `npm run lighthouse:ci` - Run Lighthouse CI with performance budgets
- `npm run performance:audit` - Complete performance audit (build + lighthouse)
- `npm run performance:report` - Generate comprehensive performance report

### Image Optimization
- `node scripts/generate-placeholders.js` - Generate optimized SVG placeholder images
- `node scripts/performance-check.js` - Run automated performance monitoring

## 🧩 Adding Components

Add shadcn/ui components to your project:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Browse all available components at [ui.shadcn.com](https://ui.shadcn.com/docs/components).

## 📁 Project Structure

```
├── app/                  # Next.js App Router
│   ├── blog/            # Blog pages and dynamic routes
│   ├── events/          # Event listing and detail pages
│   ├── nightlife/       # Nightlife venues and details
│   ├── community/       # Community features
│   └── user/            # User dashboard and role-based pages
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── homepage/        # Homepage-specific components
│   ├── events/          # Event-related components
│   ├── nightlife/       # Nightlife-related components
│   └── blog/            # Blog-related components
├── contexts/            # React contexts (AuthContext)
├── lib/                 # Utility functions and configurations
│   ├── auth.ts          # Authentication and role management
│   ├── imageUtils.ts    # Image optimization utilities
│   └── placeholderImages.ts # Auto-generated image mappings
├── scripts/             # Build and utility scripts
│   ├── generate-placeholders.js # SVG placeholder generation
│   └── performance-check.js     # Performance monitoring
├── docs/                # Project documentation
│   ├── performance-optimization-plan.md
│   └── frontend-development-rules.md
├── reports/             # Performance and audit reports
├── public/              # Static assets and optimized images
│   └── images/          # Organized image assets by category
└── temp/                # Temporary files (gitignored)
```

## 🏗️ Architecture & Best Practices

### Role-Based Access Control
The application implements a hierarchical permission system:
- **Viewer**: Access to public pages and personal settings
- **Curator**: Viewer access + content management (events, nightlife)
- **Admin**: Curator access + full system management (blog, pages)

Access control is enforced through:
- `lib/auth.ts` - Role definitions and permission logic
- `contexts/AuthContext.tsx` - React context for user state
- `components/ProtectedRoute.tsx` - Route-level access control

### Performance Optimization
This project has been optimized to achieve **95%+ performance improvements**:

#### Image Optimization
- ✅ **Next.js Image component** instead of CSS backgrounds
- ✅ **Optimized SVG placeholders** for development
- ✅ **WebP/AVIF format support** with fallbacks
- ✅ **Priority loading** for above-fold content
- ✅ **Responsive image sizing** and lazy loading

#### Core Web Vitals Results
- **LCP (Largest Contentful Paint)**: 83.2s → 3.9s (-95.3%)
- **TTI (Time to Interactive)**: 87.0s → 4.0s (-95.4%)
- **Performance Score**: 75 → 88 (+13 points)

#### Performance Monitoring
- **Lighthouse CI** with automated performance budgets
- **Bundle analysis** with webpack-bundle-analyzer
- **Performance scripts** for continuous monitoring

### Development Guidelines

#### Code Standards
- Use **TypeScript** with strict mode enabled
- Prefer **functional components** and React hooks
- Use **descriptive variable names** with auxiliary verbs (isLoading, hasError)
- Implement **proper error handling** and accessibility features
- Follow **mobile-first responsive design** principles

#### File Organization
- **Prefer editing existing files** over creating new ones
- Use **lowercase with dashes** for directories (e.g., `auth-wizard/`)
- Organize components by **feature/domain** (homepage, events, nightlife)
- Place **utilities in `lib/`** and **documentation in `docs/`**

#### Performance Best Practices
- Use **Next.js Image component** for all images
- Implement **proper image preloading** for LCP optimization
- Configure **responsive image loading** with appropriate sizes
- Run **performance audits** before committing changes

## 🎨 Customization

### Colors
The project uses a neutral color scheme with CSS variables in `app/globals.css`. Customize by:
```bash
npx shadcn@latest init  # Reconfigure color scheme
```

### Components
All shadcn/ui components are fully customizable in `components/ui/`. Follow the existing patterns for consistency.

### Images
Use the image utilities in `lib/imageUtils.ts` for:
- Optimized image loading with proper sizing
- Placeholder generation for development
- Responsive image configuration

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Learn about the UI components
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS

## 🚀 Deployment & Performance

### Pre-Deployment Checklist
Before deploying, ensure all performance optimizations are in place:

```bash
# Run comprehensive performance checks
npm run performance:audit

# Verify all tests pass and code quality
npm run lint
npm run build

# Generate performance report
npm run performance:report
```

### Deployment Options
Deploy to any of these platforms with confidence:

**Recommended: [Vercel](https://vercel.com/new)** (Optimized for Next.js)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/pxdsgnco/tlw-bare)

**Alternative Platforms:**
- [Netlify](https://www.netlify.com/) - Great for static sites
- [Railway](https://railway.app/) - Simple containerized deployment
- [Render](https://render.com/) - Full-stack deployment platform

### Performance Monitoring in Production
Set up continuous performance monitoring:
- Enable **Vercel Analytics** or **Google Analytics 4**
- Configure **Core Web Vitals** monitoring
- Set up **performance alerts** for regression detection
- Implement **real user monitoring (RUM)** for actual performance data

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
