# Observability Standards

This document establishes **mandatory** observability patterns for logging, monitoring, metrics, and debugging in this Next.js application. Proper observability is critical for production reliability, debugging, and performance optimization.

## Table of Contents

1. [Observability Philosophy](#observability-philosophy)
2. [Structured Logging](#structured-logging)
3. [Error Monitoring](#error-monitoring)
4. [Performance Metrics](#performance-metrics)
5. [User Analytics](#user-analytics)
6. [Health Checks](#health-checks)
7. [Debugging Support](#debugging-support)
8. [Monitoring Dashboards](#monitoring-dashboards)
9. [Alerting Strategies](#alerting-strategies)
10. [Production Debugging](#production-debugging)

## Observability Philosophy

### Core Principles

**Rule**: Every application event should be observable, measurable, and actionable.

```typescript
// ✅ Observability requirements
// 1. Structured logging with consistent format
// 2. Comprehensive error tracking
// 3. Performance metrics collection
// 4. User behavior analytics
// 5. System health monitoring
// 6. Real-time alerting
// 7. Debugging context preservation

interface ObservabilityEvent {
  readonly timestamp: string;
  readonly level: 'info' | 'warn' | 'error' | 'debug';
  readonly message: string;
  readonly context: Record<string, unknown>;
  readonly traceId?: string;
  readonly userId?: string;
  readonly sessionId?: string;
}
```

### Three Pillars of Observability

1. **Logs**: Detailed event records for debugging
2. **Metrics**: Quantitative measurements for monitoring
3. **Traces**: Request flow tracking for performance analysis

## Structured Logging

### Logger Implementation

**Rule**: All logging must use structured format with consistent schema.

```typescript
// ✅ Centralized logging service
export interface LogContext {
  readonly [key: string]: unknown;
  readonly userId?: string;
  readonly sessionId?: string;
  readonly requestId?: string;
  readonly userAgent?: string;
  readonly ip?: string;
  readonly path?: string;
  readonly method?: string;
  readonly duration?: number;
  readonly statusCode?: number;
  readonly error?: {
    readonly name: string;
    readonly message: string;
    readonly stack?: string;
    readonly code?: string;
  };
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  metric(name: string, value: number, context?: LogContext): void;
}

class ApplicationLogger implements Logger {
  private baseContext: LogContext = {};
  
  constructor(baseContext: LogContext = {}) {
    this.baseContext = {
      ...baseContext,
      sessionId: this.generateSessionId(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown'
    };
  }
  
  debug(message: string, context: LogContext = {}): void {
    this.log('debug', message, context);
  }
  
  info(message: string, context: LogContext = {}): void {
    this.log('info', message, context);
  }
  
  warn(message: string, context: LogContext = {}): void {
    this.log('warn', message, context);
  }
  
  error(message: string, context: LogContext = {}): void {
    this.log('error', message, context);
  }
  
  metric(name: string, value: number, context: LogContext = {}): void {
    this.log('info', `Metric: ${name}`, {
      ...context,
      metricName: name,
      metricValue: value,
      metricType: 'gauge'
    });
  }
  
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, context: LogContext): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.baseContext,
      ...context,
      traceId: this.getCurrentTraceId()
    };
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warn' ? console.warn : 
                           level === 'debug' ? console.debug : console.log;
      consoleMethod(`[${level.toUpperCase()}] ${message}`, logEntry);
    }
    
    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(logEntry);
    }
    
    // Store in local storage for debugging (limited)
    this.storeLocalLog(logEntry);
  }
  
  private generateSessionId(): string {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('app-session-id');
      if (stored) return stored;
      
      const newId = crypto.randomUUID();
      sessionStorage.setItem('app-session-id', newId);
      return newId;
    }
    return crypto.randomUUID();
  }
  
  private getCurrentTraceId(): string | undefined {
    // Implementation would depend on tracing system
    if (typeof window !== 'undefined') {
      return (window as any).__traceId__;
    }
    return undefined;
  }
  
  private async sendToLoggingService(logEntry: any): Promise<void> {
    try {
      // Example: Send to external service (DataDog, LogRocket, etc.)
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      // Never throw from logging - it should be fire-and-forget
      console.error('Failed to send log to service:', error);
    }
  }
  
  private storeLocalLog(logEntry: any): void {
    try {
      if (typeof window === 'undefined') return;
      
      const logs = JSON.parse(localStorage.getItem('app-debug-logs') || '[]');
      logs.push(logEntry);
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app-debug-logs', JSON.stringify(logs));
    } catch (error) {
      // Ignore localStorage errors
    }
  }
}

// ✅ Global logger instance
export const logger = new ApplicationLogger();

// ✅ Domain-specific loggers
export const authLogger = new ApplicationLogger({ domain: 'auth' });
export const apiLogger = new ApplicationLogger({ domain: 'api' });
export const uiLogger = new ApplicationLogger({ domain: 'ui' });
```

### Logging Integration Patterns

```typescript
// ✅ Service layer logging
class UserService {
  private logger = new ApplicationLogger({ service: 'UserService' });
  
  async fetchUser(userId: string): Promise<Result<User, string>> {
    const startTime = performance.now();
    
    this.logger.info('Fetching user', { userId, operation: 'fetchUser' });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const duration = performance.now() - startTime;
      
      if (!response.ok) {
        this.logger.warn('User fetch failed', {
          userId,
          statusCode: response.status,
          statusText: response.statusText,
          duration
        });
        return createErrorResult(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const userData = await response.json();
      
      this.logger.info('User fetched successfully', {
        userId,
        duration,
        userRole: userData.role
      });
      
      this.logger.metric('user_fetch_duration', duration, { userId });
      
      return createSuccessResult(userData);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.logger.error('User fetch error', {
        userId,
        duration,
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      return createErrorResult('Failed to fetch user');
    }
  }
}

// ✅ Component logging
interface EventListProps {
  readonly userId?: string;
}

function EventList({ userId }: EventListProps) {
  const componentLogger = useMemo(() => 
    new ApplicationLogger({ component: 'EventList', userId }), [userId]
  );
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadEvents = useCallback(async () => {
    const startTime = performance.now();
    
    componentLogger.info('Loading events', { userId });
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchEvents(userId);
      const duration = performance.now() - startTime;
      
      if (result.length === 0) {
        componentLogger.warn('No events found', { userId, duration });
      } else {
        componentLogger.info('Events loaded successfully', {
          userId,
          eventCount: result.length,
          duration
        });
      }
      
      setEvents(result);
      
      componentLogger.metric('events_load_duration', duration, {
        userId,
        eventCount: result.length
      });
      
    } catch (error) {
      const duration = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      componentLogger.error('Failed to load events', {
        userId,
        duration,
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, componentLogger]);
  
  useEffect(() => {
    componentLogger.debug('Component mounted', { userId });
    loadEvents();
    
    return () => {
      componentLogger.debug('Component unmounted', { userId });
    };
  }, [loadEvents, componentLogger]);
  
  // Component render logic...
}

// ✅ API route logging
// app/api/users/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  apiLogger.info('API request received', {
    requestId,
    path: `/api/users/${params.id}`,
    method: 'GET',
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || 'unknown'
  });
  
  try {
    // API implementation
    const user = await getUserById(params.id);
    const duration = performance.now() - startTime;
    
    if (!user) {
      apiLogger.warn('User not found', {
        requestId,
        userId: params.id,
        duration
      });
      
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    apiLogger.info('API request successful', {
      requestId,
      userId: params.id,
      duration,
      statusCode: 200
    });
    
    apiLogger.metric('api_request_duration', duration, {
      endpoint: '/api/users/[id]',
      method: 'GET',
      statusCode: 200
    });
    
    return NextResponse.json(user);
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('API request failed', {
      requestId,
      userId: params.id,
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Error Monitoring

### Error Tracking Service Integration

```typescript
// ✅ Error tracking service
interface ErrorTrackingService {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: Record<string, unknown>): void;
  setUserContext(user: { id: string; email?: string; role?: string }): void;
  addBreadcrumb(message: string, category: string, data?: Record<string, unknown>): void;
}

class ErrorTracker implements ErrorTrackingService {
  private breadcrumbs: Array<{
    timestamp: string;
    message: string;
    category: string;
    data?: Record<string, unknown>;
  }> = [];
  
  private userContext: { id: string; email?: string; role?: string } | null = null;
  
  captureException(error: Error, context: Record<string, unknown> = {}): void {
    const errorData = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString()
      },
      breadcrumbs: [...this.breadcrumbs],
      user: this.userContext
    };
    
    // Send to error tracking service (Sentry, LogRocket, etc.)
    this.sendToErrorService(errorData);
    
    // Also log to our standard logging
    logger.error('Exception captured', {
      error: errorData.error,
      context: errorData.context
    });
  }
  
  captureMessage(
    message: string, 
    level: 'info' | 'warning' | 'error', 
    context: Record<string, unknown> = {}
  ): void {
    const messageData = {
      timestamp: new Date().toISOString(),
      message,
      level,
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      },
      breadcrumbs: [...this.breadcrumbs],
      user: this.userContext
    };
    
    this.sendToErrorService(messageData);
  }
  
  setUserContext(user: { id: string; email?: string; role?: string }): void {
    this.userContext = user;
  }
  
  addBreadcrumb(message: string, category: string, data?: Record<string, unknown>): void {
    const breadcrumb = {
      timestamp: new Date().toISOString(),
      message,
      category,
      data
    };
    
    this.breadcrumbs.push(breadcrumb);
    
    // Keep only last 50 breadcrumbs
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs.shift();
    }
  }
  
  private async sendToErrorService(data: any): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ErrorTracker]', data);
        return;
      }
      
      // Example integration with error tracking service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Never throw from error tracking
      console.error('Failed to send error to tracking service:', error);
    }
  }
}

export const errorTracker = new ErrorTracker();

// ✅ Global error handlers
export function setupErrorTracking(): void {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.captureException(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      { type: 'unhandledRejection' }
    );
  });
  
  // JavaScript errors
  window.addEventListener('error', (event) => {
    errorTracker.captureException(event.error, {
      type: 'javascriptError',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  // React Error Boundary integration
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('React')) {
      errorTracker.captureMessage(args.join(' '), 'error', {
        type: 'reactError',
        args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
      });
    }
    originalConsoleError.apply(console, args);
  };
}

// ✅ User action tracking
export function trackUserAction(action: string, context?: Record<string, unknown>): void {
  errorTracker.addBreadcrumb(action, 'user-action', context);
  
  logger.info('User action', {
    action,
    ...context,
    timestamp: new Date().toISOString()
  });
}

// Usage in components
function EventCard({ event }: { event: Event }) {
  const handleRegister = useCallback(() => {
    trackUserAction('event-registration-attempt', {
      eventId: event.id,
      eventTitle: event.title
    });
    
    // Registration logic...
  }, [event]);
  
  return (
    <div onClick={handleRegister}>
      {/* Component content */}
    </div>
  );
}
```

## Performance Metrics

### Performance Monitoring

```typescript
// ✅ Performance metrics collection
interface PerformanceMetric {
  readonly name: string;
  readonly value: number;
  readonly unit: 'ms' | 'bytes' | 'count' | 'ratio';
  readonly tags: Record<string, string>;
  readonly timestamp: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  
  recordMetric(name: string, value: number, unit: PerformanceMetric['unit'] = 'ms', tags: Record<string, string> = {}): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      tags,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.push(metric);
    
    // Send to monitoring service
    this.sendMetric(metric);
    
    // Log the metric
    logger.metric(name, value, { unit, tags });
  }
  
  startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return (tags?: Record<string, string>) => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, 'ms', tags);
    };
  }
  
  recordPageLoad(): void {
    if (typeof window === 'undefined') return;
    
    // Core Web Vitals
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, 'ms', {
        page: window.location.pathname
      });
      
      this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms', {
        page: window.location.pathname
      });
      
      this.recordMetric('first_contentful_paint', navigation.loadEventEnd - navigation.fetchStart, 'ms', {
        page: window.location.pathname
      });
    }
    
    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memory_used', memory.usedJSHeapSize, 'bytes');
      this.recordMetric('memory_total', memory.totalJSHeapSize, 'bytes');
    }
  }
  
  recordAPICall(endpoint: string, method: string, duration: number, statusCode: number): void {
    this.recordMetric('api_call_duration', duration, 'ms', {
      endpoint,
      method,
      status: String(statusCode)
    });
    
    this.recordMetric('api_call_count', 1, 'count', {
      endpoint,
      method,
      status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error'
    });
  }
  
  recordComponentRender(componentName: string, duration: number, props?: Record<string, unknown>): void {
    this.recordMetric('component_render_time', duration, 'ms', {
      component: componentName,
      propsCount: props ? String(Object.keys(props).length) : '0'
    });
  }
  
  private async sendMetric(metric: PerformanceMetric): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.info('[Performance]', metric);
        return;
      }
      
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      // Never throw from metrics collection
      console.error('Failed to send metric:', error);
    }
  }
  
  getMetrics(): readonly PerformanceMetric[] {
    return Object.freeze([...this.metrics]);
  }
  
  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// ✅ React performance hooks
