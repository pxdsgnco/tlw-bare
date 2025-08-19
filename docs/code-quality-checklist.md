# Code Quality Checklist

This document provides a comprehensive checklist to ensure code quality before committing changes. Every developer and AI assistant (including Claude Code) **MUST** verify these items before any commit or pull request.

## Table of Contents

1. [Pre-Commit Verification](#pre-commit-verification)
2. [Architecture Compliance](#architecture-compliance)
3. [Code Quality Standards](#code-quality-standards)
4. [Performance Considerations](#performance-considerations)
5. [Security Checklist](#security-checklist)
6. [Documentation Requirements](#documentation-requirements)
7. [Testing Verification](#testing-verification)
8. [Accessibility Compliance](#accessibility-compliance)

## Pre-Commit Verification

### ✅ Automated Checks
Run these commands before every commit:

```bash
# Required commands (must pass)
npm run lint          # ESLint validation
npm run build         # TypeScript compilation and build
npm run typecheck     # Type checking (if separate command exists)

# Recommended commands
npm test              # Run test suite (when applicable)
npm run performance:check  # Performance validation (when applicable)
```

### ✅ Manual Verification
- [ ] All modified files have been reviewed
- [ ] No console.log statements left in production code
- [ ] No TODO comments without GitHub issues
- [ ] No hardcoded secrets, API keys, or sensitive data
- [ ] All imports are used and properly organized
- [ ] All variables and functions are properly named

## Architecture Compliance

### ✅ SOLID Principles
- [ ] **Single Responsibility**: Each function/component has one clear purpose
- [ ] **Open/Closed**: New functionality extends existing code without modification
- [ ] **Liskov Substitution**: Implementations can be substituted without breaking functionality
- [ ] **Interface Segregation**: Interfaces are focused and specific
- [ ] **Dependency Inversion**: High-level modules don't depend on low-level implementation details

### ✅ Domain-Driven Design
- [ ] Code is organized by business domain (blog/, events/, nightlife/, user/)
- [ ] Business logic is encapsulated in domain models
- [ ] Clear aggregate boundaries are maintained
- [ ] Domain-specific language is used in code and comments

### ✅ Composition Patterns
- [ ] Components use composition over inheritance
- [ ] Props are properly typed and readonly where appropriate
- [ ] Higher-order components or render props are used for cross-cutting concerns
- [ ] Component hierarchy is logical and maintainable

## Code Quality Standards

### ✅ TypeScript Compliance
- [ ] **Strict typing**: No `any` types (use `unknown` if necessary)
- [ ] **Interface definitions**: All props, API responses, and complex objects have interfaces
- [ ] **Readonly properties**: Immutable data structures use `readonly`
- [ ] **Generic constraints**: Generics have appropriate constraints where needed
- [ ] **Type guards**: Runtime type checking implemented where necessary

```typescript
// ✅ Good example
interface UserProfileProps {
  readonly user: User;
  readonly isEditable: boolean;
  readonly onUpdate?: (updates: Partial<User>) => Promise<void>;
}

// ❌ Bad example
function handleUser(user: any, options: any): any {
  // Implementation
}
```

### ✅ Function and Component Design
- [ ] **Pure functions**: Functions don't cause side effects where possible
- [ ] **Function length**: Functions are under 20 lines (exceptions must be justified)
- [ ] **Parameter count**: Functions have 5 or fewer parameters (use objects for more)
- [ ] **Naming**: Uses descriptive names with auxiliary verbs (isLoading, hasError, canEdit)
- [ ] **Return types**: Explicit return types for complex functions

### ✅ Immutability and State Management
- [ ] **Immutable updates**: State updates use spread operators or immutable helpers
- [ ] **No direct mutations**: Arrays and objects are not mutated directly
- [ ] **State placement**: State is placed at the appropriate level (component, context, server)
- [ ] **Side effect management**: useEffect and other side effects are properly managed

```typescript
// ✅ Good - Immutable update
const updatedUser = { ...user, role: newRole };

// ❌ Bad - Direct mutation
user.role = newRole;
```

## Performance Considerations

### ✅ React Performance
- [ ] **Server components**: Default to server components, minimize 'use client'
- [ ] **Memoization**: Expensive calculations use useMemo
- [ ] **Callback optimization**: Event handlers use useCallback appropriately
- [ ] **Component memoization**: Pure components use React.memo when beneficial
- [ ] **Keys for lists**: Dynamic lists have proper key props

### ✅ Bundle Size Management
- [ ] **Tree shaking**: No unnecessary imports or unused code
- [ ] **Dynamic imports**: Large components/libraries are dynamically imported
- [ ] **Image optimization**: Images use Next.js Image component with proper sizing
- [ ] **Third-party libraries**: Only essential libraries are included

### ✅ Network Performance
- [ ] **API efficiency**: Minimize network requests and payload size
- [ ] **Caching strategy**: Appropriate caching headers and strategies implemented
- [ ] **Data fetching**: Server-side data fetching preferred over client-side

## Security Checklist

### ✅ Data Protection
- [ ] **Input validation**: All user inputs are validated and sanitized
- [ ] **Output encoding**: Data is properly escaped when rendered
- [ ] **Authentication**: Protected routes use proper authentication checks
- [ ] **Authorization**: User permissions are verified before access
- [ ] **Sensitive data**: No secrets, keys, or sensitive information in code

### ✅ Security Headers and Practices
- [ ] **XSS prevention**: No dangerouslySetInnerHTML without sanitization
- [ ] **CSRF protection**: Forms implement CSRF protection
- [ ] **Content Security Policy**: CSP headers configured appropriately
- [ ] **Error handling**: Error messages don't expose sensitive information

```typescript
// ✅ Good - Secure implementation
function UserProfile({ user }: { user: User }) {
  if (!user) {
    return <div>Access denied</div>; // Generic message
  }
  
  return <div>{sanitize(user.name)}</div>; // Sanitized output
}

// ❌ Bad - Potential security issue
function UserProfile({ user }: { user: any }) {
  return <div dangerouslySetInnerHTML={{ __html: user.bio }} />; // Unsafe
}
```

## Documentation Requirements

### ✅ Code Documentation
- [ ] **Complex logic**: Business logic is commented and explained
- [ ] **JSDoc comments**: Exported functions have JSDoc documentation
- [ ] **Interface documentation**: Complex interfaces are documented
- [ ] **README updates**: Project README is updated if functionality changes
- [ ] **API documentation**: New API endpoints are documented

### ✅ Architectural Documentation
- [ ] **Decision records**: Architectural decisions are documented (ADRs)
- [ ] **Pattern justification**: New patterns are explained and justified
- [ ] **Breaking changes**: Breaking changes are documented and communicated

## Testing Verification

### ✅ Test Coverage
- [ ] **Unit tests**: New functions have appropriate unit tests
- [ ] **Component tests**: New components have rendering and interaction tests
- [ ] **Integration tests**: User flows are covered by integration tests
- [ ] **Edge cases**: Error conditions and edge cases are tested
- [ ] **Test data**: Tests use realistic, representative data

### ✅ Test Quality
- [ ] **Test names**: Tests have descriptive names explaining what they verify
- [ ] **Arrange-Act-Assert**: Tests follow clear AAA pattern
- [ ] **Isolation**: Tests are independent and can run in any order
- [ ] **Mocking**: External dependencies are properly mocked
- [ ] **Performance**: Tests run quickly and don't timeout

```typescript
// ✅ Good test example
describe('UserProfile Component', () => {
  it('should display user information when user is provided', () => {
    // Arrange
    const mockUser = createMockUser({ name: 'John Doe', role: 'Curator' });
    
    // Act
    render(<UserProfile user={mockUser} />);
    
    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Curator')).toBeInTheDocument();
  });
  
  it('should show access denied when user is null', () => {
    render(<UserProfile user={null} />);
    expect(screen.getByText('Access denied')).toBeInTheDocument();
  });
});
```

## Accessibility Compliance

### ✅ WCAG Compliance
- [ ] **Semantic HTML**: Proper HTML5 semantic elements used
- [ ] **ARIA labels**: Interactive elements have proper ARIA labels
- [ ] **Keyboard navigation**: All interactive elements are keyboard accessible
- [ ] **Screen reader**: Content is compatible with screen readers
- [ ] **Color contrast**: Text meets WCAG AA contrast requirements

### ✅ Accessibility Testing
- [ ] **Manual testing**: Keyboard-only navigation tested
- [ ] **Screen reader testing**: Content tested with screen reader
- [ ] **Automated testing**: Accessibility linting rules pass
- [ ] **Focus management**: Focus states are visible and logical

## Commit Message Standards

### ✅ Commit Message Format
Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Examples**:
```
feat(auth): add role-based access control for user dashboard
fix(events): resolve date formatting issue in EventCard component  
refactor(components): extract common button styles to reusable component
docs(api): update authentication endpoint documentation
```

### ✅ Commit Content Standards
- [ ] **Atomic commits**: Each commit represents one logical change
- [ ] **Clear description**: Commit message clearly explains what and why
- [ ] **No work-in-progress**: Commits are complete and functional
- [ ] **Proper attribution**: Co-authored commits properly attributed

## Quality Gates

### ✅ Required Passing Criteria
All of these must pass before code can be merged:

1. **Automated Tests**: All CI/CD pipeline checks pass
2. **Code Review**: At least one senior developer approval
3. **Performance**: No performance regression detected
4. **Security**: Security scan passes without critical issues
5. **Accessibility**: Accessibility checks pass
6. **Documentation**: Required documentation is updated

### ✅ Recommended Quality Checks
- [ ] **Code coverage**: Maintain or improve code coverage percentage
- [ ] **Bundle size**: No significant increase in bundle size without justification
- [ ] **Performance metrics**: Core Web Vitals remain within acceptable ranges
- [ ] **Lighthouse score**: Performance score doesn't decrease

## Exception Handling

### When to Request Review for Exceptions
If any checklist item cannot be satisfied, the following process must be followed:

1. **Document the exception**: Explain why the standard cannot be met
2. **Risk assessment**: Evaluate the impact and risks
3. **Alternative measures**: Propose alternative quality measures
4. **Approval process**: Get explicit approval from senior developer/architect
5. **Technical debt**: Create tracking issue for future resolution

### Common Acceptable Exceptions
- **Performance optimizations**: May require more complex code structures
- **Third-party integrations**: May require specific patterns or compromises
- **Legacy compatibility**: May require maintaining older patterns temporarily
- **Prototype/POC work**: May have relaxed requirements with explicit timeline

## Tools and Automation

### Recommended Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting consistency
- **TypeScript**: Type checking and safety
- **Husky**: Git hooks for pre-commit checks
- **Lighthouse CI**: Performance monitoring
- **Jest/Testing Library**: Testing framework

### IDE Setup Recommendations
- **VS Code extensions**: ESLint, Prettier, TypeScript, Accessibility
- **Editor settings**: Format on save, show lint errors, enable type checking
- **Snippets**: Use provided code snippets for common patterns

---

**Remember**: This checklist is a living document. Update it as new patterns emerge and standards evolve. Quality is everyone's responsibility!

*This checklist works in conjunction with [Frontend Development Rules](frontend-development-rules.md) and [Architecture Best Practices](architecture-best-practices.md) to ensure comprehensive code quality.*