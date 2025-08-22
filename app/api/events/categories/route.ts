import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';

/**
 * GET /api/events/categories
 * Fetch all active event categories
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: '/api/events/categories',
    method: 'GET'
  });
  
  apiLogger.info('Event categories request received');
  
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Fetch active categories with event counts
    const { data: categories, error } = await supabase
      .from('event_categories')
      .select(`
        *,
        event_count:events(count)
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Transform to include event count
    const categoriesWithCount = categories?.map(cat => ({
      ...cat,
      event_count: cat.event_count?.[0]?.count || 0
    })) || [];
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Categories fetched successfully', {
      count: categoriesWithCount.length,
      duration
    });
    
    performanceMonitor.recordAPICall('/api/events/categories', 'GET', duration, 200);
    
    return NextResponse.json({
      categories: categoriesWithCount,
      total: categoriesWithCount.length
    });
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Categories request failed', {
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall('/api/events/categories', 'GET', duration, 500);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}