export function usePerformanceTracker(componentName: string) {
  const renderStart = useRef<number>(0);
  
  useEffect(() => {
    renderStart.current = performance.now();
  });
  
  useLayoutEffect(() => {
    const renderDuration = performance.now() - renderStart.current;
    performanceMonitor.recordComponentRender(componentName, renderDuration);
  });
  
  const trackAsyncOperation = useCallback((operationName: string) => {
    const timer = performanceMonitor.startTimer(`${componentName}_${operationName}`);
    return timer;
  }, [componentName]);
  
  return { trackAsyncOperation };
}

// ✅ API performance wrapper
export function withPerformanceTracking<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  operationName: string
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const timer = performanceMonitor.startTimer(operationName);
    
    try {
      const result = await fn(...args);
      timer({ status: 'success' });
      return result;
    } catch (error) {
      timer({ status: 'error' });
      throw error;
    }
  };
}

// Usage example
const fetchUserWithTracking = withPerformanceTracking(fetchUser, 'fetch_user_operation');
```

## User Analytics

### User Behavior Tracking

```typescript
// ✅ Privacy-compliant analytics
interface AnalyticsEvent {
  readonly name: string;
  readonly properties: Record<string, string | number | boolean>;
  readonly timestamp: string;
  readonly sessionId: string;
  readonly userId?: string;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private queue: AnalyticsEvent[] = [];
  private flushTimer?: NodeJS.Timeout;
  
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.setupAutoFlush();
  }
  
  setUserId(userId: string): void {
    this.userId = userId;
  }
  
  track(eventName: string, properties: Record<string, string | number | boolean> = {}): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        referrer: typeof document !== 'undefined' ? document.referrer : 'unknown'
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    };
    
    this.queue.push(event);
    
    // Flush immediately for critical events
    if (this.isCriticalEvent(eventName)) {
      this.flush();
    }
  }
  
  page(pageName: string, properties: Record<string, string | number | boolean> = {}): void {
    this.track('page_view', {
      page: pageName,
      ...properties
    });
  }
  
  identify(userId: string, traits: Record<string, string | number | boolean> = {}): void {
    this.setUserId(userId);
    this.track('user_identified', {
      userId,
      ...traits
    });
  }
  
  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return crypto.randomUUID();
    
    const stored = sessionStorage.getItem('analytics-session-id');
    if (stored) return stored;
    
    const newId = crypto.randomUUID();
    sessionStorage.setItem('analytics-session-id', newId);
    return newId;
  }
  
  private isCriticalEvent(eventName: string): boolean {
    const criticalEvents = ['error', 'payment', 'signup', 'login'];
    return criticalEvents.some(critical => eventName.includes(critical));
  }
  
  private setupAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, 30000); // Flush every 30 seconds
    
    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
  }
  
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;
    
    const events = [...this.queue];
    this.queue = [];
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
        keepalive: true // Ensure request completes even if page unloads
      });
    } catch (error) {
      // Re-queue events on failure
      this.queue.unshift(...events);
      console.error('Failed to send analytics:', error);
    }
  }
}

