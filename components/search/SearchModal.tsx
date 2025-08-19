import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/observability';
import { performanceMonitor } from '@/lib/performance';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SearchIcon, XIcon, UserIcon } from 'lucide-react';

// 1. Type definitions following our standards
export interface Creator {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly avatar?: string;
  readonly verified?: boolean;
  readonly followerCount?: number;
}

interface SearchResult {
  readonly creators: readonly Creator[];
  readonly totalCount: number;
  readonly hasMore: boolean;
}

interface SearchModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onCreatorSelect?: (creator: Creator) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

// 2. Search state management with discriminated unions
type SearchState = 
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: SearchResult; readonly query: string }
  | { readonly status: 'error'; readonly error: string; readonly query: string };

// Removed unused emptySearchResult - we can create inline when needed

// 4. Main component implementation following our template
function SearchModalInner({ 
  isOpen, 
  onClose, 
  onCreatorSelect, 
  placeholder = "Search creators...",
  className 
}: SearchModalProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>({ status: 'idle' });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Refs for proper cleanup and focus management
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Logger with component context
  const componentLogger = useMemo(() => 
    logger.createChildLogger({ component: 'SearchModal' }), []
  );
  
  // Search function with proper error handling and observability
  const performSearch = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchState({ status: 'idle' });
      return;
    }
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const timer = performanceMonitor.startTimer('search_modal_query');
    
    setSearchState({ status: 'loading' });
    
    componentLogger.info('Search initiated', { 
      query,
      queryLength: query.length 
    });
    
    try {
      // Simulate API call - replace with actual search endpoint
      const response = await fetch(`/api/search/creators?q=${encodeURIComponent(query)}`, {
        signal: abortControllerRef.current.signal,
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const duration = timer({ status: 'success' });
      
      // Validate response data
      const searchResult: SearchResult = {
        creators: Array.isArray(data.creators) ? data.creators : [],
        totalCount: typeof data.totalCount === 'number' ? data.totalCount : 0,
        hasMore: Boolean(data.hasMore)
      };
      
      componentLogger.info('Search completed successfully', {
        query,
        resultCount: searchResult.creators.length,
        totalCount: searchResult.totalCount,
        duration
      });
      
      setSearchState({ 
        status: 'success', 
        data: searchResult, 
        query 
      });
      
      // Reset selection when new results arrive
      setSelectedIndex(-1);
      
    } catch (error) {
      // Don't handle aborted requests as errors
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      const duration = timer({ status: 'error' });
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      
      componentLogger.error('Search failed', {
        query,
        duration,
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      setSearchState({ 
        status: 'error', 
        error: 'Failed to search creators. Please try again.', 
        query 
      });
    }
  }, [componentLogger]);
  
  // Debounced search handler
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    
    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, 300); // 300ms debounce
  }, [performSearch]);
  
  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const results = searchState.status === 'success' ? searchState.data.creators : [];
    
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
        
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          const selectedCreator = results[selectedIndex];
          handleCreatorSelect(selectedCreator);
        } else if (searchQuery.trim()) {
          // Handle "Search for 'query'" option
          componentLogger.info('Global search initiated', { query: searchQuery });
          // Navigate to search results page or trigger global search
          window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
        break;
    }
  }, [searchState, selectedIndex, searchQuery, onClose, componentLogger]);
  
  // Creator selection handler
  const handleCreatorSelect = useCallback((creator: Creator) => {
    componentLogger.info('Creator selected', {
      creatorId: creator.id,
      creatorName: creator.name
    });
    
    onCreatorSelect?.(creator);
    onClose();
  }, [onCreatorSelect, onClose, componentLogger]);
  
  // Focus management
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Focus the search input when modal opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      componentLogger.debug('SearchModal unmounted');
    };
  }, [componentLogger]);
  
  // Handle click outside to close modal
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  // Don't render if not open
  if (!isOpen) {
    return null;
  }
  
  // Get current results for rendering
  const results = searchState.status === 'success' ? searchState.data.creators : [];
  const isLoading = searchState.status === 'loading';
  const error = searchState.status === 'error' ? searchState.error : null;
  
  // Modal content
  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          'w-full max-w-2xl mt-16 bg-white rounded-lg shadow-xl overflow-hidden',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 text-lg bg-transparent outline-none placeholder-gray-400"
            aria-label="Search creators"
            // aria-expanded removed - not supported by textbox role
            aria-describedby={error ? 'search-error' : undefined}
          />
          <button
            onClick={onClose}
            className="ml-3 p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <XIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Search Results */}
        <div 
          ref={resultsRef}
          className="max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="p-4 text-center">
              <div className="text-red-600 mb-2" id="search-error">
                {error}
              </div>
              <button
                onClick={() => performSearch(searchQuery)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Search Results */}
          {results.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Creators
              </div>
              
              {results.map((creator, index) => (
                <button
                  key={creator.id}
                  onClick={() => handleCreatorSelect(creator)}
                  className={cn(
                    'w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors text-left',
                    selectedIndex === index && 'bg-blue-50 border-r-2 border-blue-500'
                  )}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                    {creator.avatar ? (
                      <img 
                        src={creator.avatar} 
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900 truncate">
                        {creator.name}
                      </h3>
                      {creator.verified && (
                        <span className="ml-1 text-blue-500" aria-label="Verified creator">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {creator.description}
                    </p>
                    {creator.followerCount && (
                      <p className="text-xs text-gray-400 mt-1">
                        {creator.followerCount.toLocaleString()} followers
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* "Search for 'query'" Option */}
          {searchQuery.trim() && !isLoading && (
            <div className="border-t border-gray-200 py-2">
              <button
                onClick={() => {
                  componentLogger.info('Global search initiated from footer', { query: searchQuery });
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                }}
                className={cn(
                  'w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors text-left',
                  selectedIndex === results.length && 'bg-blue-50 border-r-2 border-blue-500'
                )}
                role="option"
                aria-selected={selectedIndex === results.length}
              >
                <SearchIcon className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Search for <strong>&apos;{searchQuery}&apos;</strong>
                </span>
              </button>
            </div>
          )}
          
          {/* Empty State */}
          {!isLoading && !error && searchQuery.trim() && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <SearchIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No creators found
              </h3>
              <p>
                Try searching with different keywords or browse all creators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Render modal using portal
  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}

// 5. Export with error boundary
export function SearchModal(props: SearchModalProps) {
  return (
    <ErrorBoundary>
      <SearchModalInner {...props} />
    </ErrorBoundary>
  );
}

// 6. Default export and display name
SearchModal.displayName = 'SearchModal';
export default SearchModal;