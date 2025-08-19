# Testing Patterns

This document establishes **mandatory** testing patterns and practices for this Next.js application. Comprehensive testing is essential for maintaining code quality, preventing regressions, and ensuring reliable user experiences.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Pyramid](#testing-pyramid)
3. [Unit Testing Patterns](#unit-testing-patterns)
4. [Component Testing](#component-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Test Data Management](#test-data-management)
8. [Mocking Strategies](#mocking-strategies)
9. [Performance Testing](#performance-testing)
10. [Accessibility Testing](#accessibility-testing)

## Testing Philosophy

### Core Principles

**Rule**: Tests should be reliable, fast, and provide clear feedback about failures.

```typescript
// ✅ Good test characteristics
// 1. Clear test names that describe behavior
// 2. Follow Arrange-Act-Assert pattern
// 3. Test behavior, not implementation
// 4. Independent and isolated
// 5. Fast execution

describe('User permission system', () => {
  it('should grant access to admin users for all paths', () => {
    // Arrange
    const adminUser: User = { id: '1', name: 'Admin', role: 'Admin' };
    const protectedPath = '/user/pages';
    
    // Act
    const canAccess = hasAccess(adminUser.role, protectedPath);
    
    // Assert
    expect(canAccess).toBe(true);
  });
  
  it('should deny access to viewer users for curator paths', () => {
    // Arrange
    const viewerUser: User = { id: '2', name: 'Viewer', role: 'Viewer' };
    const curatorPath = '/user/events';
    
    // Act
    const canAccess = hasAccess(viewerUser.role, curatorPath);
    
    // Assert
    expect(canAccess).toBe(false);
  });
});

// ❌ Bad test patterns
describe('hasAccess function', () => {
  it('should work correctly', () => { // Vague description
    expect(hasAccess('Admin', '/user/pages')).toBe(true); // No arrangement
    expect(hasAccess('Viewer', '/user/events')).toBe(false); // Multiple assertions
    // No clear pattern or explanation
  });
});
```

### Test Coverage Goals

- **Unit Tests**: 90%+ coverage for utilities and business logic
- **Component Tests**: 80%+ coverage for all components
- **Integration Tests**: Cover all major user workflows
- **E2E Tests**: Cover critical business paths

## Testing Pyramid

### Distribution Strategy

```
    /\     E2E Tests (Few)
   /  \    - Critical user journeys
  /    \   - Cross-browser compatibility
 /      \  - Production-like environment
/________\ 
 Integration Tests (Some)
 - Component integration
 - API integration
 - State management

Unit Tests (Many)
- Pure functions
- Business logic
- Utilities
- Individual components
```

## Unit Testing Patterns

### Testing Pure Functions

**Rule**: All utility functions and business logic must have comprehensive unit tests.

```typescript
// ✅ Testing utility functions
describe('formatUserDisplayName', () => {
  it('should format user with both first and last name', () => {
    const user: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'Viewer'
    };
    
    expect(formatUserDisplayName(user)).toBe('John Doe');
  });
  
  it('should handle user with only first name', () => {
    const user: User = {
      id: '1',
      firstName: 'John',
      lastName: '',
      email: 'john@example.com',
      role: 'Viewer'
    };
    
    expect(formatUserDisplayName(user)).toBe('John');
  });
  
  it('should fallback to email username for users without names', () => {
    const user: User = {
      id: '1',
      firstName: '',
      lastName: '',
      email: 'john.smith@example.com',
      role: 'Viewer'
    };
    
    expect(formatUserDisplayName(user)).toBe('john.smith');
  });
  
  it('should return default for null user', () => {
    expect(formatUserDisplayName(null)).toBe('Anonymous User');
  });
  
  it('should return default for undefined user', () => {
    expect(formatUserDisplayName(undefined)).toBe('Anonymous User');
  });
});

// ✅ Testing business logic
describe('Event registration system', () => {
  let event: Event;
  
  beforeEach(() => {
    event = Event.create('Tech Conference', new Date('2024-12-01'), 100);
  });
  
  it('should allow registration when event has capacity', () => {
    const result = event.addAttendee('user-1');
    expect(result).toBe(true);
    expect(event.attendeeCount).toBe(1);
  });
  
  it('should prevent duplicate registrations', () => {
    event.addAttendee('user-1');
    const result = event.addAttendee('user-1');
    
    expect(result).toBe(false);
    expect(event.attendeeCount).toBe(1);
  });
  
  it('should prevent registration when event is full', () => {
    // Fill up the event
    for (let i = 0; i < 100; i++) {
      event.addAttendee(`user-${i}`);
    }
    
    const result = event.addAttendee('user-101');
    expect(result).toBe(false);
    expect(event.attendeeCount).toBe(100);
  });
});
```

### Testing Async Operations

```typescript
// ✅ Testing async functions with proper error handling
describe('fetchUserSafely', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  it('should return user data on successful fetch', async () => {
    const mockUser: User = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Curator'
    };
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser)
    });
    
    const result = await fetchUserSafely('123');
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockUser);
    }
  });
  
  it('should return error result on network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Network error'));
    
    const result = await fetchUserSafely('123');
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Network error');
    }
  });
  
  it('should return error result on HTTP error status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });
    
    const result = await fetchUserSafely('123');
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('HTTP 404');
    }
  });
  
  it('should return error result on invalid data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ invalid: 'data' })
    });
    
    const result = await fetchUserSafely('123');
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Invalid user data');
    }
  });
});

// ✅ Testing with timeouts
describe('API operations with timeout', () => {
  it('should timeout long-running requests', async () => {
    jest.useFakeTimers();
    
    global.fetch = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 15000))
    );
    
    const resultPromise = saveUserProfile('123', { name: 'New Name' });
    
    // Fast-forward time
    jest.advanceTimersByTime(10000);
    
    const result = await resultPromise;
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('timeout');
    }
    
    jest.useRealTimers();
  });
});
```

## Component Testing

### Testing React Components

**Rule**: All components must have tests covering rendering, user interactions, and error states.

```typescript
// ✅ Comprehensive component testing
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Test utilities
function renderWithAuth(component: React.ReactElement, user: User | null = null) {
  const mockAuthContext = {
    user: user || {
      id: '1',
      name: 'Test User',
      role: 'Viewer' as const
    },
    signIn: jest.fn(),
    signOut: jest.fn(),
    loading: false
  };
  
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      {component}
    </AuthContext.Provider>
  );
}

describe('ProtectedRoute Component', () => {
  it('should render children when user has access', () => {
    const adminUser: User = {
      id: '1',
      name: 'Admin User',
      role: 'Admin'
    };
    
    // Mock usePathname to return admin path
    jest.mock('next/navigation', () => ({
      usePathname: () => '/user/pages'
    }));
    
    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      adminUser
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
  
  it('should show access denied when user lacks permission', () => {
    const viewerUser: User = {
      id: '1',
      name: 'Viewer User',
      role: 'Viewer'
    };
    
    // Mock usePathname to return admin path
    jest.mock('next/navigation', () => ({
      usePathname: () => '/user/pages'
    }));
    
    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      viewerUser
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('Viewer')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

// ✅ Testing form components
describe('UserRegistrationForm', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });
  
  it('should render all form fields', () => {
    render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
  
  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.selectOptions(screen.getByLabelText(/role/i), 'Curator');
    
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        role: 'Curator'
      });
    });
  });
  
  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
  
  it('should handle submission errors', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error('Submission failed'));
    
    render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });
  });
});

// ✅ Testing loading and error states
describe('EventList Component', () => {
  it('should show loading state initially', () => {
    render(<EventList />);
    expect(screen.getByText(/loading events/i)).toBeInTheDocument();
  });
  
  it('should show error state when fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));
    
    render(<EventList />);
    
    await waitFor(() => {
      expect(screen.getByText(/unable to load events/i)).toBeInTheDocument();
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });
  
  it('should show empty state when no events', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    });
    
    render(<EventList />);
    
    await waitFor(() => {
      expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    });
  });
  
  it('should render events when loaded successfully', async () => {
    const mockEvents = [
      { id: '1', title: 'Event 1', date: new Date(), attendees: [] },
      { id: '2', title: 'Event 2', date: new Date(), attendees: [] }
    ];
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents)
    });
    
    render(<EventList />);
    
    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });
  
  it('should retry when retry button is clicked', async () => {
    global.fetch = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{ id: '1', title: 'Event 1', date: new Date(), attendees: [] }])
      });
    
    const user = userEvent.setup();
    render(<EventList />);
    
    await waitFor(() => {
      expect(screen.getByText(/unable to load events/i)).toBeInTheDocument();
    });
    
    const retryButton = screen.getByText(/try again/i);
    await user.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
    });
  });
});
```

## Integration Testing

### Testing Component Integration

```typescript
// ✅ Integration tests for related components
describe('Blog Page Integration', () => {
  beforeEach(() => {
    // Mock Next.js router
    jest.mock('next/navigation', () => ({
      usePathname: () => '/blog',
      useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn()
      }),
      useSearchParams: () => new URLSearchParams()
    }));
  });
  
  it('should render complete blog page with all components', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        author: 'Test Author',
        publishedAt: '2024-01-01',
        tags: ['test']
      }
    ];
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ posts: mockPosts, total: 1 })
    });
    
    render(
      <AuthContext.Provider value={{ user: adminUser, signIn: jest.fn(), signOut: jest.fn(), loading: false }}>
        <BlogPage />
      </AuthContext.Provider>
    );
    
    // Verify header renders
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    
    // Verify filters render
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    
    // Verify posts render
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
    
    // Verify pagination renders
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });
  
  it('should update posts when filter changes', async () => {
    const user = userEvent.setup();
    
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ posts: [], total: 0 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ posts: [{ id: '1', title: 'Filtered Post' }], total: 1 })
      });
    
    render(<BlogPage />);
    
    const categoryFilter = screen.getByRole('combobox', { name: /category/i });
    await user.selectOptions(categoryFilter, 'tech');
    
    await waitFor(() => {
      expect(screen.getByText('Filtered Post')).toBeInTheDocument();
    });
    
    // Verify API was called with filter
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('category=tech'),
      expect.any(Object)
    );
  });
});

// ✅ Testing state management integration
describe('User Context Integration', () => {
  it('should update user state across components', async () => {
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      role: 'Curator'
    };
    
    const { rerender } = render(
      <AuthProvider>
        <UserProfile />
        <Navigation />
      </AuthProvider>
    );
    
    // Initially no user
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    
    // Simulate user login
    fireEvent.click(screen.getByText(/sign in/i));
    
    // User should appear in both components
    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.role)).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

### Critical User Journeys

```typescript
// ✅ E2E testing with Playwright (example structure)
import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test('should allow admin to access all pages', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    
    // Login as admin
    await page.fill('[data-testid=email]', 'admin@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    
    // Verify dashboard access
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome, Admin')).toBeVisible();
    
    // Test admin-specific pages
    await page.click('[data-testid=nav-pages]');
    await expect(page).toHaveURL('/user/pages');
    await expect(page.getByText('Page Management')).toBeVisible();
    
    await page.click('[data-testid=nav-blog]');
    await expect(page).toHaveURL('/user/blog');
    await expect(page.getByText('Blog Management')).toBeVisible();
  });
  
  test('should restrict viewer access appropriately', async ({ page }) => {
    // Login as viewer
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'viewer@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    
    // Try to access admin page
    await page.goto('/user/pages');
    await expect(page.getByText('Access Denied')).toBeVisible();
    await expect(page.getByText('Your current role: Viewer')).toBeVisible();
    
    // Verify viewer can access allowed pages
    await page.goto('/user/profile');
    await expect(page.getByText('Profile Settings')).toBeVisible();
  });
});

test.describe('Event Management Flow', () => {
  test('should create and manage events as curator', async ({ page }) => {
    // Login as curator
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'curator@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    
    // Navigate to events management
    await page.click('[data-testid=nav-events]');
    await expect(page).toHaveURL('/user/events');
    
    // Create new event
    await page.click('[data-testid=create-event]');
    await page.fill('[data-testid=event-title]', 'Test Event');
    await page.fill('[data-testid=event-date]', '2024-12-01');
    await page.fill('[data-testid=event-description]', 'Test Description');
    await page.click('[data-testid=save-event]');
    
    // Verify event appears in list
    await expect(page.getByText('Test Event')).toBeVisible();
    
    // Edit event
    await page.click('[data-testid=edit-event-1]');
    await page.fill('[data-testid=event-title]', 'Updated Test Event');
    await page.click('[data-testid=save-event]');
    
    // Verify update
    await expect(page.getByText('Updated Test Event')).toBeVisible();
  });
});
```

## Test Data Management

### Test Data Factories

```typescript
// ✅ Test data factories for consistent test data
interface CreateUserOptions {
  readonly id?: string;
  readonly name?: string;
  readonly email?: string;
  readonly role?: UserRole;
  readonly isActive?: boolean;
}

export function createMockUser(options: CreateUserOptions = {}): User {
  return {
    id: options.id || `user-${Math.random().toString(36).substr(2, 9)}`,
    name: options.name || 'Test User',
    email: options.email || `test-${Date.now()}@example.com`,
    role: options.role || 'Viewer',
    isActive: options.isActive ?? true
  };
}

interface CreateEventOptions {
  readonly id?: string;
  readonly title?: string;
  readonly date?: Date;
  readonly maxAttendees?: number;
  readonly attendees?: string[];
}

export function createMockEvent(options: CreateEventOptions = {}): Event {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  
  return Event.create(
    options.title || 'Test Event',
    options.date || futureDate,
    options.maxAttendees || 50
  );
}

// ✅ Test data builders for complex scenarios
export class UserBuilder {
  private user: Partial<User> = {};
  
  withRole(role: UserRole): UserBuilder {
    this.user.role = role;
    return this;
  }
  
  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }
  
  asAdmin(): UserBuilder {
    return this.withRole('Admin');
  }
  
  asCurator(): UserBuilder {
    return this.withRole('Curator');
  }
  
  asViewer(): UserBuilder {
    return this.withRole('Viewer');
  }
  
  build(): User {
    return createMockUser(this.user);
  }
}

// Usage in tests
describe('Permission tests', () => {
  it('should allow admin access to all routes', () => {
    const admin = new UserBuilder().asAdmin().build();
    expect(hasAccess(admin.role, '/user/pages')).toBe(true);
  });
  
  it('should restrict viewer access to admin routes', () => {
    const viewer = new UserBuilder().asViewer().build();
    expect(hasAccess(viewer.role, '/user/pages')).toBe(false);
  });
});
```

## Mocking Strategies

### Service Mocking

```typescript
// ✅ Mock external dependencies
const mockUserService = {
  fetchUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn()
};

const mockEventService = {
  fetchEvents: jest.fn(),
  createEvent: jest.fn(),
  updateEvent: jest.fn()
};

// ✅ Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn()
  }),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams())
}));

