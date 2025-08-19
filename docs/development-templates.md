# Development Templates

This document provides **mandatory** code templates that automatically implement the best practices defined in our comprehensive documentation. These templates ensure consistent implementation of SOLID principles, error handling, observability, and testing patterns.

## Table of Contents

1. [Component Templates](#component-templates)
2. [Service Layer Templates](#service-layer-templates)
3. [Utility Function Templates](#utility-function-templates)
4. [API Route Templates](#api-route-templates)
5. [Hook Templates](#hook-templates)
6. [Test Templates](#test-templates)
7. [VS Code Snippets](#vs-code-snippets)

## Component Templates

### Basic Component Template

```typescript
// ✅ Complete component template following all best practices
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/observability';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// 1. Type definitions first
interface ComponentNameProps {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly isDisabled?: boolean;
  readonly onAction?: (data: ActionData) => Promise<void>;
}

interface ActionData {
  readonly id: string;
  readonly value: string;
}

// 2. Main component with error boundary
function ComponentNameInner({ 
  children, 
  className, 
  isDisabled = false,
  onAction
}: ComponentNameProps) {
  // 3. State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 4. Logger with component context
  const componentLogger = useMemo(() => 
    logger.createChildLogger({ component: 'ComponentName' }), []
  );
  
  // 5. Event handlers with proper error handling
  const handleAction = useCallback(async (data: ActionData) => {
    if (isDisabled || !onAction) {
      return;
    }
    
    const startTime = performance.now();
    setLoading(true);
    setError(null);
    
    componentLogger.info('Action started', { actionId: data.id });
    
    try {
      await onAction(data);
      
      const duration = performance.now() - startTime;
      componentLogger.info('Action completed', { 
        actionId: data.id, 
        duration 
      });
      
    } catch (error) {
      const duration = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      componentLogger.error('Action failed', {
        actionId: data.id,
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
  }, [isDisabled, onAction, componentLogger]);
  
  // 6. Effects with cleanup
  useEffect(() => {
    componentLogger.debug('Component mounted');
    
    return () => {
      componentLogger.debug('Component unmounted');
    };
  }, [componentLogger]);
  
  // 7. Loading state
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
        <span className="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    );
  }
  
  // 8. Error state
  if (error) {
    return (
      <div className={cn('p-4 bg-red-50 border border-red-200 rounded-md', className)}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="mt-2 text-sm font-medium text-red-800 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 9. Main render
  return (
    <div className={cn('component-name', className)}>
      {children}
      {/* Component content */}
    </div>
  );
}

// 10. Export with error boundary
export function ComponentName(props: ComponentNameProps) {
  return (
    <ErrorBoundary>
      <ComponentNameInner {...props} />
    </ErrorBoundary>
  );
}

// 11. Default export and display name
ComponentName.displayName = 'ComponentName';
export default ComponentName;
```

### Form Component Template

```typescript
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/observability';
import { validateFormData } from '@/lib/validation';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// 1. Form data and validation types
interface FormData {
  readonly name: string;
  readonly email: string;
  readonly category: string;
}

interface ValidationErrors {
  readonly [K in keyof FormData]?: string;
}

interface FormComponentProps {
  readonly initialData?: Partial<FormData>;
  readonly onSubmit: (data: FormData) => Promise<void>;
  readonly onCancel?: () => void;
  readonly className?: string;
}

// 2. Default form data
const defaultFormData: FormData = {
  name: '',
  email: '',
  category: ''
};

// 3. Form component implementation
function FormComponentInner({
  initialData,
  onSubmit,
  onCancel,
  className
}: FormComponentProps) {
  // State management
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    ...initialData
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formLogger = logger.createChildLogger({ component: 'FormComponent' });
  
  // Update field handler
  const updateField = useCallback(<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  }, [errors]);
  
  // Form submission handler
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    formLogger.info('Form submission started', { formData });
    
    // Validate form data
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      formLogger.warn('Form validation failed', { errors: validationErrors });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      formLogger.info('Form submitted successfully');
      
      // Reset form on success
      setFormData(defaultFormData);
      setErrors({});
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      
      formLogger.error('Form submission failed', {
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      setErrors({ email: errorMessage }); // Show error on first field
      
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, formLogger]);
  
  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          className={cn(
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
            errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>
      
      {/* Similar structure for other fields */}
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export function FormComponent(props: FormComponentProps) {
  return (
    <ErrorBoundary>
      <FormComponentInner {...props} />
    </ErrorBoundary>
  );
}

export default FormComponent;
```

## Service Layer Templates

### Service Class Template

```typescript
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';
import { Result, createSuccessResult, createErrorResult } from '@/lib/result';
import { withRetry } from '@/lib/network';

// 1. Service interface
interface ServiceInterface<T> {
  findById(id: string): Promise<Result<T, string>>;
  findAll(filters?: FilterOptions): Promise<Result<readonly T[], string>>;
  create(data: CreateData<T>): Promise<Result<T, string>>;
  update(id: string, data: UpdateData<T>): Promise<Result<T, string>>;
  delete(id: string): Promise<Result<boolean, string>>;
}

// 2. Type definitions
interface FilterOptions {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
}

type CreateData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateData<T> = Partial<CreateData<T>>;

// 3. Service implementation
export class EntityService<T extends { id: string }> implements ServiceInterface<T> {
  private serviceLogger = logger.createChildLogger({ 
    service: this.constructor.name 
  });
  
  constructor(
    private baseUrl: string,
    private entityName: string
  ) {}
  
  async findById(id: string): Promise<Result<T, string>> {
    const timer = performanceMonitor.startTimer(`${this.entityName}_find_by_id`);
    
    this.serviceLogger.info('Finding entity by ID', { 
      entityName: this.entityName, 
      id 
    });
    
    try {
      // Input validation
      if (!id?.trim()) {
        return createErrorResult('ID is required');
      }
      
      // API call with retry logic
      const response = await withRetry(() => 
        fetch(`${this.baseUrl}/${id}`, {
          headers: { 'Content-Type': 'application/json' }
        })
      );
      
      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        this.serviceLogger.warn('Entity not found', {
          entityName: this.entityName,
          id,
          statusCode: response.status
        });
        return createErrorResult(errorMessage);
      }
      
      const entity = await response.json();
      
      // Validation
      if (!this.isValidEntity(entity)) {
        this.serviceLogger.error('Invalid entity data received', {
          entityName: this.entityName,
          id,
          receivedData: entity
        });
        return createErrorResult('Invalid data received from server');
      }
      
      const duration = timer({ status: 'success' });
      this.serviceLogger.info('Entity found successfully', {
        entityName: this.entityName,
        id,
        duration
      });
      
      return createSuccessResult(entity);
      
    } catch (error) {
      const duration = timer({ status: 'error' });
      
      this.serviceLogger.error('Failed to find entity', {
        entityName: this.entityName,
        id,
        duration,
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      return createErrorResult('Failed to retrieve entity');
    }
  }
  
  async findAll(filters: FilterOptions = {}): Promise<Result<readonly T[], string>> {
    const timer = performanceMonitor.startTimer(`${this.entityName}_find_all`);
    
    this.serviceLogger.info('Finding all entities', {
      entityName: this.entityName,
      filters
    });
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.search) params.set('search', filters.search);
      
      const url = `${this.baseUrl}?${params.toString()}`;
      
      const response = await withRetry(() =>
        fetch(url, {
          headers: { 'Content-Type': 'application/json' }
        })
      );
      
      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        this.serviceLogger.warn('Failed to fetch entities', {
          entityName: this.entityName,
          filters,
          statusCode: response.status
        });
        return createErrorResult(errorMessage);
      }
      
      const data = await response.json();
      const entities = Array.isArray(data) ? data : data.items || [];
      
      // Validate all entities
      const validEntities = entities.filter(entity => this.isValidEntity(entity));
      
      if (validEntities.length !== entities.length) {
        this.serviceLogger.warn('Some entities were invalid and filtered out', {
          entityName: this.entityName,
          totalReceived: entities.length,
          validCount: validEntities.length
        });
      }
      
      const duration = timer({ status: 'success' });
      this.serviceLogger.info('Entities retrieved successfully', {
        entityName: this.entityName,
        count: validEntities.length,
        duration,
        filters
      });
      
      return createSuccessResult(Object.freeze(validEntities));
      
    } catch (error) {
      const duration = timer({ status: 'error' });
      
      this.serviceLogger.error('Failed to find entities', {
        entityName: this.entityName,
        filters,
        duration,
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      return createErrorResult('Failed to retrieve entities');
    }
  }
  
  // Implement other CRUD methods following the same pattern...
  
  // 4. Private validation method
  private isValidEntity(entity: unknown): entity is T {
    return (
      typeof entity === 'object' &&
      entity !== null &&
      'id' in entity &&
      typeof (entity as any).id === 'string'
    );
  }
}

// 5. Factory function for creating services
export function createEntityService<T extends { id: string }>(
  baseUrl: string,
  entityName: string
): EntityService<T> {
  return new EntityService<T>(baseUrl, entityName);
}

// 6. Example usage
export const userService = createEntityService<User>('/api/users', 'user');
export const eventService = createEntityService<Event>('/api/events', 'event');
```

## Utility Function Templates

### Pure Function Template

```typescript
import { logger } from '@/lib/observability';

// 1. Type definitions
interface ProcessOptions {
  readonly retries?: number;
  readonly timeout?: number;
  readonly validateInput?: boolean;
}

interface ProcessResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

// 2. Default options
const defaultOptions: Required<ProcessOptions> = {
  retries: 3,
  timeout: 5000,
  validateInput: true
};

/**
 * Template for pure utility functions with comprehensive error handling
 * 
 * @param input - The input data to process
 * @param options - Processing options
 * @returns Promise with result or error
 */
export async function processUtilityFunction<TInput, TOutput>(
  input: TInput,
  options: ProcessOptions = {}
): Promise<ProcessResult<TOutput>> {
  // 3. Merge options with defaults
  const config = { ...defaultOptions, ...options };
  const utilityLogger = logger.createChildLogger({ 
    utility: 'processUtilityFunction' 
  });
  
  utilityLogger.debug('Processing started', { 
    hasInput: input != null,
    options: config 
  });
  
  try {
    // 4. Input validation
    if (config.validateInput && !isValidInput(input)) {
      utilityLogger.warn('Invalid input provided', { input });
      return {
        success: false,
        error: 'Invalid input data'
      };
    }
    
    // 5. Processing logic (pure function core)
    const result = await performProcessing(input, config);
    
    utilityLogger.debug('Processing completed successfully');
    
    return {
      success: true,
      data: result
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    utilityLogger.error('Processing failed', {
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// 6. Helper functions (keep pure)
function isValidInput<T>(input: T): boolean {
  return input != null;
}

async function performProcessing<TInput, TOutput>(
  input: TInput,
  options: Required<ProcessOptions>
): Promise<TOutput> {
  // Implementation here
  throw new Error('Not implemented');
}

// 7. Synchronous utility template
export function pureUtilityFunction<TInput, TOutput>(
  input: TInput,
  transform: (value: TInput) => TOutput
): TOutput | null {
  const utilityLogger = logger.createChildLogger({ 
    utility: 'pureUtilityFunction' 
  });
  
  try {
    if (input == null) {
      utilityLogger.debug('Null input provided, returning null');
      return null;
    }
    
    const result = transform(input);
    utilityLogger.debug('Transformation completed');
    return result;
    
  } catch (error) {
    utilityLogger.error('Transformation failed', {
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error)
      }
    });
    return null;
  }
}
```

## API Route Templates

### Next.js API Route Template

```typescript
// app/api/[entity]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';
import { validateRequestData } from '@/lib/validation';
import { handleAPIError } from '@/lib/api-utils';

// 1. Request/Response type definitions
interface CreateEntityRequest {
  readonly name: string;
  readonly email: string;
  readonly category: string;
}

interface EntityResponse {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly category: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface ErrorResponse {
  readonly error: string;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
}

// 2. GET handler
export async function GET(
  request: NextRequest,
  context: { params: { entity: string } }
): Promise<NextResponse<EntityResponse[] | ErrorResponse>> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  const { entity } = context.params;
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: `/api/${entity}`,
    method: 'GET'
  });
  
  apiLogger.info('API request received', {
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || 'unknown'
  });
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || undefined;
    
    // Validate parameters
    if (page < 1 || limit < 1 || limit > 100) {
      apiLogger.warn('Invalid pagination parameters', { page, limit });
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }
    
    // Business logic
    const entities = await fetchEntities({ page, limit, search });
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('API request successful', {
      entityCount: entities.length,
      duration,
      statusCode: 200
    });
    
    performanceMonitor.recordAPICall(`/api/${entity}`, 'GET', duration, 200);
    
    return NextResponse.json(entities);
    
  } catch (error) {
    return handleAPIError(error, requestId, apiLogger, startTime);
  }
}

// 3. POST handler
export async function POST(
  request: NextRequest,
  context: { params: { entity: string } }
): Promise<NextResponse<EntityResponse | ErrorResponse>> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  const { entity } = context.params;
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: `/api/${entity}`,
    method: 'POST'
  });
  
  apiLogger.info('API request received');
  
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request data
    const validationResult = validateRequestData<CreateEntityRequest>(
      body,
      createEntitySchema
    );
    
    if (!validationResult.success) {
      apiLogger.warn('Invalid request data', { 
        errors: validationResult.errors 
      });
      
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.errors 
        },
        { status: 400 }
      );
    }
    
    // Business logic
    const newEntity = await createEntity(validationResult.data);
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Entity created successfully', {
      entityId: newEntity.id,
      duration,
      statusCode: 201
    });
    
    performanceMonitor.recordAPICall(`/api/${entity}`, 'POST', duration, 201);
    
    return NextResponse.json(newEntity, { status: 201 });
    
  } catch (error) {
    return handleAPIError(error, requestId, apiLogger, startTime);
  }
}

// 4. Helper functions
async function fetchEntities(options: {
  page: number;
  limit: number;
  search?: string;
}): Promise<EntityResponse[]> {
  // Implementation
  return [];
}

async function createEntity(data: CreateEntityRequest): Promise<EntityResponse> {
  // Implementation
  throw new Error('Not implemented');
}

const createEntitySchema = {
  name: { required: true, type: 'string', minLength: 1 },
  email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  category: { required: true, type: 'string', enum: ['A', 'B', 'C'] }
};
```

## Hook Templates

### Custom Hook Template

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';

// 1. Hook state and options types
interface UseEntityOptions {
  readonly autoFetch?: boolean;
  readonly refetchInterval?: number;
  readonly onError?: (error: Error) => void;
  readonly onSuccess?: (data: EntityData[]) => void;
}

interface UseEntityState {
  readonly data: EntityData[] | null;
  readonly loading: boolean;
  readonly error: string | null;
}

interface UseEntityActions {
  readonly fetch: () => Promise<void>;
  readonly refresh: () => Promise<void>;
  readonly clear: () => void;
}

type UseEntityReturn = UseEntityState & UseEntityActions;

// 2. Default options
const defaultOptions: Required<UseEntityOptions> = {
  autoFetch: true,
  refetchInterval: 0,
  onError: () => {},
  onSuccess: () => {}
};

// 3. Custom hook implementation
export function useEntity(
  entityId: string | null,
  options: UseEntityOptions = {}
): UseEntityReturn {
  // Merge options with defaults
  const config = { ...defaultOptions, ...options };
  
  // State management
  const [state, setState] = useState<UseEntityState>({
    data: null,
    loading: false,
    error: null
  });
  
  // Refs for cleanup and options
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hookLogger = logger.createChildLogger({ 
    hook: 'useEntity', 
    entityId 
  });
  
  // Fetch function with proper error handling
  const fetch = useCallback(async (): Promise<void> => {
    if (!entityId) {
      setState(prev => ({ ...prev, data: null, loading: false, error: null }));
      return;
    }
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const timer = performanceMonitor.startTimer('useEntity_fetch');
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    hookLogger.debug('Fetching entity', { entityId });
    
    try {
      const response = await fetch(`/api/entities/${entityId}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const duration = timer({ status: 'success' });
      
      hookLogger.info('Entity fetched successfully', {
        entityId,
        duration,
        dataLength: Array.isArray(data) ? data.length : 1
      });
      
      setState({ data, loading: false, error: null });
      config.onSuccess(Array.isArray(data) ? data : [data]);
      
    } catch (error) {
      // Don't handle aborted requests as errors
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      const duration = timer({ status: 'error' });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      hookLogger.error('Failed to fetch entity', {
        entityId,
        duration,
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      setState({ data: null, loading: false, error: errorMessage });
      
      if (error instanceof Error) {
        config.onError(error);
      }
    }
  }, [entityId, config, hookLogger]);
  
  // Refresh function (alias for fetch)
  const refresh = useCallback(async (): Promise<void> => {
    await fetch();
  }, [fetch]);
  
  // Clear function
  const clear = useCallback((): void => {
    setState({ data: null, loading: false, error: null });
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    hookLogger.debug('Entity data cleared', { entityId });
  }, [entityId, hookLogger]);
  
  // Auto-fetch on mount and entityId change
  useEffect(() => {
    if (config.autoFetch && entityId) {
      fetch();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [entityId, config.autoFetch, fetch]);
  
  // Set up interval for periodic refetching
  useEffect(() => {
    if (config.refetchInterval > 0 && entityId) {
      intervalRef.current = setInterval(() => {
        if (!state.loading) {
          fetch();
        }
      }, config.refetchInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [config.refetchInterval, entityId, state.loading, fetch]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return {
    ...state,
    fetch,
    refresh,
    clear
  };
}
```

## Test Templates

### Component Test Template

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

// 1. Test data factories
const createMockData = (overrides = {}) => ({
  id: 'test-id',
  name: 'Test Name',
  email: 'test@example.com',
  ...overrides
});

// 2. Mock functions
const mockOnAction = jest.fn();
const mockOnError = jest.fn();

// 3. Test setup
function renderComponent(props = {}) {
  const defaultProps = {
    onAction: mockOnAction,
    onError: mockOnError,
    ...props
  };
  
  return render(<ComponentName {...defaultProps} />);
}

// 4. Test suite
describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Rendering', () => {
    it('should render with default props', () => {
      renderComponent();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    it('should render with custom className', () => {
      const { container } = renderComponent({ className: 'custom-class' });
      expect(container.firstChild).toHaveClass('custom-class');
    });
    
    it('should render children when provided', () => {
      renderComponent({ children: <span>Test Child</span> });
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });
  
  describe('Loading State', () => {
    it('should show loading indicator during async operation', async () => {
      mockOnAction.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderComponent();
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
    
    it('should disable interactions during loading', async () => {
      mockOnAction.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderComponent();
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(button).toBeDisabled();
    });
  });
  
  describe('Error Handling', () => {
    it('should display error message when operation fails', async () => {
      const errorMessage = 'Operation failed';
      mockOnAction.mockRejectedValue(new Error(errorMessage));
      
      renderComponent();
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
    
    it('should call onError callback when error occurs', async () => {
      const error = new Error('Test error');
      mockOnAction.mockRejectedValue(error);
      
      renderComponent();
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(error);
      });
    });
    
    it('should allow error dismissal', async () => {
      mockOnAction.mockRejectedValue(new Error('Test error'));
      
      renderComponent();
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Test error')).toBeInTheDocument();
      });
      
      const dismissButton = screen.getByText(/dismiss/i);
      await userEvent.click(dismissButton);
      
      expect(screen.queryByText('Test error')).not.toBeInTheDocument();
    });
  });
  
  describe('User Interactions', () => {
    it('should call onAction when button is clicked', async () => {
      const testData = createMockData();
      mockOnAction.mockResolvedValue(undefined);
      
      renderComponent({ data: testData });
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(mockOnAction).toHaveBeenCalledWith(testData);
    });
    
    it('should not call onAction when disabled', async () => {
      renderComponent({ isDisabled: true });
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(mockOnAction).not.toHaveBeenCalled();
    });
  });
  
  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderComponent();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });
    
    it('should be keyboard accessible', async () => {
      renderComponent();
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
      
      await userEvent.keyboard('{Enter}');
      expect(mockOnAction).toHaveBeenCalled();
    });
  });
});
```

## VS Code Snippets

Create `.vscode/snippets/typescript-react.json`:

```json
{
  "React Component with Best Practices": {
    "prefix": "rctpl",
    "body": [
      "import React, { useState, useCallback, useEffect, useMemo } from 'react';",
      "import { cn } from '@/lib/utils';",
      "import { logger } from '@/lib/observability';",
      "import { ErrorBoundary } from '@/components/ui/ErrorBoundary';",
      "",
      "interface ${1:ComponentName}Props {",
      "  readonly children?: React.ReactNode;",
      "  readonly className?: string;",
      "  readonly isDisabled?: boolean;",
      "}",
      "",
      "function ${1:ComponentName}Inner({ children, className, isDisabled = false }: ${1:ComponentName}Props) {",
      "  const [loading, setLoading] = useState(false);",
      "  const [error, setError] = useState<string | null>(null);",
      "  ",
      "  const componentLogger = useMemo(() => ",
      "    logger.createChildLogger({ component: '${1:ComponentName}' }), []",
      "  );",
      "  ",
      "  useEffect(() => {",
      "    componentLogger.debug('Component mounted');",
      "    ",
      "    return () => {",
      "      componentLogger.debug('Component unmounted');",
      "    };",
      "  }, [componentLogger]);",
      "  ",
      "  if (loading) {",
      "    return (",
      "      <div className={cn('flex items-center justify-center p-4', className)}>",
      "        <div className=\"animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600\" />",
      "        <span className=\"ml-2 text-sm text-gray-600\">Loading...</span>",
      "      </div>",
      "    );",
      "  }",
      "  ",
      "  if (error) {",
      "    return (",
      "      <div className={cn('p-4 bg-red-50 border border-red-200 rounded-md', className)}>",
      "        <p className=\"text-sm text-red-700\">{error}</p>",
      "        <button onClick={() => setError(null)} className=\"mt-2 text-sm font-medium text-red-800\">",
      "          Dismiss",
      "        </button>",
      "      </div>",
      "    );",
      "  }",
      "  ",
      "  return (",
      "    <div className={cn('${2:component-styles}', className)}>",
      "      {children}",
      "      $0",
      "    </div>",
      "  );",
      "}",
      "",
      "export function ${1:ComponentName}(props: ${1:ComponentName}Props) {",
      "  return (",
      "    <ErrorBoundary>",
      "      <${1:ComponentName}Inner {...props} />",
      "    </ErrorBoundary>",
      "  );",
      "}",
      "",
      "${1:ComponentName}.displayName = '${1:ComponentName}';",
      "export default ${1:ComponentName};"
    ],
    "description": "Create a React component with comprehensive best practices"
  },
  
  "Service Class Template": {
    "prefix": "srvtpl",
    "body": [
      "import { logger } from '@/lib/observability';",
      "import { performanceMonitor } from '@/lib/performance';",
      "import { Result, createSuccessResult, createErrorResult } from '@/lib/result';",
      "",
      "interface ${1:Entity} {",
      "  readonly id: string;",
      "  $2",
      "}",
      "",
      "export class ${1:Entity}Service {",
      "  private serviceLogger = logger.createChildLogger({ service: '${1:Entity}Service' });",
      "  ",
      "  constructor(private baseUrl: string) {}",
      "  ",
      "  async findById(id: string): Promise<Result<${1:Entity}, string>> {",
      "    const timer = performanceMonitor.startTimer('${1:Entity}_find_by_id');",
      "    ",
      "    this.serviceLogger.info('Finding ${1:Entity} by ID', { id });",
      "    ",
      "    try {",
      "      if (!id?.trim()) {",
      "        return createErrorResult('ID is required');",
      "      }",
      "      ",
      "      const response = await fetch(`\\${this.baseUrl}/\\${id}`);",
      "      ",
      "      if (!response.ok) {",
      "        return createErrorResult(`HTTP \\${response.status}: \\${response.statusText}`);",
      "      }",
      "      ",
      "      const entity = await response.json();",
      "      const duration = timer({ status: 'success' });",
      "      ",
      "      this.serviceLogger.info('${1:Entity} found successfully', { id, duration });",
      "      ",
      "      return createSuccessResult(entity);",
      "      ",
      "    } catch (error) {",
      "      const duration = timer({ status: 'error' });",
      "      ",
      "      this.serviceLogger.error('Failed to find ${1:Entity}', {",
      "        id,",
      "        duration,",
      "        error: {",
      "          name: error instanceof Error ? error.name : 'Unknown',",
      "          message: error instanceof Error ? error.message : String(error)",
      "        }",
      "      });",
      "      ",
      "      return createErrorResult('Failed to retrieve ${1:Entity}');",
      "    }",
      "  }",
      "  ",
      "  $0",
      "}",
      "",
      "export const ${2:${1:Entity/camelcase}}Service = new ${1:Entity}Service('/api/${1:Entity/downcase}s');"
    ],
    "description": "Create a service class with comprehensive error handling and observability"
  }
}
```

## Usage Guidelines

### When to Use Templates

1. **Always use component template** when creating new React components
2. **Always use service template** when creating new API interaction layers
3. **Always use test template** when adding comprehensive test coverage
4. **Use utility template** for pure functions that need error handling
5. **Use API route template** for all Next.js API routes

### Customization Notes

- Replace placeholder names with actual component/service names
- Modify validation logic based on actual data requirements
- Add domain-specific business logic while maintaining the error handling structure
- Extend logging context with domain-specific information
- Customize error messages for user-facing components

These templates ensure that every piece of code automatically follows the best practices we've established, making it impossible to accidentally skip important patterns like error handling, observability, or proper typing.

---

*These templates work in conjunction with all other documentation to ensure consistent, high-quality code across the entire application.*