# Error Handling Patterns

This document establishes **mandatory** error handling patterns and defensive programming practices for this Next.js application. Proper error handling is critical for user experience, debugging, and system reliability.

## Table of Contents

1. [Error Boundary Implementation](#error-boundary-implementation)
2. [Defensive Programming](#defensive-programming)
3. [Type-Safe Error Handling](#type-safe-error-handling)
4. [Async Error Management](#async-error-management)
5. [Form Validation & User Input](#form-validation--user-input)
6. [Network Error Handling](#network-error-handling)
7. [Component Error States](#component-error-states)
8. [Error Logging & Monitoring](#error-logging--monitoring)
9. [Recovery Strategies](#recovery-strategies)
10. [Testing Error Conditions](#testing-error-conditions)

## Error Boundary Implementation

### React Error Boundaries

**Rule**: All page-level components and major feature components must be wrapped with error boundaries.

```typescript
// ✅ Comprehensive Error Boundary
interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
  readonly errorId: string | null;
}

class ErrorBoundary extends Component<
  React.PropsWithChildren<{
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = crypto.randomUUID();
    
    // Log error to monitoring service
    console.error(`[ErrorBoundary:${errorId}]`, error);
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    
    // Report to error monitoring service
    // analytics.captureException(error, { 
    //   errorId: this.state.errorId,
    //   componentStack: errorInfo.componentStack 
    // });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
interface ErrorFallbackProps {
  readonly error: Error;
  readonly resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.498 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              Something went wrong
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>We've encountered an unexpected error. Please try refreshing the page.</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={resetError}
            className="w-full bg-red-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-red-600 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// HOC for wrapping components with error boundaries
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
): React.ComponentType<P> {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
```

### Usage in Your Current Architecture

```typescript
// ✅ Page-level error boundary (update your existing pages)
export default function BlogPage() {
  return (
    <ErrorBoundary 
      fallback={BlogErrorFallback}
      onError={(error) => {
        // Log blog-specific errors
        console.error('[BlogPage]', error);
      }}
    >
      <ProtectedRoute>
        <BlogMainWrapper>
          <BlogPageHeader />
          <BlogMainContent />
        </BlogMainWrapper>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

// ✅ Feature-level error boundary
function BlogMainContent() {
  return (
    <ErrorBoundary fallback={BlogContentErrorFallback}>
      <BlogFilterSection />
      <BlogMainSection />
      <BlogPagination />
    </ErrorBoundary>
  );
}
```

## Defensive Programming

### Input Validation & Null Safety

**Rule**: Always validate inputs and handle null/undefined values defensively.

```typescript
// ✅ Good - Defensive programming
function formatUserDisplayName(user: User | null | undefined): string {
  if (!user) {
    return 'Anonymous User';
  }
  
  const firstName = user.firstName?.trim() || '';
  const lastName = user.lastName?.trim() || '';
  
  if (!firstName && !lastName) {
    return user.email?.split('@')[0] || 'User';
  }
  
  return `${firstName} ${lastName}`.trim();
}

function calculateUserPermissions(role: UserRole | undefined): readonly string[] {
  if (!role || !rolePermissions[role]) {
    return [];
  }
  
  return Object.freeze([...rolePermissions[role]]);
}

// ✅ Safe array operations
function getEventAttendees(event: Event | null): readonly User[] {
  const attendees = event?.attendees;
  
  if (!Array.isArray(attendees)) {
    return [];
  }
  
  return attendees.filter((attendee): attendee is User => 
    attendee != null && typeof attendee === 'object' && 'id' in attendee
  );
}

// ❌ Bad - Unsafe operations
function badFormatName(user: any): string {
  return user.firstName + ' ' + user.lastName; // Potential null/undefined issues
}

function badGetPermissions(role: any): string[] {
  return rolePermissions[role]; // Potential undefined access
}
```

### Type Guards & Runtime Validation

```typescript
// ✅ Type guards for runtime safety
function isValidUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'role' in value &&
    typeof (value as any).id === 'string' &&
    typeof (value as any).email === 'string' &&
    ['Viewer', 'Curator', 'Admin'].includes((value as any).role)
  );
}

function isValidEvent(value: unknown): value is Event {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'date' in value &&
    typeof (value as any).id === 'string' &&
    typeof (value as any).title === 'string' &&
    (value as any).date instanceof Date
  );
}

// ✅ Safe data processing with validation
function processUserData(rawData: unknown): User | null {
  try {
    if (!isValidUser(rawData)) {
      console.warn('[processUserData] Invalid user data received:', rawData);
      return null;
    }
    
    return rawData;
  } catch (error) {
    console.error('[processUserData] Error processing user data:', error);
    return null;
  }
}
```

## Type-Safe Error Handling

### Result Pattern for Error Handling

**Rule**: Use Result pattern for operations that can fail instead of throwing exceptions.

```typescript
// ✅ Result pattern implementation
type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

function createSuccessResult<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function createErrorResult<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// ✅ Safe operations using Result pattern
async function fetchUserSafely(userId: string): Promise<Result<User, string>> {
  try {
    if (!userId?.trim()) {
      return createErrorResult('User ID is required');
    }
    
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      return createErrorResult(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const userData = await response.json();
    
    if (!isValidUser(userData)) {
      return createErrorResult('Invalid user data received from API');
    }
    
    return createSuccessResult(userData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResult(`Failed to fetch user: ${message}`);
  }
}

// ✅ Usage with Result pattern
async function handleUserLoad(userId: string): Promise<void> {
  const result = await fetchUserSafely(userId);
  
  if (!result.success) {
    // Handle error case
    console.error('[handleUserLoad]', result.error);
    showErrorMessage(result.error);
    return;
  }
  
  // Handle success case
  const user = result.data; // Type-safe access
  displayUser(user);
}
```

### Discriminated Unions for Error States

```typescript
// ✅ Discriminated union for component states
type AsyncState<T> = 
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: T }
  | { readonly status: 'error'; readonly error: string };

function useAsyncData<T>(fetcher: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });
  
  useEffect(() => {
    setState({ status: 'loading' });
    
    fetcher()
      .then(data => setState({ status: 'success', data }))
      .catch(error => setState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
  }, [fetcher]);
  
  return state;
}

// ✅ Component using discriminated union
function UserProfile({ userId }: { userId: string }) {
  const userState = useAsyncData(() => fetchUser(userId));
  
  switch (userState.status) {
    case 'idle':
    case 'loading':
      return <div>Loading user...</div>;
      
    case 'error':
      return (
        <div className="text-red-600">
          Error loading user: {userState.error}
        </div>
      );
      
    case 'success':
      return <div>Welcome, {userState.data.name}!</div>;
      
    default:
      // TypeScript ensures this is never reached
      const _exhaustive: never = userState;
      return null;
  }
}
```

## Async Error Management

### Promise Error Handling

**Rule**: All async operations must have proper error handling.

```typescript
// ✅ Good - Comprehensive async error handling
async function saveUserProfile(
  userId: string, 
  profileData: Partial<User>
): Promise<Result<User, string>> {
  try {
    // Input validation
    if (!userId?.trim()) {
      return createErrorResult('User ID is required');
    }
    
    if (!profileData || Object.keys(profileData).length === 0) {
      return createErrorResult('Profile data is required');
    }
    
    // API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return createErrorResult(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }
      
      const updatedUser = await response.json();
      
      if (!isValidUser(updatedUser)) {
        return createErrorResult('Invalid user data received from server');
      }
      
      return createSuccessResult(updatedUser);
      
    } finally {
      clearTimeout(timeoutId);
    }
    
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return createErrorResult('Request timed out');
    }
    
    if (error instanceof TypeError) {
      return createErrorResult('Network error occurred');
    }
    
    const message = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResult(`Failed to save profile: ${message}`);
  }
}

// ✅ React hook with proper error handling
function useAsyncOperation<T, Args extends readonly any[]>(
  operation: (...args: Args) => Promise<Result<T, string>>
) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });
  
  const execute = useCallback(async (...args: Args) => {
    setState({ status: 'loading' });
    
    try {
      const result = await operation(...args);
      
      if (result.success) {
        setState({ status: 'success', data: result.data });
      } else {
        setState({ status: 'error', error: result.error });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      setState({ status: 'error', error: message });
    }
  }, [operation]);
  
  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);
  
  return { state, execute, reset };
}
```

## Form Validation & User Input

### Comprehensive Form Validation

**Rule**: All user inputs must be validated both client-side and server-side.

```typescript
// ✅ Validation schema definition
interface ValidationRule<T> {
  readonly validate: (value: T) => boolean;
  readonly message: string;
}

interface ValidationSchema<T> {
  readonly [K in keyof T]?: readonly ValidationRule<T[K]>[];
}

// ✅ User registration validation
const userRegistrationSchema: ValidationSchema<{
  email: string;
  name: string;
  role: UserRole;
}> = {
  email: [
    {
      validate: (email) => typeof email === 'string' && email.length > 0,
      message: 'Email is required'
    },
    {
      validate: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Please enter a valid email address'
    },
    {
      validate: (email) => email.length <= 254,
      message: 'Email must be less than 255 characters'
    }
  ],
  name: [
    {
      validate: (name) => typeof name === 'string' && name.trim().length > 0,
      message: 'Name is required'
    },
    {
      validate: (name) => name.trim().length >= 2,
      message: 'Name must be at least 2 characters long'
    },
    {
      validate: (name) => name.length <= 100,
      message: 'Name must be less than 100 characters'
    }
  ],
  role: [
    {
      validate: (role) => ['Viewer', 'Curator', 'Admin'].includes(role),
      message: 'Please select a valid role'
    }
  ]
};

// ✅ Validation function
type ValidationErrors<T> = Partial<Record<keyof T, string>>;

function validateData<T>(
  data: T, 
  schema: ValidationSchema<T>
): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};
  
  for (const [field, rules] of Object.entries(schema) as [keyof T, ValidationRule<any>[]][]) {
    const value = data[field];
    
    for (const rule of rules || []) {
      if (!rule.validate(value)) {
        errors[field] = rule.message;
        break; // First error wins
      }
    }
  }
  
  return errors;
}

// ✅ Form component with validation
interface UserRegistrationFormProps {
  readonly onSubmit: (data: { email: string; name: string; role: UserRole }) => Promise<void>;
}

function UserRegistrationForm({ onSubmit }: UserRegistrationFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'Viewer' as UserRole
  });
  
  const [errors, setErrors] = useState<ValidationErrors<typeof formData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate form data
    const validationErrors = validateData(formData, userRegistrationSchema);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({ email: '', name: '', role: 'Viewer' });
      setErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      setErrors({ email: message }); // Show general error on email field
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
            errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>
      
      {/* Similar structure for other fields */}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}
```

## Network Error Handling

### Retry Logic & Circuit Breaker

```typescript
// ✅ Retry with exponential backoff
interface RetryOptions {
  readonly maxRetries: number;
  readonly baseDelay: number;
  readonly maxDelay: number;
  readonly backoffMultiplier: number;
}

async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  }
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === options.maxRetries) {
        break;
      }
      
      // Don't retry on certain error types
      if (error instanceof TypeError || // Network errors
          (error as any).status === 401 || // Unauthorized
          (error as any).status === 403 || // Forbidden
          (error as any).status === 404) { // Not found
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        options.baseDelay * Math.pow(options.backoffMultiplier, attempt),
        options.maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// ✅ Circuit breaker pattern
class CircuitBreaker<T> {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private readonly operation: () => Promise<T>,
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000 // 1 minute
  ) {}
  
  async execute(): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime >= this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await this.operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }
  
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

## Component Error States

### Error State Management in Components

```typescript
// ✅ Component with comprehensive error handling
interface EventListProps {
  readonly userId?: string;
}

function EventList({ userId }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await withRetry(() => fetchEvents(userId));
      
      if (!Array.isArray(result)) {
        throw new Error('Invalid events data received');
      }
      
      setEvents(result.filter(isValidEvent));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load events';
      setError(message);
      
      // Log error for monitoring
      console.error('[EventList] Failed to load events:', { userId, error });
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading events...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Unable to load events</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={loadEvents}
                className="bg-red-100 px-2 py-1 rounded text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0l6 6m-6-6v-10" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first event.</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

## Error Logging & Monitoring

### Structured Error Logging

```typescript
// ✅ Structured logging interface
interface LogContext {
  readonly userId?: string;
  readonly sessionId?: string;
  readonly path?: string;
  readonly userAgent?: string;
  readonly timestamp?: string;
  readonly [key: string]: unknown;
}

interface Logger {
  error(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
}

// ✅ Implementation with multiple transports
class ApplicationLogger implements Logger {
  private context: LogContext = {};
  
  constructor(baseContext: LogContext = {}) {
    this.context = {
      ...baseContext,
      sessionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  }
  
  error(message: string, context: LogContext = {}): void {
    const logEntry = {
      level: 'error',
      message,
      ...this.context,
      ...context,
      timestamp: new Date().toISOString()
    };
    
    // Console logging
    console.error(`[ERROR] ${message}`, logEntry);
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(logEntry);
    }
  }
  
  warn(message: string, context: LogContext = {}): void {
    const logEntry = {
      level: 'warn',
      message,
      ...this.context,
      ...context,
      timestamp: new Date().toISOString()
    };
    
    console.warn(`[WARN] ${message}`, logEntry);
  }
  
  info(message: string, context: LogContext = {}): void {
    const logEntry = {
      level: 'info',
      message,
      ...this.context,
      ...context,
      timestamp: new Date().toISOString()
    };
    
    console.info(`[INFO] ${message}`, logEntry);
  }
  
  private async sendToMonitoringService(logEntry: any): Promise<void> {
    try {
      // Example: Send to external monitoring service
      // await fetch('/api/logging', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
    } catch (error) {
      // Don't throw - logging should never break the application
      console.error('Failed to send log to monitoring service:', error);
    }
  }
}

// ✅ Global error handler
function setupGlobalErrorHandling(): void {
  const logger = new ApplicationLogger({
    userAgent: navigator.userAgent,
    path: window.location.pathname
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      error: event.reason instanceof Error ? event.reason.message : String(event.reason),
      stack: event.reason instanceof Error ? event.reason.stack : undefined
    });
  });
  
  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    logger.error('JavaScript error', {
      message: event.message,
      filename: event.filename,
      lineNumber: event.lineno,
      columnNumber: event.colno,
      stack: event.error?.stack
    });
  });
}
```

## Recovery Strategies

### Graceful Degradation

```typescript
// ✅ Feature with fallback functionality
interface WeatherWidgetProps {
  readonly location: string;
}

function WeatherWidget({ location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  useEffect(() => {
    let cancelled = false;
    
    async function loadWeather() {
      try {
        setError(null);
        setIsUsingFallback(false);
        
        // Try primary weather service
        const primaryResult = await fetchWeatherFromPrimaryService(location);
        
        if (!cancelled) {
          setWeather(primaryResult);
        }
      } catch (primaryError) {
        try {
          // Fallback to secondary service
          const fallbackResult = await fetchWeatherFromFallbackService(location);
          
          if (!cancelled) {
            setWeather(fallbackResult);
            setIsUsingFallback(true);
          }
        } catch (fallbackError) {
          if (!cancelled) {
            setError('Weather data temporarily unavailable');
            // Use cached data if available
            const cachedWeather = getCachedWeather(location);
            if (cachedWeather) {
              setWeather(cachedWeather);
              setIsUsingFallback(true);
            }
          }
        }
      }
    }
    
    loadWeather();
    
    return () => {
      cancelled = true;
    };
  }, [location]);
  
  if (error && !weather) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center text-gray-600">
        <p>{error}</p>
        <p className="text-sm mt-1">Please check back later</p>
      </div>
    );
  }
  
  if (!weather) {
    return <div className="animate-pulse bg-gray-200 h-24 rounded" />;
  }
  
  return (
    <div className="p-4 bg-blue-50 rounded">
      {isUsingFallback && (
        <p className="text-xs text-amber-600 mb-2">
          ⚠️ Using backup weather service
        </p>
      )}
      <h3 className="font-medium">{weather.location}</h3>
      <p className="text-2xl font-bold">{weather.temperature}°</p>
      <p className="text-sm text-gray-600">{weather.description}</p>
    </div>
  );
}
```

## Testing Error Conditions

### Error Testing Patterns

```typescript
// ✅ Testing error conditions
describe('UserService', () => {
  it('should handle network errors gracefully', async () => {
    // Arrange
    const mockFetch = jest.fn().mockRejectedValue(new TypeError('Network error'));
    global.fetch = mockFetch;
    
    // Act
    const result = await fetchUserSafely('user-123');
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toContain('Network error');
  });
  
  it('should handle invalid API responses', async () => {
    // Arrange
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ invalid: 'data' })
    });
    global.fetch = mockFetch;
    
    // Act
    const result = await fetchUserSafely('user-123');
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid user data');
  });
  
  it('should retry failed requests', async () => {
    // Arrange
    const mockOperation = jest.fn()
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValue('success');
    
    // Act
    const result = await withRetry(mockOperation, { maxRetries: 2, baseDelay: 10 });
    
    // Assert
    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalledTimes(2);
  });
});

// ✅ Component error testing
describe('EventList', () => {
  it('should display error message when fetch fails', async () => {
    // Arrange
    const mockFetchEvents = jest.fn().mockRejectedValue(new Error('API Error'));
    
    // Act
    render(<EventList />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/Unable to load events/i)).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
  
  it('should retry when retry button is clicked', async () => {
    // Test retry functionality
  });
});
```

## Enforcement

These error handling patterns are **mandatory** and must be followed for all code in this project. They will be enforced through:

1. **Code Review**: All components must demonstrate proper error handling
2. **Testing**: Error conditions must be tested
3. **Monitoring**: Error logs will be monitored for patterns
4. **Performance**: Error handling should not significantly impact performance

Any deviation from these patterns must be explicitly approved and documented with clear reasoning.

---

*This document works in conjunction with [Architecture Best Practices](architecture-best-practices.md) and [Code Quality Checklist](code-quality-checklist.md) to ensure comprehensive error handling throughout the application.*