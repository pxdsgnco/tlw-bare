'use client';

import { useState, useCallback } from 'react';
import EventsPageHeader from '@/components/events/EventsPageHeader';
import EventsFilter from '@/components/events/EventsFilter';
import EventsMain from '@/components/events/EventsMain';
import EventsPagination from '@/components/events/EventsPagination';
import { EventData } from '@/components/events/EventCard';

export default function Events() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    timeFilter: 'ALL' as 'ALL' | 'DAY' | 'NIGHT',
    layoutType: 'grid' as 'grid' | 'list',
    priceRange: 'All Prices',
    location: 'All Locations',
    category: 'All Categories',
    showCount: '9'
  });
  
  // Sample event data - this would typically come from an API
  const sampleEvents: EventData[] = [
    {
      id: '1',
      title: 'Rebirth (Dance with JECO)',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: 'Club House QMB',
      image: 'http://localhost:3845/assets/e082d28960cae8df25e6b34174b5e3104581d729.png',
      tags: [{ label: 'Rave', color: 'primary' }, { label: 'Dance' }],
      category: 'Rave'
    },
    {
      id: '2',
      title: 'Slides & Shots - Presentation Night',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: "The Joydragger's House",
      image: 'http://localhost:3845/assets/0a93470acdd29c87aed803716725923a770ad82e.png',
      tags: [{ label: 'Party' }, { label: 'Social Gathering' }],
    },
    {
      id: '3',
      title: 'Karaoke Traffic Vibes (KTV)',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: 'Bature Brewery',
      image: 'http://localhost:3845/assets/8046e173090ef29587471e65277be6fe55b92257.png',
      tags: [{ label: 'Nightlife' }, { label: 'Life Event' }],
    },
    {
      id: '4',
      title: 'In the Loop',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: 'Danfo Secret Garden Restaurant',
      image: 'http://localhost:3845/assets/e9c428a662aa6298bcdf68f195b889d5ae89cce7.png',
      tags: [{ label: 'Nightlife' }],
    },
    {
      id: '5',
      title: 'Afrobeats Night Live',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: 'Terra Kulture',
      image: 'http://localhost:3845/assets/41347ea797ef852dad2b152da36e0727753474c1.png',
      tags: [{ label: 'Concert' }, { label: 'Live Music' }],
    },
    {
      id: '6',
      title: 'Lagos Food Festival',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: 'Tafawa Balewa Square (TBS)',
      image: 'http://localhost:3845/assets/2aa847eb2f832899047152254e921e1bf65b0fee.png',
      tags: [{ label: 'Festival' }, { label: 'Food' }],
    },
    {
      id: '7',
      title: 'Jazz in the Park',
      date: 'Jun 13, 2025',
      time: '7:00 PM',
      venue: 'Freedom Park',
      image: 'http://localhost:3845/assets/e082d28960cae8df25e6b34174b5e3104581d729.png',
      tags: [{ label: 'Jazz' }, { label: 'Music' }],
    },
    {
      id: '8',
      title: 'Art Exhibition Opening',
      date: 'Jun 14, 2025',
      time: '6:00 PM',
      venue: 'Nike Art Gallery',
      image: 'http://localhost:3845/assets/0a93470acdd29c87aed803716725923a770ad82e.png',
      tags: [{ label: 'Art' }, { label: 'Exhibition' }],
    },
    {
      id: '9',
      title: 'Comedy Night Lagos',
      date: 'Jun 15, 2025',
      time: '8:30 PM',
      venue: 'Hard Rock Cafe',
      image: 'http://localhost:3845/assets/8046e173090ef29587471e65277be6fe55b92257.png',
      tags: [{ label: 'Comedy' }, { label: 'Entertainment' }],
    },
  ];

  const eventsPerPage = parseInt(filters.showCount);
  const totalPages = Math.ceil(sampleEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = sampleEvents.slice(startIndex, startIndex + eventsPerPage);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleEventClick = (event: EventData) => {
    console.log('Event clicked:', event.title);
    // Here you would implement navigation to event details
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      <EventsPageHeader />
      <EventsFilter onFilterChange={handleFilterChange} />
      <EventsMain 
        events={currentEvents} 
        onEventClick={handleEventClick} 
      />
      <EventsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}