// ✅ Mock API responses
function mockApiResponse<T>(data: T, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  });
}

// ✅ Mock fetch with different scenarios
function setupFetchMock() {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;
  
  return {
    mockSuccess: <T>(data: T) => {
      mockFetch.mockResolvedValue(mockApiResponse(data));
    },
    mockError: (status: number, message: string) => {
      mockFetch.mockResolvedValue(mockApiResponse({ error: message }, status));
    },
    mockNetworkError: () => {
      mockFetch.mockRejectedValue(new TypeError('Network error'));
    },
    mockTimeout: () => {
      mockFetch.mockRejectedValue(new DOMException('Request timed out', 'AbortError'));
    }
  };
}

// Usage in tests
describe('API integration', () => {
  const fetchMock = setupFetchMock();
  
  it('should handle successful API response', async () => {
    const mockUser = createMockUser();
    fetchMock.mockSuccess(mockUser);
    
    const result = await fetchUserSafely('123');
    expect(result.success).toBe(true);
  });
  
  it('should handle network errors', async () => {
    fetchMock.mockNetworkError();
    
    const result = await fetchUserSafely('123');
    expect(result.success).toBe(false);
  });
});
```

## Performance Testing

### Testing Performance Characteristics

```typescript
// ✅ Performance testing utilities
function measurePerformance<T>(operation: () => T, name: string): T {
  const start = performance.now();
  const result = operation();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  
  // Assert performance bounds in tests
  if (process.env.NODE_ENV === 'test') {
    expect(end - start).toBeLessThan(100); // Should complete within 100ms
  }
  
  return result;
}