export const analytics = new Analytics();

// ✅ React integration
export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, string | number | boolean>) => {
    analytics.track(eventName, properties);
  }, []);
  
  const trackPageView = useCallback((pageName: string, properties?: Record<string, string | number | boolean>) => {
    analytics.page(pageName, properties);
  }, []);
  
  return { trackEvent, trackPageView };
}

// ✅ Route tracking
export function useRouteTracking() {
  const pathname = usePathname();
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView(pathname, {
      timestamp: new Date().toISOString()
    });
  }, [pathname, trackPageView]);
}

// ✅ Component usage tracking
function EventCard({ event }: { event: Event }) {
  const { trackEvent } = useAnalytics();
  
  const handleClick = useCallback(() => {
    trackEvent('event_card_clicked', {
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date.toISOString()
    });
  }, [event, trackEvent]);
  
  const handleRegister = useCallback(async () => {
    trackEvent('event_registration_started', {
      eventId: event.id
    });
    
    try {
      await registerForEvent(event.id);
      
      trackEvent('event_registration_completed', {
        eventId: event.id,
        success: true
      });
    } catch (error) {
      trackEvent('event_registration_completed', {
        eventId: event.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [event, trackEvent]);
  
  return (
    <div onClick={handleClick}>
      {/* Component content */}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
```

## Health Checks

### System Health Monitoring

```typescript
// ✅ Health check system
interface HealthCheck {
  readonly name: string;
  readonly status: 'healthy' | 'degraded' | 'unhealthy';
  readonly message?: string;
  readonly responseTime: number;
  readonly timestamp: string;
}

interface HealthStatus {
  readonly overall: 'healthy' | 'degraded' | 'unhealthy';
  readonly checks: HealthCheck[];
  readonly uptime: number;
  readonly version: string;
}

class HealthMonitor {
  private checks: Map<string, () => Promise<HealthCheck>> = new Map();
  private startTime = Date.now();
  
  registerCheck(name: string, check: () => Promise<HealthCheck>): void {
    this.checks.set(name, check);
  }
  
  async runChecks(): Promise<HealthStatus> {
    const results: HealthCheck[] = [];
    
    for (const [name, check] of this.checks) {
      try {
        const result = await Promise.race([
          check(),
          this.timeout(name, 5000) // 5 second timeout
        ]);
        results.push(result);
      } catch (error) {
        results.push({
          name,
          status: 'unhealthy',
          message: error instanceof Error ? error.message : 'Check failed',
          responseTime: 5000,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    const overall = this.determineOverallStatus(results);
    
    return {
      overall,
      checks: results,
      uptime: Date.now() - this.startTime,
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown'
    };
  }
  
  private async timeout(checkName: string, ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Health check ${checkName} timed out`)), ms);
    });
  }
  
  private determineOverallStatus(checks: HealthCheck[]): 'healthy' | 'degraded' | 'unhealthy' {
    if (checks.every(check => check.status === 'healthy')) {
      return 'healthy';
    }
    
    if (checks.some(check => check.status === 'unhealthy')) {
      return 'unhealthy';
    }
    
    return 'degraded';
  }
}

export const healthMonitor = new HealthMonitor();

// ✅ Built-in health checks
healthMonitor.registerCheck('database', async (): Promise<HealthCheck> => {
  const start = performance.now();
  
  try {
    // Example database connectivity check
    await fetch('/api/health/database');
    
    return {
      name: 'database',
      status: 'healthy',
      responseTime: performance.now() - start,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: 'database',
      status: 'unhealthy',
      message: 'Database connection failed',
      responseTime: performance.now() - start,
      timestamp: new Date().toISOString()
    };
  }
});

healthMonitor.registerCheck('memory', async (): Promise<HealthCheck> => {
  const start = performance.now();
  
  try {
    const usage = process.memoryUsage();
    const usedMB = usage.heapUsed / 1024 / 1024;
    const totalMB = usage.heapTotal / 1024 / 1024;
    const usagePercent = (usedMB / totalMB) * 100;
    
    let status: HealthCheck['status'] = 'healthy';
    let message: string | undefined;
    
    if (usagePercent > 90) {
      status = 'unhealthy';
      message = `High memory usage: ${usagePercent.toFixed(1)}%`;
    } else if (usagePercent > 70) {
      status = 'degraded';
      message = `Elevated memory usage: ${usagePercent.toFixed(1)}%`;
    }
    
    return {
      name: 'memory',
      status,
      message,
      responseTime: performance.now() - start,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: 'memory',
      status: 'unhealthy',
      message: 'Failed to check memory usage',
      responseTime: performance.now() - start,
      timestamp: new Date().toISOString()
    };
  }
});

// ✅ Health check API endpoint
// app/api/health/route.ts
export async function GET() {
  try {
    const healthStatus = await healthMonitor.runChecks();
    
    const statusCode = healthStatus.overall === 'healthy' ? 200 :
                      healthStatus.overall === 'degraded' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        overall: 'unhealthy',
        checks: [],
        uptime: 0,
        version: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
```

## Debugging Support

### Debug Utilities

```typescript
// ✅ Debug utilities for development and production
class DebugUtils {
  private isDebugMode = process.env.NODE_ENV === 'development' || 
                       (typeof window !== 'undefined' && window.location.search.includes('debug=true'));
  
  log(message: string, data?: any): void {
    if (!this.isDebugMode) return;
    
    console.log(`[DEBUG] ${message}`, data);
  }
  
  group(label: string, fn: () => void): void {
    if (!this.isDebugMode) return;
    
    console.group(`[DEBUG] ${label}`);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  }
  
  table(data: any): void {
    if (!this.isDebugMode) return;
    console.table(data);
  }
  
  time(label: string): void {
    if (!this.isDebugMode) return;
    console.time(`[DEBUG] ${label}`);
  }
  
  timeEnd(label: string): void {
    if (!this.isDebugMode) return;
    console.timeEnd(`[DEBUG] ${label}`);
  }
  
  exportLogs(): string {
    if (typeof window === 'undefined') return '';
    
    const logs = localStorage.getItem('app-debug-logs');
    return logs || '[]';
  }
  
  downloadLogs(): void {
    if (typeof window === 'undefined') return;
    
    const logs = this.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${new Date().toISOString()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  clearLogs(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('app-debug-logs');
  }
  
  getSystemInfo(): Record<string, unknown> {
    return {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
      cookiesEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false,
      onlineStatus: typeof navigator !== 'undefined' ? navigator.onLine : true
    };
  }
}

export const debug = new DebugUtils();

// ✅ React debug hooks
export function useDebugValue<T>(value: T, name: string): T {
  React.useDebugValue(value, (val) => `${name}: ${JSON.stringify(val)}`);
  
  useEffect(() => {
    debug.log(`${name} changed`, value);
  }, [value, name]);
  
  return value;
}

export function useRenderCount(componentName: string): number {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    debug.log(`${componentName} rendered`, { count: renderCount.current });
  });
  
  React.useDebugValue(renderCount.current, (count) => `Renders: ${count}`);
  
  return renderCount.current;
}

// ✅ Debug panel component
function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string>('');
  const [systemInfo, setSystemInfo] = useState<Record<string, unknown>>({});
  
  useEffect(() => {
    if (isOpen) {
      setLogs(debug.exportLogs());
      setSystemInfo(debug.getSystemInfo());
    }
  }, [isOpen]);
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full"
      >
        🐛
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-96 bg-white p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Debug Panel</h2>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Actions</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => debug.downloadLogs()}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Download Logs
                  </button>
                  <button
                    onClick={() => debug.clearLogs()}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">System Info</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(systemInfo, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium">Recent Logs</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
                  {logs}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Add to your app layout
export function AppWithDebugging({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DebugPanel />
    </>
  );
}
```

## Integration Setup

### Initialize Observability

```typescript
// ✅ Observability initialization
export function initializeObservability(): void {
  // Set up error tracking
  setupErrorTracking();
  
  // Set up performance monitoring
  performanceMonitor.recordPageLoad();
  
  // Set up route tracking
  if (typeof window !== 'undefined') {
    // Track initial page load
    analytics.page(window.location.pathname);
    
    // Set up user context if available
    const user = getCurrentUser(); // Your user context
    if (user) {
      analytics.identify(user.id, {
        role: user.role,
        name: user.name
      });
      
      errorTracker.setUserContext({
        id: user.id,
        email: user.email,
        role: user.role
      });
    }
  }
  
  logger.info('Observability initialized', {
    environment: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION
  });
}

// Call in your app startup
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeObservability();
  }, []);
  
  return (
    <html lang="en">
      <body>
        <AppWithDebugging>
          {children}
        </AppWithDebugging>
      </body>
    </html>
  );
}
```

## Enforcement

These observability standards are **mandatory** and must be followed for all code in this project. They will be enforced through:

1. **Code Review**: All new features must include appropriate logging and monitoring
2. **Production Monitoring**: Systems must report health and performance metrics
3. **Error Tracking**: All errors must be properly captured and reported
4. **Performance Budgets**: Performance metrics must meet defined thresholds

Any deviation from these patterns must be explicitly approved and documented with clear reasoning.

---

*This document works in conjunction with [Architecture Best Practices](architecture-best-practices.md), [Error Handling Patterns](error-handling-patterns.md), [Testing Patterns](testing-patterns.md), and [Code Quality Checklist](code-quality-checklist.md) to ensure comprehensive application monitoring and debugging capabilities.*