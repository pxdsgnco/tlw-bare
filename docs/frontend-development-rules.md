# Frontend Development Rules

This document establishes the industry-standard best practices and conventions for frontend development in this project. **These rules MUST be followed for all frontend development work** to ensure code quality, maintainability, and scalability.

## Table of Contents

1. [TypeScript Standards](#typescript-standards)
2. [React & Next.js Best Practices](#react--nextjs-best-practices)
3. [Component Architecture](#component-architecture)
4. [Naming Conventions](#naming-conventions)
5. [File Organization](#file-organization)
6. [State Management](#state-management)
7. [Performance Standards](#performance-standards)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Testing Standards](#testing-standards)
10. [Code Quality & Linting](#code-quality--linting)

## TypeScript Standards

### Type Safety
- **MANDATORY**: Use strict TypeScript configuration
- **NEVER** use `any` type - use `unknown` or proper typing instead
- **ALWAYS** define interfaces for props, API responses, and complex objects
- **PREFER** interfaces over type aliases for object shapes
- **REQUIRE** explicit return types for functions longer than 5 lines

```typescript
// ✅ Good
interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
  isActive: boolean;
}

function getUserProfile(userId: string): Promise<UserProfile | null> {
  // implementation
}

// ❌ Bad
function getUserProfile(userId: any): any {
  // implementation
}
```

### Utility Types Usage
- **USE** built-in utility types: `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, `Required<T>`
- **CREATE** discriminated unions for complex state management
- **IMPLEMENT** branded types for IDs and sensitive data

## React & Next.js Best Practices

### Component Design Principles
- **DEFAULT** to Server Components unless client interactivity is required
- **MINIMIZE** `'use client'` directives - push client boundaries as low as possible
- **IMPLEMENT** proper error boundaries for all page-level components
- **USE** React.Suspense for data fetching and component loading

### Server vs Client Components
```typescript
// ✅ Server Component (preferred)
async function BlogPost({ slug }: { slug: string }) {
  const post = await fetchPost(slug);
  return <article>{post.content}</article>;
}

// ✅ Client Component (when necessary)
'use client';
function InteractiveButton() {
  const [isClicked, setIsClicked] = useState(false);
  return <button onClick={() => setIsClicked(true)}>Click me</button>;
}
```

### Data Fetching Standards
- **USE** Server Actions for mutations
- **IMPLEMENT** proper loading and error states
- **CACHE** data appropriately with Next.js cache directives
- **VALIDATE** all external data with Zod or similar library

## Component Architecture

### Component Structure Template
```typescript
// 1. Imports (grouped and sorted)
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// 2. Type definitions
interface ComponentProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly isDisabled?: boolean;
}

// 3. Main component
export function Component({ 
  children, 
  className, 
  isDisabled = false 
}: ComponentProps) {
  // 4. Hooks (if client component)
  // 5. Event handlers
  // 6. Render logic
  
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
}

// 7. Sub-components (if any)
// 8. Helper functions
// 9. Constants
```

### Composition Patterns
- **PREFER** composition over props drilling
- **USE** compound components for complex UI elements
- **IMPLEMENT** render props or children functions for flexible APIs

## Naming Conventions

### Files and Directories
- **DIRECTORIES**: `kebab-case` (e.g., `user-profile`, `blog-post`)
- **COMPONENTS**: `PascalCase` files (e.g., `UserProfile.tsx`, `BlogCard.tsx`)
- **UTILITIES**: `camelCase` files (e.g., `formatDate.ts`, `apiHelpers.ts`)
- **CONSTANTS**: `SCREAMING_SNAKE_CASE` files (e.g., `API_ENDPOINTS.ts`)

### Variables and Functions
```typescript
// ✅ Boolean variables
const isLoading = true;
const hasError = false;
const canEdit = false;
const shouldRender = true;

// ✅ Event handlers
const handleButtonClick = () => {};
const handleFormSubmit = () => {};
const handleModalClose = () => {};

// ✅ Async functions
const fetchUserData = async () => {};
const validateForm = async () => {};

// ✅ Constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

### Component Naming
- **PAGE COMPONENTS**: Match route name (e.g., `page.tsx` in `/blog` → `BlogPage`)
- **FEATURE COMPONENTS**: Feature + Component type (e.g., `UserProfileCard`, `BlogPostEditor`)
- **UI COMPONENTS**: Generic, reusable names (e.g., `Button`, `Modal`, `Card`)

## File Organization

### Directory Structure Rules
```
components/
├── ui/              # Reusable UI components
├── forms/           # Form-specific components
├── layouts/         # Layout components
├── [feature]/       # Feature-specific components
│   ├── index.ts     # Barrel exports
│   └── Component.tsx
```

### Import Organization
```typescript
// 1. Node modules
import { useState } from 'react';
import { NextPage } from 'next';

// 2. Internal modules (alphabetical)
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// 3. Relative imports
import './Component.css';
```

### Barrel Exports
- **CREATE** `index.ts` files for clean imports
- **EXPORT** only public APIs
- **AVOID** deep import paths

## State Management

### State Placement Hierarchy
1. **Server State**: Database → Server Components
2. **URL State**: Search params, route params
3. **Component State**: `useState`, `useReducer`
4. **Context**: Shared component state
5. **External Store**: Complex global state

### Context Usage Rules
```typescript
// ✅ Proper context structure
interface AuthContextType {
  readonly user: User | null;
  readonly isLoading: boolean;
  readonly signIn: (credentials: Credentials) => Promise<void>;
  readonly signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Performance Standards

### Bundle Size Management
- **LAZY LOAD** components not immediately visible
- **CODE SPLIT** on route level
- **TREE SHAKE** unused code
- **MONITOR** bundle size in CI/CD

### Runtime Performance
```typescript
// ✅ Memoization patterns
const MemoizedComponent = memo(function Component({ items }: Props) {
  const sortedItems = useMemo(() => 
    items.sort((a, b) => a.name.localeCompare(b.name)), 
    [items]
  );
  
  const handleClick = useCallback((id: string) => {
    // handle click
  }, []);
  
  return <div>{/* render */}</div>;
});
```

### Image Optimization
- **USE** Next.js Image component
- **IMPLEMENT** proper sizing and priority flags
- **PROVIDE** alt text for accessibility

## Accessibility Requirements

### WCAG Compliance
- **MAINTAIN** AA level compliance minimum
- **IMPLEMENT** proper ARIA labels and roles
- **ENSURE** keyboard navigation support
- **TEST** with screen readers

### Semantic HTML
```tsx
// ✅ Good semantic structure
<main>
  <section aria-labelledby="main-heading">
    <h1 id="main-heading">Page Title</h1>
    <article>
      <h2>Article Title</h2>
      <p>Content...</p>
    </article>
  </section>
</main>
```

## Testing Standards

### Test Coverage Requirements
- **MINIMUM** 80% code coverage for utilities
- **REQUIRED** tests for all public component APIs
- **MANDATORY** integration tests for user flows

### Testing Patterns
```typescript
// ✅ Component testing template
describe('UserProfile', () => {
  it('should display user information correctly', () => {
    const user = createMockUser();
    render(<UserProfile user={user} />);
    
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
  });
  
  it('should handle loading state', () => {
    render(<UserProfile isLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

## Code Quality & Linting

### Automated Quality Checks
- **RUN** ESLint with strict configuration
- **USE** Prettier for code formatting
- **IMPLEMENT** pre-commit hooks
- **ENFORCE** type checking in CI

### Code Review Requirements
- **REQUIRE** approval from senior developer for architectural changes
- **CHECK** accessibility compliance
- **VERIFY** performance impact
- **VALIDATE** test coverage

### Documentation Requirements
- **DOCUMENT** complex business logic
- **PROVIDE** JSDoc for exported functions
- **MAINTAIN** up-to-date README files
- **CREATE** Storybook stories for UI components

## Enforcement

These rules are **mandatory** and will be enforced through:
- Automated linting and type checking
- Code review processes  
- Pre-commit hooks
- CI/CD pipeline checks

Any deviation from these standards must be explicitly approved and documented with clear reasoning.

---

*This document should be updated as new patterns emerge and industry standards evolve.*