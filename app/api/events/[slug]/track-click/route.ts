import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';

/**
 * POST /api/events/[slug]/track-click
 * Track clicks on external booking links and other actions
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: `/api/events/${params.slug}/track-click`,
    method: 'POST'
  });
  
  apiLogger.info('Track click request received', { slug: params.slug });
  
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get optional user authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    // Parse request body
    const { click_type = 'booking_url' } = await request.json();
    
    // Validate click type
    const validClickTypes = ['booking_url', 'share', 'calendar_export'];
    if (!validClickTypes.includes(click_type)) {
      return NextResponse.json(
        { error: 'Invalid click type' },
        { status: 400 }
      );
    }
    
    // Get the event ID from slug
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', params.slug)
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Get request metadata
    const referrer = request.headers.get('referer') || null;
    const userAgent = request.headers.get('user-agent') || null;
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                null;
    
    // Insert click record
    const { error: clickError } = await supabase
      .from('event_clicks')
      .insert({
        event_id: event.id,
        user_id: user?.id || null,
        click_type,
        referrer,
        user_agent: userAgent,
        ip_address: ip
      });
    
    if (clickError) {
      throw clickError;
    }
    
    // If it's a booking URL click, increment the click count on the event
    if (click_type === 'booking_url') {
      const { error: updateError } = await supabase
        .from('events')
        .update({
          click_count: supabase.raw('click_count + 1')
        })
        .eq('id', event.id);
      
      if (updateError) {
        apiLogger.error('Failed to update click count', { error: updateError });
      }
    }
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Click tracked successfully', {
      eventId: event.id,
      slug: params.slug,
      clickType: click_type,
      userId: user?.id,
      duration
    });
    
    performanceMonitor.recordAPICall(`/api/events/${params.slug}/track-click`, 'POST', duration, 200);
    
    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully'
    });
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Track click request failed', {
      slug: params.slug,
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall(`/api/events/${params.slug}/track-click`, 'POST', duration, 500);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}