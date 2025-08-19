'use client';

import { useState } from 'react';
import NightlifePageHeader from '@/components/nightlife/NightlifePageHeader';
import NightlifeFilters from '@/components/nightlife/NightlifeFilters';
import NightlifeGrid from '@/components/nightlife/NightlifeGrid';
import NightlifePagination from '@/components/nightlife/NightlifePagination';

interface FilterState {
  category: string;
  budget: string;
  valetParking: string;
  reservations: string;
  showCount: string;
}

export default function Nightlife() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All Categories',
    budget: 'All Budgets',
    valetParking: 'All Options',
    reservations: 'All',
    showCount: '9'
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSpotClick = (spot: { id: string; name: string; location: string; budgetLevel: string; category: string }) => {
    console.log('Nightlife spot clicked:', spot);
    window.location.href = `/nightlife/${spot.id}`;
  };

  // Calculate total pages based on mock data and show count
  const totalSpots = 9; // This would come from your data source
  const spotsPerPage = parseInt(filters.showCount);
  const totalPages = Math.ceil(totalSpots / spotsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <NightlifePageHeader />
      <NightlifeFilters onFilterChange={handleFilterChange} />
      <NightlifeGrid 
        showCount={spotsPerPage}
        onSpotClick={handleSpotClick}
      />
      {totalPages > 1 && (
        <NightlifePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}