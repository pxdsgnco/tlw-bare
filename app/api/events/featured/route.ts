import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';

/**
 * GET /api/events/featured
 * Fetch featured events only, sorted by priority
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: '/api/events/featured',
    method: 'GET'
  });
  
  apiLogger.info('Featured events request received');
  
  try {
    // Get optional limit from query params
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '6');
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Fetch featured events
    const { data: events, error } = await supabase
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
      .eq('status', 'published')
      .eq('is_featured', true)
      .gte('event_date', new Date().toISOString().split('T')[0]) // Only upcoming events
      .order('featured_priority', { ascending: true })
      .order('event_date', { ascending: true })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Transform the data to flatten tags
    const transformedEvents = events?.map(event => ({
      ...event,
      tags: event.tags?.map((tr: any) => tr.tag) || []
    })) || [];
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Featured events fetched successfully', {
      count: transformedEvents.length,
      duration
    });
    
    performanceMonitor.recordAPICall('/api/events/featured', 'GET', duration, 200);
    
    return NextResponse.json({
      events: transformedEvents,
      total: transformedEvents.length
    });
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Featured events request failed', {
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall('/api/events/featured', 'GET', duration, 500);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/events/featured
 * Toggle featured status for an event (Admin only)
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: '/api/events/featured',
    method: 'PATCH'
  });
  
  apiLogger.info('Toggle featured status request received');
  
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
    
    // Parse request body
    const { event_id, is_featured, priority = 0 } = await request.json();
    
    if (!event_id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // Update event featured status
    const { data: event, error } = await supabase
      .from('events')
      .update({
        is_featured,
        featured_priority: is_featured ? priority : 0,
        featured_at: is_featured ? new Date().toISOString() : null,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', event_id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Featured status updated successfully', {
      eventId: event_id,
      isFeatured: is_featured,
      priority,
      duration
    });
    
    performanceMonitor.recordAPICall('/api/events/featured', 'PATCH', duration, 200);
    
    return NextResponse.json({
      message: `Event ${is_featured ? 'featured' : 'unfeatured'} successfully`,
      event
    });
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Toggle featured status failed', {
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall('/api/events/featured', 'PATCH', duration, 500);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}