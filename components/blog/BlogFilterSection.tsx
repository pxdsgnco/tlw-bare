'use client';

import SelectField from '@/components/ui/SelectField';

interface BlogFilterSectionProps {
  selectedCategory: string;
  selectedSort: string;
  selectedShow: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onShowChange: (show: string) => void;
}

export default function BlogFilterSection({
  selectedCategory,
  selectedSort,
  selectedShow,
  onCategoryChange,
  onSortChange,
  onShowChange
}: BlogFilterSectionProps) {
  const categoryOptions = [
    'All Categories',
    'Events',
    'Things to do',
    'Travel',
    'Food',
    'Fashion',
    'Entertainment'
  ];

  const sortOptions = [
    'Most Recent',
    'Oldest First',
    'Most Popular'
  ];

  const showOptions = [
    '6',
    '9',
    '12',
    '15'
  ];

  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-row items-start justify-between max-w-[1440px] pb-5 pt-16 px-16 relative shrink-0 w-full">
        
        {/* Category Filter */}
        <SelectField
          label="Category"
          value={selectedCategory}
          options={categoryOptions}
          onChange={onCategoryChange}
          width="w-60"
        />

        {/* Sort and Show Filters */}
        <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0">
          <SelectField
            label="Sort"
            value={selectedSort}
            options={sortOptions}
            onChange={onSortChange}
            width="w-[220px]"
          />
          
          <SelectField
            label="Show"
            value={selectedShow}
            options={showOptions}
            onChange={onShowChange}
            width="w-28"
          />
        </div>
      </div>
    </div>
  );
}