import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';

/**
 * GET /api/events/upcoming
 * Fetch upcoming events for homepage display
 * Returns a mix of featured and regular events
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: '/api/events/upcoming',
    method: 'GET'
  });
  
  apiLogger.info('Upcoming events request received');
  
  try {
    // Get parameters
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '8');
    const featuredOnly = request.nextUrl.searchParams.get('featured') === 'true';
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    const today = new Date().toISOString().split('T')[0];
    
    if (featuredOnly) {
      // Fetch only featured upcoming events
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          id,
          slug,
          title,
          description,
          event_date,
          start_time,
          venue_name,
          area,
          featured_image,
          price,
          price_tier,
          is_featured,
          category:event_categories(name, slug, color),
          tags:event_tag_relations(
            tag:event_tags(name, color)
          )
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .gte('event_date', today)
        .order('featured_priority', { ascending: true })
        .order('event_date', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      
      const transformedEvents = events?.map(event => ({
        ...event,
        tags: event.tags?.map((tr: any) => tr.tag) || []
      })) || [];
      
      return NextResponse.json({
        events: transformedEvents,
        total: transformedEvents.length
      });
    } else {
      // Fetch a mix of featured and regular events
      // First get some featured events
      const { data: featuredEvents, error: featuredError } = await supabase
        .from('events')
        .select(`
          id,
          slug,
          title,
          description,
          event_date,
          start_time,
          venue_name,
          area,
          featured_image,
          price,
          price_tier,
          is_featured,
          view_count,
          category:event_categories(name, slug, color),
          tags:event_tag_relations(
            tag:event_tags(name, color)
          )
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .gte('event_date', today)
        .order('featured_priority', { ascending: true })
        .order('event_date', { ascending: true })
        .limit(Math.floor(limit / 2)); // Half featured
      
      if (featuredError) throw featuredError;
      
      const featuredIds = featuredEvents?.map(e => e.id) || [];
      
      // Then get regular events
      let regularQuery = supabase
        .from('events')
        .select(`
          id,
          slug,
          title,
          description,
          event_date,
          start_time,
          venue_name,
          area,
          featured_image,
          price,
          price_tier,
          is_featured,
          view_count,
          category:event_categories(name, slug, color),
          tags:event_tag_relations(
            tag:event_tags(name, color)
          )
        `)
        .eq('status', 'published')
        .gte('event_date', today);
      
      // Exclude featured events if any exist
      if (featuredIds.length > 0) {
        regularQuery = regularQuery.not('id', 'in', `(${featuredIds.join(',')})`);
      }
      
      const { data: regularEvents, error: regularError } = await regularQuery
        .order('event_date', { ascending: true })
        .order('view_count', { ascending: false })
        .limit(limit - (featuredEvents?.length || 0));
      
      if (regularError) throw regularError;
      
      // Combine and transform
      const allEvents = [
        ...(featuredEvents || []),
        ...(regularEvents || [])
      ].map(event => ({
        ...event,
        tags: event.tags?.map((tr: any) => tr.tag) || []
      }));
      
      // Sort by date (featured will appear first for same dates due to priority)
      allEvents.sort((a, b) => {
        const dateA = new Date(`${a.event_date}T${a.start_time}`);
        const dateB = new Date(`${b.event_date}T${b.start_time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      const duration = performance.now() - startTime;
      
      apiLogger.info('Upcoming events fetched successfully', {
        count: allEvents.length,
        featuredCount: featuredEvents?.length || 0,
        regularCount: regularEvents?.length || 0,
        duration
      });
      
      performanceMonitor.recordAPICall('/api/events/upcoming', 'GET', duration, 200);
      
      return NextResponse.json({
        events: allEvents,
        total: allEvents.length,
        featured_count: featuredEvents?.length || 0
      });
    }
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Upcoming events request failed', {
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall('/api/events/upcoming', 'GET', duration, 500);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}