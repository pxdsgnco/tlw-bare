/**
 * Custom hooks for event data fetching and management
 * 
 * These hooks provide a clean interface for components to interact with
 * the events API, handling loading states, errors, and caching.
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type {
  Event,
  EventFilters,
  EventListResponse,
  EventDetailResponse,
  EventCategory
} from '@/lib/types/events';

// =============================================
// FETCH UTILITIES
// =============================================

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// =============================================
// EVENT LIST HOOK
// =============================================

interface UseEventsOptions {
  filters?: EventFilters;
  autoFetch?: boolean;
}

interface UseEventsReturn {
  events: Event[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setFilters: (filters: EventFilters) => void;
  setPage: (page: number) => void;
}

export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
  const { filters: initialFilters = {}, autoFetch = true } = options;
  
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query string
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      
      const response = await fetchAPI<EventListResponse>(
        `/api/events?${params.toString()}`
      );
      
      setEvents(response.events);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);
  
  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);
  
  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [fetchEvents, autoFetch]);
  
  return {
    events,
    total,
    totalPages,
    currentPage: filters.page || 1,
    isLoading,
    error,
    refetch: fetchEvents,
    setFilters,
    setPage
  };
}

// =============================================
// FEATURED EVENTS HOOK
// =============================================

interface UseFeaturedEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFeaturedEvents(limit: number = 6): UseFeaturedEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchFeaturedEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchAPI<{ events: Event[] }>(
        `/api/events/featured?limit=${limit}`
      );
      
      setEvents(response.events);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch featured events'));
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);
  
  useEffect(() => {
    fetchFeaturedEvents();
  }, [fetchFeaturedEvents]);
  
  return {
    events,
    isLoading,
    error,
    refetch: fetchFeaturedEvents
  };
}

// =============================================
// UPCOMING EVENTS HOOK
// =============================================

interface UseUpcomingEventsReturn {
  events: Event[];
  featuredCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUpcomingEvents(limit: number = 8): UseUpcomingEventsReturn {
  // Use the main events hook with appropriate filters for upcoming events
  const today = new Date().toISOString().split('T')[0];
  
  const { 
    events, 
    isLoading, 
    error, 
    refetch 
  } = useEvents({
    filters: {
      date_from: today,
      sort_by: 'date',
      sort_order: 'asc',
      limit
    },
    autoFetch: true
  });
  
  // Count featured events
  const featuredCount = events.filter(e => e.is_featured).length;
  
  return {
    events,
    featuredCount,
    isLoading,
    error,
    refetch
  };
}

// =============================================
// SINGLE EVENT HOOK
// =============================================

interface UseEventReturn {
  event: Event | null;
  similarEvents: Event[];
  venueEvents: Event[];
  isBookmarked: boolean;
  hasClicked: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useEvent(slug: string): UseEventReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [venueEvents, setVenueEvents] = useState<Event[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchEvent = useCallback(async () => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchAPI<EventDetailResponse>(
        `/api/events/${slug}`
      );
      
      setEvent(response.event);
      setSimilarEvents(response.similar_events || []);
      setVenueEvents(response.other_events_at_venue || []);
      setIsBookmarked(response.user_context?.is_bookmarked || false);
      setHasClicked(response.user_context?.has_clicked || false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch event'));
      setEvent(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);
  
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);
  
  return {
    event,
    similarEvents,
    venueEvents,
    isBookmarked,
    hasClicked,
    isLoading,
    error,
    refetch: fetchEvent
  };
}

// =============================================
// EVENT CATEGORIES HOOK
// =============================================

interface UseEventCategoriesReturn {
  categories: EventCategory[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useEventCategories(): UseEventCategoriesReturn {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchAPI<{ categories: EventCategory[] }>(
        '/api/events/categories'
      );
      
      setCategories(response.categories);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories
  };
}

// =============================================
// EVENT ACTIONS HOOK
// =============================================

interface UseEventActionsReturn {
  trackClick: (eventSlug: string, clickType?: string) => Promise<void>;
  toggleFeatured: (eventId: string, isFeatured: boolean, priority?: number) => Promise<void>;
  bookmarkEvent: (eventId: string) => Promise<void>;
  unbookmarkEvent: (eventId: string) => Promise<void>;
}

export function useEventActions(): UseEventActionsReturn {
  const router = useRouter();
  
  const trackClick = useCallback(async (
    eventSlug: string,
    clickType: string = 'booking_url'
  ) => {
    try {
      await fetchAPI(`/api/events/${eventSlug}/track-click`, {
        method: 'POST',
        body: JSON.stringify({ click_type: clickType })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  }, []);
  
  const toggleFeatured = useCallback(async (
    eventId: string,
    isFeatured: boolean,
    priority: number = 0
  ) => {
    try {
      await fetchAPI('/api/events/featured', {
        method: 'PATCH',
        body: JSON.stringify({
          event_id: eventId,
          is_featured: isFeatured,
          priority
        })
      });
      
      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
      throw error;
    }
  }, [router]);
  
  const bookmarkEvent = useCallback(async (eventId: string) => {
    try {
      await fetchAPI(`/api/events/${eventId}/bookmark`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to bookmark event:', error);
      throw error;
    }
  }, []);
  
  const unbookmarkEvent = useCallback(async (eventId: string) => {
    try {
      await fetchAPI(`/api/events/${eventId}/bookmark`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to unbookmark event:', error);
      throw error;
    }
  }, []);
  
  return {
    trackClick,
    toggleFeatured,
    bookmarkEvent,
    unbookmarkEvent
  };
}