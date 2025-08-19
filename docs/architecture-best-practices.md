# Architecture Best Practices

This document defines the **mandatory** architectural principles and patterns that must be followed when developing this Next.js application. These practices work in conjunction with the [Frontend Development Rules](frontend-development-rules.md) to ensure clean, modular, reusable, scalable, and maintainable code.

## Table of Contents

1. [SOLID Principles](#solid-principles)
2. [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
3. [Composition Patterns](#composition-patterns)
4. [Dependency Management](#dependency-management)
5. [Immutability & Pure Functions](#immutability--pure-functions)
6. [Interface Design](#interface-design)
7. [Configuration Over Convention](#configuration-over-convention)
8. [Separation of Concerns](#separation-of-concerns)
9. [Command Query Separation](#command-query-separation)
10. [Implementation Examples](#implementation-examples)

## SOLID Principles

### Single Responsibility Principle (SRP)

**Rule**: Each function, component, or module should have exactly one reason to change.

```typescript
// ✅ Good - Single responsibility
function formatUserDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

function validateUserEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getUserPermissions(role: UserRole): string[] {
  return rolePermissions[role] || [];
}

// ❌ Bad - Multiple responsibilities
function handleUserData(user: User): { displayName: string; isValid: boolean; permissions: string[] } {
  // Mixing display formatting, validation, and permission logic
}
```

### Open/Closed Principle (OCP)

**Rule**: Code should be open for extension but closed for modification.

```typescript
// ✅ Good - Extensible through interfaces
interface EventHandler {
  handle(event: AppEvent): Promise<void>;
}

class ClickEventHandler implements EventHandler {
  async handle(event: ClickEvent): Promise<void> {
    // Handle click events
  }
}

class FormSubmitEventHandler implements EventHandler {
  async handle(event: FormSubmitEvent): Promise<void> {
    // Handle form submissions
  }
}

// Event processor is closed for modification but open for extension
class EventProcessor {
  private handlers = new Map<string, EventHandler>();
  
  register(eventType: string, handler: EventHandler): void {
    this.handlers.set(eventType, handler);
  }
  
  async process(event: AppEvent): Promise<void> {
    const handler = this.handlers.get(event.type);
    if (handler) {
      await handler.handle(event);
    }
  }
}
```

### Liskov Substitution Principle (LSP)

**Rule**: Objects should be replaceable with instances of their subtypes without altering correctness.

```typescript
// ✅ Good - Proper abstraction
interface DataProvider<T> {
  fetch(): Promise<T>;
  validate(data: T): boolean;
}

class ApiDataProvider<T> implements DataProvider<T> {
  constructor(private endpoint: string) {}
  
  async fetch(): Promise<T> {
    const response = await fetch(this.endpoint);
    return response.json();
  }
  
  validate(data: T): boolean {
    return data !== null && data !== undefined;
  }
}

class MockDataProvider<T> implements DataProvider<T> {
  constructor(private mockData: T) {}
  
  async fetch(): Promise<T> {
    return Promise.resolve(this.mockData);
  }
  
  validate(data: T): boolean {
    return data !== null && data !== undefined;
  }
}

// Both implementations can be used interchangeably
function useDataProvider<T>(provider: DataProvider<T>) {
  // Works with any implementation
}
```

### Interface Segregation Principle (ISP)

**Rule**: Create focused, specific interfaces rather than large, monolithic ones.

```typescript
// ✅ Good - Focused interfaces
interface UserDisplayData {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

interface UserPermissions {
  readonly canEdit: boolean;
  readonly canDelete: boolean;
  readonly canCreate: boolean;
}

interface UserAuthData {
  readonly token: string;
  readonly refreshToken: string;
  readonly expiresAt: Date;
}

// ❌ Bad - Monolithic interface
interface MassiveUserInterface {
  id: string;
  name: string;
  email: string;
  canEdit: boolean;
  canDelete: boolean;
  token: string;
  // ... many more properties
}
```

### Dependency Inversion Principle (DIP)

**Rule**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

```typescript
// ✅ Good - Dependency inversion
interface Logger {
  log(message: string, level: 'info' | 'warn' | 'error'): void;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}
  
  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        this.logger.log(`User ${id} not found`, 'warn');
        return;
      }
      
      const updatedUser = { ...user, ...updates };
      await this.userRepository.save(updatedUser);
      this.logger.log(`User ${id} updated successfully`, 'info');
    } catch (error) {
      this.logger.log(`Failed to update user ${id}: ${error}`, 'error');
      throw error;
    }
  }
}
```

## Domain-Driven Design (DDD)

### Domain Organization

**Rule**: Organize code around business domains, not technical layers.

```typescript
// ✅ Good - Domain-based organization (current structure)
src/
├── components/
│   ├── blog/           # Blog domain
│   ├── events/         # Events domain
│   ├── nightlife/      # Nightlife domain
│   └── user/           # User management domain
├── lib/
│   ├── auth/           # Authentication domain
│   ├── api/            # API domain
│   └── utils/          # Shared utilities
```

### Domain Models

**Rule**: Create rich domain models that encapsulate business logic.

```typescript
// ✅ Good - Rich domain model
class User {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _role: UserRole,
    private _isActive: boolean = true
  ) {}
  
  static create(email: string, role: UserRole): User {
    if (!User.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    return new User(crypto.randomUUID(), email, role);
  }
  
  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get role(): UserRole { return this._role; }
  get isActive(): boolean { return this._isActive; }
  
  canAccessPath(path: string): boolean {
    return hasAccess(this._role, path);
  }
  
  deactivate(): void {
    this._isActive = false;
  }
  
  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### Aggregate Boundaries

**Rule**: Define clear aggregate boundaries to maintain consistency.

```typescript
// ✅ Good - Event aggregate with clear boundaries
class Event {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _date: Date,
    private _attendees: Set<string> = new Set()
  ) {}
  
  static create(title: string, date: Date): Event {
    if (date <= new Date()) {
      throw new Error('Event date must be in the future');
    }
    return new Event(crypto.randomUUID(), title, date);
  }
  
  addAttendee(userId: string): boolean {
    if (this._attendees.size >= 100) {
      return false; // Event full
    }
    this._attendees.add(userId);
    return true;
  }
  
  removeAttendee(userId: string): boolean {
    return this._attendees.delete(userId);
  }
  
  get attendeeCount(): number {
    return this._attendees.size;
  }
}
```

## Composition Patterns

### Component Composition

**Rule**: Favor composition over inheritance for component architecture.

```typescript
// ✅ Good - Composition pattern (from your current codebase)
interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}

function PageLayout({ children, header, sidebar, footer }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {header && <header>{header}</header>}
      <div className="flex flex-1">
        <main className="flex-1">{children}</main>
        {sidebar && <aside className="w-64">{sidebar}</aside>}
      </div>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}

// Usage with composition
function BlogPage() {
  return (
    <PageLayout
      header={<BlogPageHeader />}
      sidebar={<BlogSidebar />}
      footer={<Footer />}
    >
      <BlogMainContent />
    </PageLayout>
  );
}
```

### Higher-Order Components (HOCs) & Render Props

```typescript
// ✅ Good - HOC for cross-cutting concerns
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// ✅ Good - Render props pattern
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetchData(url).then(setData).catch(setError).finally(() => setLoading(false));
  }, [url]);
  
  return <>{children(data, loading, error)}</>;
}
```

## Dependency Management

### Dependency Injection

**Rule**: Inject dependencies rather than hard-coding them.

```typescript
// ✅ Good - Dependency injection
interface AuthServiceProps {
  authProvider: AuthProvider;
  logger: Logger;
  children: React.ReactNode;
}

function AuthServiceProvider({ authProvider, logger, children }: AuthServiceProps) {
  const [user, setUser] = useState<User | null>(null);
  
  const signIn = useCallback(async (credentials: Credentials) => {
    try {
      const user = await authProvider.authenticate(credentials);
      setUser(user);
      logger.log('User signed in successfully', 'info');
    } catch (error) {
      logger.log(`Sign in failed: ${error}`, 'error');
      throw error;
    }
  }, [authProvider, logger]);
  
  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// ❌ Bad - Hard-coded dependencies
function BadAuthProvider({ children }: { children: React.ReactNode }) {
  const authProvider = new ConcreteAuthProvider(); // Hard-coded
  const logger = new ConsoleLogger(); // Hard-coded
  // ...
}
```

### Service Locator Pattern

```typescript
// ✅ Good - Service locator for dependency management
class ServiceContainer {
  private services = new Map<string, any>();
  
  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }
  
  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not registered`);
    }
    return service;
  }
}

// Usage
const container = new ServiceContainer();
container.register('logger', new ConsoleLogger());
container.register('authProvider', new ApiAuthProvider());

function useService<T>(key: string): T {
  return container.get<T>(key);
}
```

## Immutability & Pure Functions

### Immutable Data Structures

**Rule**: Prefer immutable data structures and avoid mutations.

```typescript
// ✅ Good - Immutable updates (your current pattern)
interface UserState {
  readonly user: User | null;
  readonly loading: boolean;
  readonly error: string | null;
}

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'FETCH_USER_START':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_USER_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: null };
    
    case 'FETCH_USER_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
}
```

### Pure Functions

**Rule**: Prefer pure functions that don't cause side effects.

```typescript
// ✅ Good - Pure functions
function calculateUserPermissions(role: UserRole): readonly string[] {
  return Object.freeze([...rolePermissions[role]]);
}

function formatEventDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// ❌ Bad - Impure function with side effects
let globalCounter = 0;
function impureFunction(input: string): string {
  globalCounter++; // Side effect
  console.log(input); // Side effect
  return input.toUpperCase();
}
```

## Interface Design

### Focused Interfaces

**Rule**: Create small, focused interfaces that serve specific purposes.

```typescript
// ✅ Good - Focused interfaces
interface Identifiable {
  readonly id: string;
}

interface Timestamped {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface Taggable {
  readonly tags: readonly string[];
}

interface Searchable {
  readonly searchableText: string;
}

// Compose interfaces for specific needs
interface BlogPost extends Identifiable, Timestamped, Taggable, Searchable {
  readonly title: string;
  readonly content: string;
  readonly author: string;
}
```

### Generic Interfaces

**Rule**: Use generics to create reusable, type-safe interfaces.

```typescript
// ✅ Good - Generic interfaces
interface Repository<T extends Identifiable> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<readonly T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}

interface CacheProvider<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  invalidate(key: string): Promise<void>;
}

// Usage
class UserRepository implements Repository<User> {
  // Implementation
}

class BlogPostRepository implements Repository<BlogPost> {
  // Implementation
}
```

## Configuration Over Convention

### Configurable Behavior

**Rule**: Make behavior configurable rather than hard-coded.

```typescript
// ✅ Good - Configurable (your current approach)
interface AppConfig {
  readonly auth: {
    readonly roles: readonly UserRole[];
    readonly permissions: Record<UserRole, readonly string[]>;
    readonly sessionTimeout: number;
  };
  readonly api: {
    readonly baseUrl: string;
    readonly timeout: number;
    readonly retryAttempts: number;
  };
  readonly ui: {
    readonly theme: 'light' | 'dark' | 'auto';
    readonly pageSize: number;
    readonly animationsEnabled: boolean;
  };
}

const appConfig: AppConfig = {
  auth: {
    roles: ['Viewer', 'Curator', 'Admin'],
    permissions: rolePermissions,
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  },
  // ... other config
};
```

## Separation of Concerns

### Layer Architecture

**Rule**: Separate different concerns into distinct layers.

```typescript
// ✅ Good - Clear layer separation
// Domain Layer
interface User {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
}

// Service Layer
interface UserService {
  getUserById(id: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
}

// Repository Layer
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

// Presentation Layer
interface UserComponentProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

function UserComponent({ user, onUpdate }: UserComponentProps) {
  // UI logic only
}
```

## Command Query Separation

### Separate Commands and Queries

**Rule**: Separate operations that change state from those that return data.

```typescript
// ✅ Good - Clear separation
// Queries (return data, no side effects)
interface UserQueries {
  getUserById(id: string): Promise<User | null>;
  getUserPermissions(userId: string): Promise<readonly string[]>;
  searchUsers(query: string): Promise<readonly User[]>;
}

// Commands (change state, return void or status)
interface UserCommands {
  createUser(userData: CreateUserData): Promise<string>; // Returns ID
  updateUser(id: string, updates: UpdateUserData): Promise<void>;
  deleteUser(id: string): Promise<void>;
  activateUser(id: string): Promise<void>;
  deactivateUser(id: string): Promise<void>;
}

// Implementation
class UserService implements UserQueries, UserCommands {
  // Query implementations
  async getUserById(id: string): Promise<User | null> {
    // No side effects, just returns data
  }
  
  // Command implementations
  async updateUser(id: string, updates: UpdateUserData): Promise<void> {
    // Changes state, returns void
  }
}
```

## Implementation Examples

### Complete Example: Event Management System

```typescript
// Domain Model
class Event {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _date: Date,
    private readonly _maxAttendees: number,
    private _attendees: Set<string> = new Set()
  ) {}
  
  static create(title: string, date: Date, maxAttendees: number): Event {
    if (date <= new Date()) {
      throw new Error('Event date must be in the future');
    }
    return new Event(crypto.randomUUID(), title, date, maxAttendees);
  }
  
  // Query methods
  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get date(): Date { return new Date(this._date); }
  get attendeeCount(): number { return this._attendees.size; }
  get isFull(): boolean { return this._attendees.size >= this._maxAttendees; }
  
  // Command methods
  addAttendee(userId: string): boolean {
    if (this.isFull || this._attendees.has(userId)) {
      return false;
    }
    this._attendees.add(userId);
    return true;
  }
  
  removeAttendee(userId: string): boolean {
    return this._attendees.delete(userId);
  }
}

// Service Interface
interface EventService {
  // Queries
  getEventById(id: string): Promise<Event | null>;
  getUpcomingEvents(): Promise<readonly Event[]>;
  getUserEvents(userId: string): Promise<readonly Event[]>;
  
  // Commands
  createEvent(eventData: CreateEventData): Promise<string>;
  registerAttendee(eventId: string, userId: string): Promise<boolean>;
  unregisterAttendee(eventId: string, userId: string): Promise<boolean>;
}

// Repository Interface
interface EventRepository {
  findById(id: string): Promise<Event | null>;
  findUpcoming(): Promise<readonly Event[]>;
  save(event: Event): Promise<void>;
}

// Component with Composition
interface EventDetailsProps {
  event: Event;
  currentUser: User;
  onRegister: (eventId: string) => Promise<void>;
  onUnregister: (eventId: string) => Promise<void>;
}

function EventDetails({ event, currentUser, onRegister, onUnregister }: EventDetailsProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const handleRegister = useCallback(async () => {
    setIsRegistering(true);
    try {
      await onRegister(event.id);
    } finally {
      setIsRegistering(false);
    }
  }, [event.id, onRegister]);
  
  return (
    <div className="event-details">
      <EventHeader event={event} />
      <EventContent event={event} />
      <EventActions 
        event={event}
        currentUser={currentUser}
        onRegister={handleRegister}
        onUnregister={() => onUnregister(event.id)}
        isLoading={isRegistering}
      />
    </div>
  );
}
```

## Enforcement

These architectural patterns are **mandatory** and must be followed for all code in this project. They will be enforced through:

1. **Code Review**: All pull requests must demonstrate adherence to these patterns
2. **Documentation**: New components and services must include architectural justification
3. **Testing**: Code must be structured to support comprehensive testing
4. **Automated Checks**: ESLint rules and pre-commit hooks validate compliance

Any deviation from these patterns must be explicitly approved and documented with clear architectural reasoning.

---

*These patterns work in conjunction with the [Frontend Development Rules](frontend-development-rules.md) to create a comprehensive development framework. Update this document as new architectural patterns are adopted.*