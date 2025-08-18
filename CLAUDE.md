# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Principles

YOU MUST create a plan before making any major changes and ask for explicit user confirmation before continuing. You can only skip this step if the change is trivial.

Don't just blindly follow my plan. Think as an independent engineer when I ask you to do any major work and suggest alternative plans if you have better suggestions.

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Adding shadcn/ui components
npx shadcn@latest add button    # Add specific components
npx shadcn@latest add card
```

## Architecture Overview

This is a Next.js 15 application with a **role-based access control system** that implements three user roles: Viewer, Curator, and Admin. The application structure follows a hierarchical permission model where each role inherits access from lower roles.

### Core Architecture Components

**Authentication & Authorization:**
- `lib/auth.ts` - Defines roles, permissions, and access control logic
- `contexts/AuthContext.tsx` - React context for user state management
- `components/ProtectedRoute.tsx` - Route-level access control wrapper

**Role Hierarchy:**
- **Viewer**: Basic access to public pages + personal settings
- **Curator**: Viewer access + content management (events, nightlife)
- **Admin**: Curator access + full system management (blog, pages)

**Route Structure:**
- Public routes: `/`, `/events`, `/nightlife`, `/blog`, `/community`, `/weekend-guide`
- User routes: `/user/profile`, `/user/bookmarks`, `/user/settings`
- Curator routes: `/user/events`, `/user/nightlife`
- Admin routes: `/user/blog`, `/user/pages`

### Key Implementation Details

**Permission Management:**
The `rolePermissions` object in `lib/auth.ts` defines exact path access for each role. The `hasAccess()` function checks permissions, and `ProtectedRoute` component enforces them at the UI level.

**Testing Roles:**
The navigation includes a role switcher dropdown for testing different permission levels. Change the `mockUser.role` in `lib/auth.ts` to set the default role.

**Adding New Protected Routes:**
1. Add path to appropriate role arrays in `rolePermissions`
2. Wrap page component with `<ProtectedRoute>`
3. Update navigation menu if needed

**shadcn/ui Integration:**
This project uses shadcn/ui with the "new-york" style and neutral base color. Components go in `components/ui/` with path aliases configured.

## Project Configuration

- **TypeScript**: Strict mode enabled with path aliases (`@/`)
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui with Lucide icons
- **Development**: Turbopack for fast hot reloading
- Whenever you need to trigger the npm run dev command, run the 'pkill -f "npm run dev"' command first before you run the npm command

## Environment & Constraints

### Development Environment Assumptions
- You should never need to start the dev server unless you need explicit debugging. Assume the user is already running `npm run dev`
- Note that the Playwright tests automatically start up a dev server for testing and won't reuse an existing one. If you need to do testing, either make sure the server is running at port 3000 or start one yourself via "npm run dev"

## Frontend Development Standards

⚠️ **MANDATORY**: Before any frontend development work, you MUST review and follow the [Frontend Development Rules](docs/frontend-development-rules.md). This document contains comprehensive industry-standard best practices that govern all frontend code in this project.

## Code Standards

### Quick Reference (see full rules in docs/frontend-development-rules.md)
- Use TypeScript for all code; prefer interfaces over types
- Use functional components and declarative programming; avoid classes
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Structure: exported component, subcomponents, helpers, static content, types
- Prefer server components and minimize 'use client' directives
- Use server actions for data fetching and state management
- Always check and fix type errors before completing

### Naming & Organization
- Use lowercase with dashes for directories (e.g., components/auth-wizard)
- Favor named exports for components
- Use the "function" keyword for pure functions

### File Discipline
- Don't create internal readme files unnecessarily; they should only be required when the code logic is extremely complex
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User

## Development Workflow

### Version Control
- Do not include the co-authored with claude note in commit message