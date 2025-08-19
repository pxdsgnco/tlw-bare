import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';

// Type definitions
interface Creator {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly avatar?: string;
  readonly verified?: boolean;
  readonly followerCount?: number;
}

interface SearchResponse {
  readonly creators: readonly Creator[];
  readonly totalCount: number;
  readonly hasMore: boolean;
}

// Mock data - replace with actual database queries
const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Aaron Amick',
    description: 'Creating Detailed Briefings of Submarines and more!',
    avatar: '/avatars/aaron-amick.jpg',
    verified: true,
    followerCount: 15420
  },
  {
    id: '2', 
    name: 'Pamela Aaralyn',
    description: 'Creating Group Channelings, Classes, Live Q and A, Music, Writing',
    avatar: '/avatars/pamela-aaralyn.jpg',
    verified: false,
    followerCount: 8230
  },
  {
    id: '3',
    name: 'Aaron Mahnke',
    description: 'creating Lore',
    verified: true,
    followerCount: 45600
  },
  {
    id: '4',
    name: 'Aaron and Jo',
    description: 'creating videos and music',
    followerCount: 1250
  },
  {
    id: '5',
    name: 'Aaron Feng',
    description: 'creating Waifu2x-Extension-GUI for enhance Video, Image and GIF',
    followerCount: 892
  }
];

// GET handler
export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse | { error: string }>> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  
  const apiLogger = logger.createChildLogger({
    requestId,
    path: '/api/search/creators',
    method: 'GET'
  });
  
  apiLogger.info('Search API request received', {
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || 'unknown'
  });
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Validate parameters
    if (!query.trim()) {
      apiLogger.warn('Empty search query provided');
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    if (page < 1 || limit < 1 || limit > 100) {
      apiLogger.warn('Invalid pagination parameters', { page, limit });
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }
    
    // Perform search (mock implementation)
    const normalizedQuery = query.toLowerCase().trim();
    const filteredCreators = mockCreators.filter(creator =>
      creator.name.toLowerCase().includes(normalizedQuery) ||
      creator.description.toLowerCase().includes(normalizedQuery)
    );
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCreators = filteredCreators.slice(startIndex, endIndex);
    
    const searchResponse: SearchResponse = {
      creators: paginatedCreators,
      totalCount: filteredCreators.length,
      hasMore: endIndex < filteredCreators.length
    };
    
    const duration = performance.now() - startTime;
    
    apiLogger.info('Search completed successfully', {
      query,
      resultCount: paginatedCreators.length,
      totalCount: filteredCreators.length,
      duration,
      page,
      limit
    });
    
    performanceMonitor.recordAPICall('/api/search/creators', 'GET', duration, 200);
    
    return NextResponse.json(searchResponse);
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    apiLogger.error('Search API request failed', {
      duration,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    performanceMonitor.recordAPICall('/api/search/creators', 'GET', duration, 500);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}