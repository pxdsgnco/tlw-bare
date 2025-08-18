'use client';

import Image from 'next/image';

import { useState } from 'react';

const imgLucideSearch = "http://localhost:3845/assets/975728ebc08399a8d00d76fa4a84a741242fb916.svg";

interface BlogSidebarProps {
  searchQuery?: string;
  selectedCategory?: string;
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
}

export default function BlogSidebar({ 
  searchQuery = '',
  selectedCategory = 'All',
  onSearchChange,
  onCategoryChange
}: BlogSidebarProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const categories = [
    'All',
    'Entertainment',
    'Fashion',
    'Events',
    'Food',
    'Feature',
    'Music',
    'News',
    'Review',
    'Weekend Style Inspiration',
    'Things to do',
    'Travel',
    'TLW Guide'
  ];

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleCategoryClick = (category: string) => {
    onCategoryChange?.(category);
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start max-w-80 p-0 relative shrink-0 w-[310px]">
      
      {/* Search Bar */}
      <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[12px] relative rounded-[10px] shrink-0 w-full border border-[#e5eaf0] hover:border-gray-300 focus-within:border-[#fb7102] transition-colors">
        <div className="relative shrink-0 size-5">
          <Image alt="Search icon" className="block max-w-none size-full" src={imgLucideSearch} width={20} height={20} />
        </div>
        <input
          type="text"
          value={localSearchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search..."
          className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic flex-1 text-[#838b9e] text-[14px] text-left bg-transparent border-none outline-none placeholder:text-[#838b9e] tracking-[-0.14px]"
        />
      </div>

      {/* Categories */}
      <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full">
        <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#13151a] text-[18px] text-left tracking-[-0.18px] w-full">
          <p className="block leading-[24px]">Categories</p>
        </div>
        
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start p-0 relative w-full">
            {categories.map((category) => {
              const isActive = category === selectedCategory;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`relative shrink-0 w-full ${
                    isActive 
                      ? 'bg-[rgba(251,113,2,0.1)] border-l-2 border-[#fb7102]' 
                      : 'bg-[#ffffff] hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div className="bg-clip-padding box-border content-stretch flex flex-row gap-3 items-start justify-start px-4 py-3 relative w-full">
                    <div className={`font-['Inter:${isActive ? 'Bold' : 'Regular'}',_sans-serif] font-${isActive ? 'bold' : 'normal'} leading-[0] not-italic relative shrink-0 text-[${isActive ? '#fb7102' : '#697289'}] text-[15px] text-left text-nowrap tracking-[-0.15px]`}>
                      <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                        {category}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .adjustLetterSpacing {
          letter-spacing: inherit;
        }
      `}</style>
    </div>
  );
}