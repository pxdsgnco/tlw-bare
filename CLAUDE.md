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

## Development Standards & Best Practices

⚠️ **MANDATORY**: Before ANY development work, you MUST review and follow ALL applicable documentation:

### Core Standards (Required for ALL development)
- **[Frontend Development Rules](docs/frontend-development-rules.md)** - Comprehensive industry-standard frontend practices
- **[Architecture Best Practices](docs/architecture-best-practices.md)** - SOLID principles, DDD patterns, composition patterns  
- **[Code Quality Checklist](docs/code-quality-checklist.md)** - Pre-commit verification standards and quality gates
- **[Error Handling Patterns](docs/error-handling-patterns.md)** - Defensive programming and error boundary patterns
- **[Testing Patterns](docs/testing-patterns.md)** - Comprehensive testing strategies and implementation
- **[Observability Standards](docs/observability-standards.md)** - Logging, monitoring, metrics, and debugging

### Content Architecture Documentation
- **[Venue-Event Integration Architecture](docs/venue-event-integration-architecture.md)** - Comprehensive design for unified venue-event system, database schema, API design, and cross-linking strategy

### Before Starting Any Task:
1. **Review the Code Quality Checklist** to understand verification requirements
2. **Check relevant architectural patterns** for the domain you're working in
3. **Implement proper error handling** from the start
4. **Include appropriate logging and monitoring**
5. **Write tests** alongside your implementation

### Quality Requirements:
- ALL code must pass the pre-commit checklist
- ALL components must have proper error boundaries
- ALL API calls must implement retry logic and proper error handling  
- ALL user interactions must be logged for observability
- ALL functions must follow SOLID principles

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

### Implementation Process
1. **Planning Phase**:
   - Create plan using TodoWrite tool for complex tasks
   - Review relevant documentation from Core Standards
   - Identify architectural patterns needed
   - Plan error handling and observability integration

2. **Development Phase**:
   - Follow SOLID principles and domain-driven design
   - Implement proper error boundaries and defensive programming  
   - Add structured logging and metrics collection
   - Write tests alongside implementation

3. **Quality Assurance**:
   - Run all quality checklist items before commit
   - Verify error handling in all edge cases
   - Ensure observability is properly integrated
   - Validate performance requirements are met

### Version Control
- Do not include the co-authored with claude note in commit message
- Follow conventional commit format as defined in Code Quality Checklist
- Include performance and quality metrics in commit descriptions when relevant

### Quality Gates (ALL must pass)
- ESLint validation: `npm run lint`
- TypeScript compilation: `npm run build` 
- All tests pass: `npm test` (when applicable)
- Error handling verification complete
- Observability integration verified
- Performance impact assessed