async function measureAsyncPerformance<T>(
  operation: () => Promise<T>, 
  name: string
): Promise<T> {
  const start = performance.now();
  const result = await operation();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
}

// ✅ Component performance testing
describe('Component Performance', () => {
  it('should render large lists efficiently', () => {
    const largeEventList = Array.from({ length: 1000 }, (_, i) => 
      createMockEvent({ id: `event-${i}`, title: `Event ${i}` })
    );
    
    const renderTime = measurePerformance(() => {
      render(<EventList events={largeEventList} />);
    }, 'Large EventList render');
    
    // Performance assertion
    expect(renderTime).toBeLessThan(200); // Should render within 200ms
  });
  
  it('should handle rapid state updates efficiently', async () => {
    const { result } = renderHook(() => useAsyncData(() => fetchEvents()));
    
    // Simulate rapid updates
    const updateTime = await measureAsyncPerformance(async () => {
      for (let i = 0; i < 10; i++) {
        act(() => {
          // Trigger state update
        });
        await waitFor(() => {});
      }
    }, 'Rapid state updates');
    
    expect(updateTime).toBeLessThan(500);
  });
});
```

## Accessibility Testing

### Automated Accessibility Testing

```typescript
// ✅ Accessibility testing with jest-axe
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should have no accessibility violations in user profile', async () => {
    const { container } = render(
      <UserProfile user={createMockUser()} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have proper keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<UserRegistrationForm onSubmit={jest.fn()} />);
    
    // Test tab navigation
    await user.tab();
    expect(screen.getByLabelText(/email/i)).toHaveFocus();
    
    await user.tab();
    expect(screen.getByLabelText(/name/i)).toHaveFocus();
    
    await user.tab();
    expect(screen.getByLabelText(/role/i)).toHaveFocus();
  });
  
  it('should have proper ARIA labels', () => {
    render(<EventList />);
    
    const eventGrid = screen.getByRole('grid');
    expect(eventGrid).toHaveAttribute('aria-label', 'Events list');
    
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toHaveAttribute('aria-label', 'Loading events');
  });
});

