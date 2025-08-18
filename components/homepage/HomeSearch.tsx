'use client';

import Image from 'next/image';
import { useState } from 'react';

// Search icons (default state)
const searchIcons = {
  binoculars: "http://localhost:3845/assets/96c483835dc2a6e3ff90ceb04c4d863c8421f8dd.svg",
  calendar: "http://localhost:3845/assets/9de7e74e37fabb3e2dc6c0c38404f467aaa1cae8.svg",
  mapPin: "http://localhost:3845/assets/f5d4b406ff8e7de84358c1bf6f818122c21cb5a8.svg",
  search: "http://localhost:3845/assets/1251c42958b09df333c98a3efd7e958b9c197d4b.svg"
};

// Search icons (active state - orange)
const searchIconsActive = {
  binoculars: "http://localhost:3845/assets/96c483835dc2a6e3ff90ceb04c4d863c8421f8dd.svg",
  calendar: "http://localhost:3845/assets/1137592eb63d592d5da514adf54bf4f2f0016f5a.svg", 
  mapPin: "http://localhost:3845/assets/7c01d010df65da4cba2e37400e55e38699660958.svg",
  search: "http://localhost:3845/assets/1251c42958b09df333c98a3efd7e958b9c197d4b.svg"
};

// Events view additional icons
const eventsIcons = {
  calendarSmall: "http://localhost:3845/assets/eaf2c113b6517b4c81995cfa5fc228e295c7be51.svg",
  chevronDown: "http://localhost:3845/assets/caf3c9a98c746a6dd442049c4828a32cc93a1db6.svg",
  dollarSign: "http://localhost:3845/assets/62cab148acb80684d0c498b1f3399ad3cef036f5.svg"
};

type SearchCategory = 'all' | 'events' | 'nightlife';

interface SearchTabProps {
  category: SearchCategory;
  activeCategory: SearchCategory | 'none';
  onClick: (category: SearchCategory) => void;
  icon: string;
  label: string;
}

function SearchTab({ category, activeCategory, onClick, icon, label }: SearchTabProps) {
  const isActive = category === activeCategory;
  
  // Get the correct icon based on active state
  const getIcon = () => {
    if (isActive) {
      switch (category) {
        case 'all':
          return searchIconsActive.binoculars;
        case 'events':
          return searchIconsActive.calendar;
        case 'nightlife':
          return searchIconsActive.mapPin;
        default:
          return icon;
      }
    }
    return icon;
  };
  
  return (
    <button
      className={`box-border content-stretch flex flex-row gap-2 items-center justify-center p-[8px] relative shrink-0 transition-colors ${
        isActive ? 'border-b-2 border-[#fb7102]' : 'hover:bg-gray-50'
      }`}
      onClick={() => onClick(category)}
    >
      <div className="relative shrink-0 size-5">
        <Image alt="Search icon" className="block max-w-none size-full" src={getIcon()} width={24} height={24} />
      </div>
      <div className={`font-semibold leading-[0] not-italic relative shrink-0 text-[18px] text-center text-nowrap ${
        isActive ? 'text-[#fb7102]' : 'text-[#000000]'
      }`}>
        <p className="block leading-[1.65] whitespace-pre">{label}</p>
      </div>
    </button>
  );
}

// Events view filter components
function DateRangePicker({ dateRange, onChange: __onChange }: { dateRange: DateRange; onChange: (range: DateRange) => void }) {
  return (
    <button className="box-border content-stretch flex flex-row gap-5 h-[55px] items-center justify-start px-5 py-1.5 relative rounded-[32px] shrink-0 border border-[#dddddd] hover:border-gray-300 transition-colors">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
        <div className="relative shrink-0 size-4">
          <Image alt="Calendar icon" className="block max-w-none size-full" src={eventsIcons.calendarSmall} width={16} height={16} />
        </div>
        <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#272b35] text-[16px] text-left text-nowrap">
          <p className="block leading-[1.45] whitespace-pre">{dateRange.start}</p>
        </div>
        <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#272b35] text-[16px] text-left text-nowrap">
          <p className="block leading-[1.45] whitespace-pre">-</p>
        </div>
        <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#272b35] text-[16px] text-left text-nowrap">
          <p className="block leading-[1.45] whitespace-pre">{dateRange.end}</p>
        </div>
      </div>
      <div className="relative shrink-0 size-5">
        <Image alt="Dropdown arrow" className="block max-w-none size-full" src={eventsIcons.chevronDown} width={16} height={16} />
      </div>
    </button>
  );
}

function CategorySelector({ category, onChange: __onChange }: { category: string; onChange: (category: string) => void }) {
  return (
    <button className="box-border content-stretch flex flex-row gap-5 h-[55px] items-center justify-start px-5 py-1.5 relative rounded-[32px] shrink-0 border border-[#dddddd] hover:border-gray-300 transition-colors">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
        <div className="font-normal leading-[0] not-italic relative shrink-0 text-[#50576b] text-[16px] text-left text-nowrap">
          <p className="block leading-[1.65] whitespace-pre">{category}</p>
        </div>
      </div>
      <div className="relative shrink-0 size-5">
        <Image alt="Dropdown arrow" className="block max-w-none size-full" src={eventsIcons.chevronDown} width={16} height={16} />
      </div>
    </button>
  );
}

