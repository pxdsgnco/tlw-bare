import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchModal } from './SearchModal';
import type { Creator } from './SearchModal';

// 1. Test data factories following our patterns
const createMockCreator = (overrides: Partial<Creator> = {}): Creator => ({
  id: `creator-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Creator',
  description: 'Creating amazing content',
  avatar: 'https://example.com/avatar.jpg',
  verified: false,
  followerCount: 1000,
  ...overrides
});

const createMockSearchResponse = (creators: Creator[] = [], overrides = {}) => ({
  creators,
  totalCount: creators.length,
  hasMore: false,
  ...overrides
});

// 2. Mock functions
const mockOnClose = jest.fn();
const mockOnCreatorSelect = jest.fn();

// 3. Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// 4. Mock portal rendering
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node
}));

// 5. Test setup utility
function renderSearchModal(props = {}) {
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onCreatorSelect: mockOnCreatorSelect,
    ...props
  };
  
  return render(<SearchModal {...defaultProps} />);
}

// 6. Test suite
describe('SearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      renderSearchModal({ isOpen: false });
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
    
    it('should render search input when open', () => {
      renderSearchModal();
      expect(screen.getByRole('textbox', { name: /search creators/i })).toBeInTheDocument();
    });
    
    it('should render with custom placeholder', () => {
      renderSearchModal({ placeholder: 'Find amazing creators...' });
      expect(screen.getByPlaceholderText('Find amazing creators...')).toBeInTheDocument();
    });
    
    it('should render close button', () => {
      renderSearchModal();
      expect(screen.getByRole('button', { name: /close search/i })).toBeInTheDocument();
    });
    
    it('should focus search input when opened', async () => {
      renderSearchModal();
      
      // Fast-forward to after focus timeout
      act(() => {
        jest.advanceTimersByTime(200);
      });
      
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveFocus();
    });
  });
  
  describe('Search Functionality', () => {
    it('should debounce search queries', async () => {
      const mockCreators = [createMockCreator({ name: 'Art Creator' })];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse(mockCreators))
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      // Type quickly
      await userEvent.type(searchInput, 'art');
      
      // Should not have called fetch yet (debounced)
      expect(mockFetch).not.toHaveBeenCalled();
      
      // Fast-forward past debounce delay
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/search/creators?q=art',
          expect.any(Object)
        );
      });
    });
    
    it('should display loading state during search', async () => {
      mockFetch.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve(createMockSearchResponse([]))
        }), 100)
      ));
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(screen.getByText(/searching/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    
    it('should display search results', async () => {
      const mockCreators = [
        createMockCreator({ 
          name: 'Aaron Amick', 
          description: 'Creating Detailed Briefings of Submarines and more!',
          verified: true 
        }),
        createMockCreator({ 
          name: 'Pamela Aaralyn', 
          description: 'Creating Group Channelings, Classes, Live Q and A, Music, Writing' 
        })
      ];
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse(mockCreators))
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'art');
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Aaron Amick')).toBeInTheDocument();
        expect(screen.getByText('Pamela Aaralyn')).toBeInTheDocument();
        expect(screen.getByText(/Creating Detailed Briefings/)).toBeInTheDocument();
      });
    });
    
    it('should display verified badge for verified creators', async () => {
      const verifiedCreator = createMockCreator({ 
        name: 'Verified Creator',
        verified: true 
      });
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse([verifiedCreator]))
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByLabelText('Verified creator')).toBeInTheDocument();
      });
    });
    
    it('should display follower count when available', async () => {
      const creatorWithFollowers = createMockCreator({ 
        followerCount: 15420 
      });
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse([creatorWithFollowers]))
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByText('15,420 followers')).toBeInTheDocument();
      });
    });
  });
  
  describe('Error Handling', () => {
    it('should display error message when search fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to search creators/i)).toBeInTheDocument();
      });
    });
    
    it('should provide retry functionality on error', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(createMockSearchResponse([createMockCreator()]))
        });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to search creators/i)).toBeInTheDocument();
      });
      
      const retryButton = screen.getByText(/try again/i);
      await userEvent.click(retryButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Creator')).toBeInTheDocument();
      });
    });
    
    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to search creators/i)).toBeInTheDocument();
      });
    });
  });
  
  describe('User Interactions', () => {
    it('should call onCreatorSelect when creator is clicked', async () => {
      const mockCreator = createMockCreator({ name: 'Selected Creator' });
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse([mockCreator]))
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByText('Selected Creator')).toBeInTheDocument();
      });
      
      const creatorButton = screen.getByRole('option', { name: /Selected Creator/i });
      await userEvent.click(creatorButton);
      
      expect(mockOnCreatorSelect).toHaveBeenCalledWith(mockCreator);
      expect(mockOnClose).toHaveBeenCalled();
    });
    
    it('should call onClose when close button is clicked', async () => {
      renderSearchModal();
      
      const closeButton = screen.getByRole('button', { name: /close search/i });
      await userEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
    
    it('should call onClose when backdrop is clicked', async () => {
      const { container } = renderSearchModal();
      
      const backdrop = container.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
      
      fireEvent.click(backdrop!);
      expect(mockOnClose).toHaveBeenCalled();
    });
    
    it('should not close when clicking inside modal content', async () => {
      renderSearchModal();
      
      const modalContent = screen.getByRole('textbox').closest('.bg-white');
      expect(modalContent).toBeInTheDocument();
      
      fireEvent.click(modalContent!);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
  
  describe('Keyboard Navigation', () => {
    it('should close modal when Escape is pressed', async () => {
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, '{Escape}');
      expect(mockOnClose).toHaveBeenCalled();
    });
    
    it('should navigate through results with arrow keys', async () => {
      const mockCreators = [
        createMockCreator({ name: 'Creator 1' }),
        createMockCreator({ name: 'Creator 2' })
      ];
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse(mockCreators))
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByText('Creator 1')).toBeInTheDocument();
      });
      
      // Navigate down
      await userEvent.type(searchInput, '{ArrowDown}');
      expect(screen.getByRole('option', { name: /Creator 1/i })).toHaveAttribute('aria-selected', 'true');
      
      await userEvent.type(searchInput, '{ArrowDown}');
      expect(screen.getByRole('option', { name: /Creator 2/i })).toHaveAttribute('aria-selected', 'true');
      
      // Navigate up
      await userEvent.type(searchInput, '{ArrowUp}');
      expect(screen.getByRole('option', { name: /Creator 1/i })).toHaveAttribute('aria-selected', 'true');
    });
    
    it('should select creator with Enter key', async () => {
      const mockCreator = createMockCreator({ name: 'Keyboard Creator' });
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse([mockCreator]))
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByText('Keyboard Creator')).toBeInTheDocument();
      });
      
      // Navigate to first result and select
      await userEvent.type(searchInput, '{ArrowDown}');
      await userEvent.type(searchInput, '{Enter}');
      
      expect(mockOnCreatorSelect).toHaveBeenCalledWith(mockCreator);
      expect(mockOnClose).toHaveBeenCalled();
    });
    
    it('should trigger global search with Enter when no result is selected', async () => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'global search');
      await userEvent.type(searchInput, '{Enter}');
      
      expect(window.location.href).toBe('/search?q=global%20search');
    });
  });
  
  describe('Empty and Loading States', () => {
    it('should show empty state when no results found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse([]))
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'nonexistent');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(screen.getByText(/No creators found/i)).toBeInTheDocument();
        expect(screen.getByText(/Try searching with different keywords/i)).toBeInTheDocument();
      });
    });
    
    it('should show "Search for" option when query is entered', async () => {
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'art');
      
      // Should show the "Search for 'art'" option immediately
      expect(screen.getByText(/Search for/)).toBeInTheDocument();
      expect(screen.getByText(/'art'/)).toBeInTheDocument();
    });
    
    it('should handle global search from footer option', async () => {
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true
      });
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'art');
      
      const globalSearchButton = screen.getByRole('option', { name: /Search for 'art'/i });
      await userEvent.click(globalSearchButton);
      
      expect(window.location.href).toBe('/search?q=art');
    });
  });
  
  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderSearchModal();
      
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('aria-label', 'Search creators');
      
      const resultsContainer = screen.getByRole('listbox');
      expect(resultsContainer).toHaveAttribute('aria-label', 'Search results');
    });
    
    it('should announce search errors to screen readers', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        const errorElement = screen.getByText(/Failed to search creators/i);
        expect(errorElement).toHaveAttribute('id', 'search-error');
        expect(searchInput).toHaveAttribute('aria-describedby', 'search-error');
      });
    });
    
    it('should properly set aria-expanded based on results', async () => {
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      // Initially no results
      expect(searchInput).toHaveAttribute('aria-expanded', 'false');
      
      // Mock results
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockSearchResponse([createMockCreator()]))
      });
      
      await userEvent.type(searchInput, 'test');
      act(() => { jest.advanceTimersByTime(300); });
      
      await waitFor(() => {
        expect(searchInput).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });
  
  describe('Performance and Cleanup', () => {
    it('should cancel previous requests when new search is initiated', async () => {
      const abortSpy = jest.fn();
      const mockAbortController = {
        signal: { aborted: false },
        abort: abortSpy
      };
      
      jest.spyOn(global, 'AbortController').mockImplementation(() => mockAbortController as any);
      
      renderSearchModal();
      const searchInput = screen.getByRole('textbox');
      
      // First search
      await userEvent.type(searchInput, 'first');
      act(() => { jest.advanceTimersByTime(300); });
      
      // Second search should abort first
      await userEvent.type(searchInput, 'second');
      act(() => { jest.advanceTimersByTime(300); });
      
      expect(abortSpy).toHaveBeenCalled();
    });
    
    it('should cleanup timers and abort controllers on unmount', () => {
      const { unmount } = renderSearchModal();
      
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      const abortSpy = jest.fn();
      
      // Mock abort controller
      jest.spyOn(global, 'AbortController').mockImplementation(() => ({
        signal: { aborted: false },
        abort: abortSpy
      }) as any);
      
      unmount();
      
      // Should clean up resources
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});