// ✅ Screen reader testing simulation
describe('Screen Reader Compatibility', () => {
  it('should announce form errors properly', async () => {
    const user = userEvent.setup();
    render(<UserRegistrationForm onSubmit={jest.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    const emailError = screen.getByRole('alert');
    expect(emailError).toHaveTextContent('Email is required');
    expect(emailError).toHaveAttribute('aria-live', 'assertive');
  });
});
```

## Test Organization and Structure

### Test File Organization

```
src/
├── __tests__/                 # Global test utilities
│   ├── utils.tsx              # Test utilities
│   ├── mocks.ts               # Mock definitions
│   └── setup.ts               # Test setup
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── forms/
│       ├── UserRegistrationForm.tsx
│       └── UserRegistrationForm.test.tsx
├── lib/
│   ├── auth.ts
│   ├── auth.test.ts
│   ├── utils.ts
│   └── utils.test.ts
└── app/
    └── blog/
        ├── page.tsx
        └── page.test.tsx
```

### Test Configuration

```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/lib/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

## Enforcement

These testing patterns are **mandatory** and must be followed for all code in this project. They will be enforced through:

1. **Code Review**: All new features must include appropriate tests
2. **CI/CD Pipeline**: Tests must pass before merging
3. **Coverage Requirements**: Minimum coverage thresholds must be met
4. **Quality Gates**: No code can be deployed without passing tests

Any deviation from these patterns must be explicitly approved and documented with clear reasoning.

---

*This document works in conjunction with [Architecture Best Practices](architecture-best-practices.md), [Error Handling Patterns](error-handling-patterns.md), and [Code Quality Checklist](code-quality-checklist.md) to ensure comprehensive code quality.*