function BudgetSelector({ budget, onChange: __onChange }: { budget: string; onChange: (budget: string) => void }) {
  return (
    <button className="box-border content-stretch flex flex-row gap-5 h-[55px] items-center justify-start px-5 py-1.5 relative rounded-[32px] shrink-0 border border-[#dddddd] hover:border-gray-300 transition-colors">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
        <div className="relative shrink-0 size-4">
          <Image alt="Price icon" className="block max-w-none size-full" src={eventsIcons.dollarSign} width={16} height={16} />
        </div>
        <div className="font-normal leading-[0] not-italic relative shrink-0 text-[#50576b] text-[16px] text-left text-nowrap">
          <p className="block leading-[1.65] whitespace-pre">{budget}</p>
        </div>
      </div>
      <div className="relative shrink-0 size-5">
        <Image alt="Dropdown arrow" className="block max-w-none size-full" src={eventsIcons.chevronDown} width={16} height={16} />
      </div>
    </button>
  );
}

function AreaSelector({ area, onChange: __onChange }: { area: string; onChange: (area: string) => void }) {
  return (
    <button className="basis-0 box-border content-stretch flex flex-row gap-5 grow h-[55px] items-center justify-start min-h-px min-w-px px-5 py-1.5 relative rounded-[32px] shrink-0 border border-[#dddddd] hover:border-gray-300 transition-colors">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
        <div className="relative shrink-0 size-4">
          <Image alt="Price icon" className="block max-w-none size-full" src={eventsIcons.dollarSign} width={16} height={16} />
        </div>
        <div className="font-normal leading-[0] not-italic relative shrink-0 text-[#50576b] text-[16px] text-left text-nowrap">
          <p className="block leading-[1.65] whitespace-pre">{area}</p>
        </div>
      </div>
      <div className="relative shrink-0 size-5">
        <Image alt="Dropdown arrow" className="block max-w-none size-full" src={eventsIcons.chevronDown} width={16} height={16} />
      </div>
    </button>
  );
}

// Filter state interfaces
interface DateRange {
  start: string;
  end: string;
}

interface FilterState {
  dateRange: DateRange;
  category: string;
  budget: string;
  area: string;
}

