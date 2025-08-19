import React from 'react';
import { SearchIcon } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { useSearchModal } from './useSearchModal';
import type { Creator } from './SearchModal';

// Example integration component
export function SearchModalExample() {
  const { isOpen, openModal, closeModal } = useSearchModal();
  
  const handleCreatorSelect = (creator: Creator) => {
    console.log('Selected creator:', creator);
    // Navigate to creator profile or handle selection
    window.location.href = `/creator/${creator.id}`;
  };
  
  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={openModal}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Open search"
      >
        <SearchIcon className="w-5 h-5 text-gray-600" />
      </button>
      
      {/* Search modal */}
      <SearchModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreatorSelect={handleCreatorSelect}
        placeholder="Search for creators, content, or topics..."
      />
    </>
  );
}

// Usage in your header component:
// 
// import { SearchModalExample } from '@/components/search/SearchModalExample';
// 
// export function Header() {
//   return (
//     <header className="flex items-center justify-between p-4">
//       <Logo />
//       <div className="flex items-center space-x-4">
//         <SearchModalExample />
//         <UserMenu />
//       </div>
//     </header>
//   );
// }