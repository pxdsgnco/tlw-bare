import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/events/bookmarks - Get user's bookmarks
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

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Fetch bookmarked events
    const { data: bookmarks, error, count } = await supabase
      .from('event_bookmarks')
      .select(`
        id,
        created_at,
        event:events(
          *,
          category:event_categories(*),
          organizer:event_organizers(*),
          venue:venues(*),
          tags:event_tags(*)
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch bookmarks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookmarks' },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      bookmarks: bookmarks || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      }
    });
  } catch (error) {
    console.error('Bookmarks API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events/bookmarks - Add a bookmark
export async function POST(request: NextRequest) {
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

    // Get event ID from request body
    const body = await request.json();
    const { event_id } = body;

    if (!event_id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if bookmark already exists
    const { data: existingBookmark } = await supabase
      .from('event_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', event_id)
      .single();

    if (existingBookmark) {
      return NextResponse.json(
        { message: 'Bookmark already exists', bookmark: existingBookmark },
        { status: 200 }
      );
    }

    // Create bookmark
    const { data: bookmark, error } = await supabase
      .from('event_bookmarks')
      .insert({
        user_id: user.id,
        event_id
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create bookmark:', error);
      return NextResponse.json(
        { error: 'Failed to create bookmark' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Bookmark created successfully',
      bookmark
    }, { status: 201 });
  } catch (error) {
    console.error('Bookmark creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/bookmarks - Remove a bookmark
export async function DELETE(request: NextRequest) {
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

    // Get event ID from query params
    const searchParams = request.nextUrl.searchParams;
    const event_id = searchParams.get('event_id');

    if (!event_id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Delete bookmark
    const { error } = await supabase
      .from('event_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', event_id);

    if (error) {
      console.error('Failed to delete bookmark:', error);
      return NextResponse.json(
        { error: 'Failed to delete bookmark' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    console.error('Bookmark deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}