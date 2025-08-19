import { useState, useCallback } from 'react';
import { logger } from '@/lib/observability';

// Hook for managing search modal state
export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = useCallback(() => {
    setIsOpen(true);
    logger.info('Search modal opened');
  }, []);
  
  const closeModal = useCallback(() => {
    setIsOpen(false);
    logger.info('Search modal closed');
  }, []);
  
  return {
    isOpen,
    openModal,
    closeModal
  };
}