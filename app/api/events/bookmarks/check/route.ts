import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/events/bookmarks/check - Check if events are bookmarked
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get event IDs from query params
    const searchParams = request.nextUrl.searchParams;
    const event_ids = searchParams.get('event_ids');

    if (!event_ids) {
      return NextResponse.json(
        { error: 'Event IDs are required' },
        { status: 400 }
      );
    }

    // Parse event IDs
    const eventIdArray = event_ids.split(',').filter(id => id.trim());

    if (eventIdArray.length === 0) {
      return NextResponse.json({ bookmarked: {} });
    }

    // Check which events are bookmarked
    const { data: bookmarks, error } = await supabase
      .from('event_bookmarks')
      .select('event_id')
      .eq('user_id', user.id)
      .in('event_id', eventIdArray);

    if (error) {
      console.error('Failed to check bookmarks:', error);
      return NextResponse.json(
        { error: 'Failed to check bookmarks' },
        { status: 500 }
      );
    }

    // Create a map of bookmarked events
    const bookmarkedMap: Record<string, boolean> = {};
    eventIdArray.forEach(id => {
      bookmarkedMap[id] = false;
    });
    
    if (bookmarks) {
      bookmarks.forEach(bookmark => {
        bookmarkedMap[bookmark.event_id] = true;
      });
    }

    return NextResponse.json({ bookmarked: bookmarkedMap });
  } catch (error) {
    console.error('Bookmark check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}