export default function HomeSearch() {
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: 'Jul 12', end: 'Jul 19' },
    category: 'All Categories',
    budget: 'Any budget',
    area: 'Any area'
  });

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'in category:', activeCategory, 'with filters:', filters);
    // Here you would implement the actual search functionality
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Dynamic content based on active category
  const getTitle = () => {
    if (activeCategory === 'events') {
      return (
        <p className="font-medium leading-[1.2]">
          <span>Find Amazing Events in </span>
          <span className="text-[#fb7102] underline decoration-wavy underline-offset-[18.5%]">
            Lagos
          </span>
        </p>
      );
    }
    if (activeCategory === 'nightlife') {
      return (
        <p className="font-medium leading-[1.2]">
          <span>Do something fun in </span>
          <span className="text-[#fb7102] underline decoration-wavy underline-offset-[18.5%]">
            Lagos
          </span>
        </p>
      );
    }
    return (
      <>
        <p className="block font-medium leading-[1.2] mb-0">
          Seeking Unforgettable
        </p>
        <p className="font-medium leading-[1.2]">
          <span>Experiences in </span>
          <span className="text-[#fb7102] underline decoration-wavy underline-offset-[18.5%]">
            Lagos
          </span>
          <span>?</span>
        </p>
      </>
    );
  };

  const getSearchPlaceholder = () => {
    if (activeCategory === 'events') {
      return 'Event name or venue...';
    }
    if (activeCategory === 'nightlife') {
      return 'Bar, club, or lounge name...';
    }
    return 'Search for events, nightlife, venues...';
  };

  // Get active tab display
  const getActiveTabDisplay = (tabCategory: SearchCategory) => {
    return tabCategory === activeCategory;
  };

  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start max-w-[1440px] px-8 py-16 relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start max-w-[720px] p-0 relative shrink-0 w-full">
          {/* Dynamic Hero Title */}
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-full">
            <div className="leading-[0] not-italic relative shrink-0 text-[#000000] text-[44px] text-center tracking-[-1.32px]">
              {getTitle()}
            </div>
          </div>

          {/* Search Wrapper */}
          <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
            {/* Search Category Tabs */}
            <div className="box-border content-stretch flex flex-row gap-4 items-center justify-center p-0 relative shrink-0 w-full">
              <SearchTab
                category="all"
                activeCategory={getActiveTabDisplay('all') ? 'all' : 'none'}
                onClick={setActiveCategory}
                icon={searchIcons.binoculars}
                label="Search All"
              />
              <SearchTab
                category="events"
                activeCategory={getActiveTabDisplay('events') ? 'events' : 'none'}
                onClick={setActiveCategory}
                icon={searchIcons.calendar}
                label="Events"
              />
              <SearchTab
                category="nightlife"
                activeCategory={getActiveTabDisplay('nightlife') ? 'nightlife' : 'none'}
                onClick={setActiveCategory}
                icon={searchIcons.mapPin}
                label="Nightlife"
              />
            </div>

            {/* Dynamic Search Form */}
            {activeCategory === 'events' ? (
              /* Events View with Filters */
              <div className="box-border content-stretch flex flex-col gap-3 items-center justify-start p-0 relative shrink-0 w-full">
                {/* Search Input */}
                <div className="box-border content-stretch flex flex-row gap-2 h-[55px] items-center justify-start min-w-[440px] px-5 py-1.5 relative rounded-[32px] shrink-0 w-full border border-[#dddddd] bg-white hover:border-gray-300 focus-within:border-[#fb7102] transition-colors">
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                    <div className="relative shrink-0 size-5">
                      <Image alt="Search icon" className="block max-w-none size-full" src={searchIcons.search} width={20} height={20} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={getSearchPlaceholder()}
                      className="font-normal leading-[0] not-italic flex-1 text-[#50576b] text-[16px] text-left bg-transparent border-none outline-none placeholder:text-[#50576b] min-w-0"
                    />
                  </div>
                </div>
                
                {/* Filters Row */}
                <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0 w-full">
                  <DateRangePicker 
                    dateRange={filters.dateRange} 
                    onChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
                  />
                  <CategorySelector 
                    category={filters.category} 
                    onChange={(category) => setFilters(prev => ({ ...prev, category }))}
                  />
                  <BudgetSelector 
                    budget={filters.budget} 
                    onChange={(budget) => setFilters(prev => ({ ...prev, budget }))}
                  />
                  
                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="bg-[#000000] box-border content-stretch flex flex-row gap-2 h-[55px] items-center justify-center px-6 py-3 relative rounded-[32px] shrink-0 hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
                      <p className="block leading-[normal] whitespace-pre">Search</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : activeCategory === 'nightlife' ? (
              /* Nightlife View with Area and Budget Filters */
              <div className="box-border content-stretch flex flex-col gap-3 items-center justify-start p-0 relative shrink-0 w-full max-w-[600px]">
                {/* Search Input */}
                <div className="box-border content-stretch flex flex-row gap-2 h-[55px] items-center justify-start min-w-[440px] px-5 py-1.5 relative rounded-[32px] shrink-0 w-full border border-[#dddddd] bg-white hover:border-gray-300 focus-within:border-[#fb7102] transition-colors">
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                    <div className="relative shrink-0 size-5">
                      <Image alt="Search icon" className="block max-w-none size-full" src={searchIcons.search} width={20} height={20} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={getSearchPlaceholder()}
                      className="font-normal leading-[0] not-italic flex-1 text-[#50576b] text-[16px] text-left bg-transparent border-none outline-none placeholder:text-[#50576b] min-w-0"
                    />
                  </div>
                </div>
                
                {/* Filters Row */}
                <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0 w-full">
                  <AreaSelector 
                    area={filters.area} 
                    onChange={(area) => setFilters(prev => ({ ...prev, area }))}
                  />
                  <BudgetSelector 
                    budget={filters.budget} 
                    onChange={(budget) => setFilters(prev => ({ ...prev, budget }))}
                  />
                  
                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="bg-[#000000] box-border content-stretch flex flex-row gap-2 h-[55px] items-center justify-center px-6 py-3 relative rounded-[32px] shrink-0 hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
                      <p className="block leading-[normal] whitespace-pre">Search</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Default View (All) */
              <div className="box-border content-stretch flex flex-col gap-4 items-center justify-start p-0 relative shrink-0 w-full">
                <div className="box-border content-stretch flex flex-row gap-3 items-start justify-center p-0 relative shrink-0 w-full">
                  {/* Search Input */}
                  <div className="basis-0 box-border content-stretch flex flex-row gap-2 grow h-[55px] items-center justify-start min-h-px min-w-[440px] px-5 py-1.5 relative rounded-[32px] shrink-0 border border-[#dddddd] bg-white hover:border-gray-300 focus-within:border-[#fb7102] transition-colors">
                    <div className="basis-0 box-border content-stretch flex flex-row gap-2 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                      <div className="relative shrink-0 size-5">
                        <Image alt="Search icon" className="block max-w-none size-full" src={searchIcons.search} width={20} height={20} />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={getSearchPlaceholder()}
                        className="font-normal leading-[0] not-italic flex-1 text-[#50576b] text-[16px] text-left bg-transparent border-none outline-none placeholder:text-[#50576b]"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="bg-[#000000] box-border content-stretch flex flex-row gap-2 h-[55px] items-center justify-center px-6 py-3 relative rounded-[32px] shrink-0 hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
                      <p className="block leading-[normal] whitespace-pre">Search</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}