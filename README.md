# TLW Bare

A modern Next.js starter template with Tailwind CSS and shadcn/ui components.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Development:** [Turbopack](https://turbo.build/pack)

## ✨ Features

- 🎨 Beautiful UI components with shadcn/ui
- 🎯 TypeScript support for better developer experience
- ⚡ Lightning-fast development with Turbopack
- 🎪 Modern styling with Tailwind CSS v4
- 📱 Responsive design out of the box
- 🔧 Pre-configured with ESLint
- 🎨 Neutral color scheme with CSS variables
- 📦 Component-based architecture

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

## 📝 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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
├── components/           # Reusable components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utility functions
├── public/              # Static assets
└── components.json      # shadcn/ui configuration
```

## 🎨 Customization

### Colors

The project uses a neutral color scheme. You can customize colors by modifying the CSS variables in `app/globals.css` or by running:

```bash
npx shadcn@latest init
```

### Components

shadcn/ui components are fully customizable. You can modify them in the `components/ui` directory after adding them to your project.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Learn about the UI components
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS

## 🚀 Deploy

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/pxdsgnco/tlw-bare)

You can also deploy to:
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
