import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';
import { z } from 'zod';
import type { EventDetailResponse } from '@/lib/types/events';

// Update event schema
const UpdateEventSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  content: z.string().optional(),
  event_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  currency: z.string().optional(),
  price_tier: z.enum(['FREE', 'LOW', 'MEDIUM', 'HIGH']).optional(),
  booking_url: z.string().url().optional().nullable(),
  booking_platform: z.string().optional().nullable(),
  venue_id: z.string().uuid().optional().nullable(),
  venue_name: z.string().optional().nullable(),
  venue_address: z.string().optional().nullable(),
  area: z.string().optional(),
  category_id: z.string().uuid().optional(),
  capacity: z.number().positive().optional().nullable(),
  age_restriction: z.enum(['All Ages', 'Family Friendly', '13+', '16+', '18+', '21+']).optional(),
  dress_code: z.string().optional().nullable(),
  featured_image: z.string().url().optional(),
  gallery_images: z.array(z.string().url()).optional().nullable(),
  video_url: z.string().url().optional().nullable(),
  organizer_id: z.string().uuid().optional(),
  meta_title: z.string().max(160).optional().nullable(),
  meta_description: z.string().max(255).optional().nullable(),
  meta_keywords: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'cancelled', 'postponed']).optional()
});

/**
 * GET /api/events/[slug]
 * Fetch a single event by slug with related data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  // Await params before using
  const { slug } = await params;
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: `/api/events/${slug}`,
    method: 'GET'
  });
  
  apiLogger.info('Event detail request received', { slug });
  
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Check if user is authenticated (for bookmark status)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch the event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        organizer:event_organizers(*),
        venue:venues(*),
        tags:event_tag_relations(
          tag:event_tags(*)
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Transform tags
    const transformedEvent = {
      ...event,
      tags: event.tags?.map((tr: any) => tr.tag) || []
    };
    
    // Increment view count (fire and forget)
    supabase.rpc('increment_event_view_count', { event_id: event.id })
      .then(() => apiLogger.info('View count incremented'))
      .catch(err => apiLogger.error('Failed to increment view count', { error: err }));
    
    // Fetch similar events (same category, upcoming)
    const { data: similarEvents } = await supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        tags:event_tag_relations(
          tag:event_tags(*)
        )
      `)
      .eq('status', 'published')
      .eq('category_id', event.category_id)
      .neq('id', event.id)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(3);
    
    const transformedSimilarEvents = similarEvents?.map(e => ({
      ...e,
      tags: e.tags?.map((tr: any) => tr.tag) || []
    })) || [];
    
    // Fetch other events at the same venue (if venue exists)
    let otherEventsAtVenue = [];
    if (event.venue_id) {
      const { data: venueEvents } = await supabase
        .from('events')
        .select(`
          *,
          category:event_categories(*),
          tags:event_tag_relations(
            tag:event_tags(*)
          )
        `)
        .eq('status', 'published')
        .eq('venue_id', event.venue_id)
        .neq('id', event.id)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(3);
      
      otherEventsAtVenue = venueEvents?.map(e => ({
        ...e,
        tags: e.tags?.map((tr: any) => tr.tag) || []
      })) || [];
    }
    
    // Check if user has bookmarked this event
    let userContext = undefined;
    if (user) {
      const { data: bookmark } = await supabase
        .from('event_bookmarks')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .single();
      
      const { data: click } = await supabase
        .from('event_clicks')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .eq('click_type', 'booking_url')
        .limit(1)
        .single();
      
      userContext = {
        is_bookmarked: !!bookmark,
        has_clicked: !!click
      };
    }
    
    // Prepare response
    const response: EventDetailResponse = {
      event: transformedEvent,
      similar_events: transformedSimilarEvents,
      other_events_at_venue: otherEventsAtVenue.length > 0 ? otherEventsAtVenue : undefined,
      user_context: userContext
    };
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Event fetched successfully', {
      eventId: event.id,
      slug: slug,
      duration
    });
    
    performanceMonitor.recordAPICall(`/api/events/${slug}`, 'GET', duration, 200);
    
    return NextResponse.json(response);
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Event detail request failed', {
      slug: slug,
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall(`/api/events/${slug}`, 'GET', duration, 500);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/events/[slug]
 * Update an event (Creator or Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  // Await params before using
  const { slug } = await params;
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: `/api/events/${slug}`,
    method: 'PUT'
  });
  
  apiLogger.info('Update event request received', { slug });
  
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Check user authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the event to check ownership
    const { data: existingEvent } = await supabase
      .from('events')
      .select('id, created_by')
      .eq('slug', slug)
      .single();
    
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const canEdit = 
      existingEvent.created_by === user.id || 
      profile?.role === 'Admin';
    
    if (!canEdit) {
      return NextResponse.json(
        { error: 'Insufficient permissions to edit this event' },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const updateData = UpdateEventSchema.parse(body);
    
    // Update event
    const { data: event, error } = await supabase
      .from('events')
      .update({
        ...updateData,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingEvent.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Event updated successfully', {
      eventId: event.id,
      slug: slug,
      duration
    });
    
    performanceMonitor.recordAPICall(`/api/events/${slug}`, 'PUT', duration, 200);
    
    return NextResponse.json(event);
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Update event request failed', {
      slug: slug,
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall(`/api/events/${slug}`, 'PUT', duration, 500);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid update data', details: error.errors },
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
 * DELETE /api/events/[slug]
 * Soft delete an event (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  // Await params before using
  const { slug } = await params;
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: `/api/events/${slug}`,
    method: 'DELETE'
  });
  
  apiLogger.info('Delete event request received', { slug });
  
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
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!profile || profile.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Admin role required' },
        { status: 403 }
      );
    }
    
    // Soft delete by setting status to cancelled
    const { data: event, error } = await supabase
      .from('events')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: 'Deleted by admin',
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single();
    
    if (error || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Event deleted successfully', {
      eventId: event.id,
      slug: slug,
      duration
    });
    
    performanceMonitor.recordAPICall(`/api/events/${slug}`, 'DELETE', duration, 200);
    
    return NextResponse.json({
      message: 'Event deleted successfully',
      event
    });
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Delete event request failed', {
      slug: slug,
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall(`/api/events/${slug}`, 'DELETE', duration, 500);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}