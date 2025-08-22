import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';
import { z } from 'zod';
import type { EventListResponse } from '@/lib/types/events';

// Validation schema for query parameters
const EventFiltersSchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  time_filter: z.enum(['DAY', 'NIGHT', 'ALL']).optional(),
  price_min: z.coerce.number().min(0).optional(),
  price_max: z.coerce.number().min(0).optional(),
  price_tier: z.enum(['FREE', 'LOW', 'MEDIUM', 'HIGH']).optional(),
  area: z.string().optional(),
  venue_id: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
  is_featured: z.coerce.boolean().optional(),
  search_query: z.string().optional(),
  sort_by: z.enum(['date', 'price', 'popularity', 'featured', 'created_at']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12)
});

// Validation schema for creating events
const CreateEventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  content: z.string().optional(),
  event_date: z.string(),
  start_time: z.string(),
  end_time: z.string().optional(),
  price: z.number().min(0).optional(),
  currency: z.string().default('NGN'),
  price_tier: z.enum(['FREE', 'LOW', 'MEDIUM', 'HIGH']),
  booking_url: z.string().url().optional().nullable(),
  booking_platform: z.string().optional(),
  venue_id: z.string().uuid().optional().nullable(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  area: z.string().optional(),
  category_id: z.string().uuid(),
  capacity: z.number().positive().optional(),
  age_restriction: z.enum(['All Ages', 'Family Friendly', '13+', '16+', '18+', '21+']).default('All Ages'),
  dress_code: z.string().optional(),
  featured_image: z.string().url(),
  gallery_images: z.array(z.string().url()).optional(),
  video_url: z.string().url().optional(),
  organizer_id: z.string().uuid(),
  meta_title: z.string().max(160).optional(),
  meta_description: z.string().max(255).optional(),
  meta_keywords: z.string().optional()
});

/**
 * GET /api/events
 * Fetch events with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: '/api/events',
    method: 'GET'
  });
  
  apiLogger.info('Events API request received');
  
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const filters = EventFiltersSchema.parse(searchParams);
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Build the query
    let query = supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        organizer:event_organizers(*),
        venue:venues(*),
        tags:event_tag_relations(
          tag:event_tags(*)
        )
      `, { count: 'exact' })
      .eq('status', 'published');
    
    // Apply filters
    if (filters.date_from) {
      query = query.gte('event_date', filters.date_from);
    }
    
    if (filters.date_to) {
      query = query.lte('event_date', filters.date_to);
    }
    
    if (filters.time_filter && filters.time_filter !== 'ALL') {
      query = query.eq('time_type', filters.time_filter);
    }
    
    if (filters.price_min !== undefined) {
      query = query.gte('price', filters.price_min);
    }
    
    if (filters.price_max !== undefined) {
      query = query.lte('price', filters.price_max);
    }
    
    if (filters.price_tier) {
      query = query.eq('price_tier', filters.price_tier);
    }
    
    if (filters.area) {
      query = query.eq('area', filters.area);
    }
    
    if (filters.venue_id) {
      query = query.eq('venue_id', filters.venue_id);
    }
    
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    
    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }
    
    // Apply search
    if (filters.search_query) {
      const searchTerm = `%${filters.search_query}%`;
      query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm},venue_name.ilike.${searchTerm}`);
    }
    
    // Apply sorting
    const sortBy = filters.sort_by || 'date';
    const sortOrder = filters.sort_order || 'asc';
    
    switch (sortBy) {
      case 'date':
        query = query.order('event_date', { ascending: sortOrder === 'asc' });
        query = query.order('start_time', { ascending: sortOrder === 'asc' });
        break;
      case 'price':
        query = query.order('price', { ascending: sortOrder === 'asc', nullsFirst: sortOrder === 'asc' });
        break;
      case 'popularity':
        query = query.order('view_count', { ascending: sortOrder === 'asc' });
        break;
      case 'featured':
        query = query.order('is_featured', { ascending: false });
        query = query.order('featured_priority', { ascending: true });
        query = query.order('event_date', { ascending: true });
        break;
      case 'created_at':
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
        break;
    }
    
    // Apply pagination
    const { page, limit } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // Execute query
    const { data: events, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    // Transform the data to flatten tags
    const transformedEvents = events?.map(event => ({
      ...event,
      tags: event.tags?.map((tr: any) => tr.tag) || []
    })) || [];
    
    // Prepare response
    const response: EventListResponse = {
      events: transformedEvents,
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
      filters_applied: filters
    };
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Events fetched successfully', {
      count: transformedEvents.length,
      total: count,
      filters,
      duration
    });
    
    performanceMonitor.recordAPICall('/api/events', 'GET', duration, 200);
    
    return NextResponse.json(response);
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Events API request failed', {
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall('/api/events', 'GET', duration, 500);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Create a new event (Curator+ only)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: '/api/events',
    method: 'POST'
  });
  
  apiLogger.info('Create event request received');
  
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Check user authentication and role
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!profile || !['Curator', 'Admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Curator or Admin role required.' },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const eventData = CreateEventSchema.parse(body);
    
    // Generate slug if not provided
    const slug = eventData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now();
    
    // Create event
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        slug,
        created_by: user.id,
        updated_by: user.id,
        status: 'draft', // Always start as draft
        // Calculate price tier if not provided
        price_tier: eventData.price_tier || (
          !eventData.price || eventData.price === 0 ? 'FREE' :
          eventData.price < 5000 ? 'LOW' :
          eventData.price < 15000 ? 'MEDIUM' : 'HIGH'
        )
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Event created successfully', {
      eventId: event.id,
      slug: event.slug,
      duration
    });
    
    performanceMonitor.recordAPICall('/api/events', 'POST', duration, 201);
    
    return NextResponse.json(event, { status: 201 });
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Create event request failed', {
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall('/api/events', 'POST', duration, 500);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}