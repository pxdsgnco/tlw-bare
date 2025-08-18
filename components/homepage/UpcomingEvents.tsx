'use client';

import Image from 'next/image';

const calendarIcon = "http://localhost:3845/assets/9121b333c9d40af775613f2243fbd0624ce7cabc.svg";

// Types for event data
interface EventTag {
  label: string;
  color?: 'default' | 'primary';
}

interface EventData {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
  tags: EventTag[];
  category?: string;
}

// Tag component for reusability
interface TagProps {
  label: string;
  color?: 'default' | 'primary';
}

function EventTag({ label, color = 'default' }: TagProps) {
  const baseClasses = "box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-1.5 relative rounded-2xl shrink-0 border";
  const colorClasses = color === 'primary' 
    ? "border-[rgba(0,0,0,0.7)] bg-[rgba(0,0,0,0.7)] text-[#ffffff]"
    : "border-[#d9dfe8] bg-transparent text-[#3d4354]";

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <div className="font-medium leading-[0] not-italic relative shrink-0 text-[12px] text-left text-nowrap">
        <p className="block leading-[16px] whitespace-pre">{label}</p>
      </div>
    </div>
  );
}

// Featured Event Card (Large card on the left)
interface FeaturedEventCardProps {
  event: EventData;
  onClick: (event: EventData) => void;
}

function FeaturedEventCard({ event, onClick }: FeaturedEventCardProps) {
  return (
    <div
      className="basis-0 bg-center bg-cover bg-no-repeat box-border content-stretch flex flex-col gap-[499px] grow h-[541px] items-end justify-start min-h-px min-w-96 p-[28px] relative shrink-0 cursor-pointer group overflow-hidden"
      style={{ backgroundImage: `url('${event.image}')` }}
      onClick={() => onClick(event)}
    >
      {/* Gradient Overlay */}
      <div className="absolute bg-gradient-to-b from-transparent from-[61.738%] inset-0 to-black" />
      
      {/* Category Tag */}
      {event.category && (
        <div className="absolute bg-[rgba(0,0,0,0.7)] box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-1.5 right-7 rounded-2xl top-7 z-10 border border-[rgba(0,0,0,0.7)]">
          <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap tracking-[-0.12px]">
            <p className="block leading-[16px] whitespace-pre">{event.category}</p>
          </div>
        </div>
      )}

      {/* Event Details */}
      <div className="absolute bottom-7 box-border content-stretch flex flex-col gap-2 items-start justify-start left-7 p-0 right-7 z-10">
        <div className="font-medium leading-[0] not-italic opacity-70 relative shrink-0 text-[#ffffff] text-[14px] text-left tracking-[-0.14px] w-full">
          <p className="block leading-[20px]">{event.date}</p>
        </div>
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[#ffffff] text-left w-full">
          <div className="font-medium relative shrink-0 text-[24px] tracking-[-0.72px] w-full">
            <p className="block leading-[32px]">{event.title}</p>
          </div>
          <div className="font-normal opacity-70 relative shrink-0 text-[16px] tracking-[-0.16px] w-full">
            <p className="block leading-[24px]">{event.venue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Regular Event Card (Smaller cards on the right)
interface EventCardProps {
  event: EventData;
  onClick: (event: EventData) => void;
}

function EventCard({ event, onClick }: EventCardProps) {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-5 items-center justify-start p-0 relative rounded-[20px] shrink-0 w-full cursor-pointer group"
      onClick={() => onClick(event)}
    >
      {/* Event Image */}
      <div
        className="bg-center bg-cover bg-no-repeat h-[164.12px] shrink-0 w-[219px] overflow-hidden group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url('${event.image}')` }}
      />
      
      {/* Event Content */}
      <div className="basis-0 box-border content-stretch flex flex-col gap-5 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
        {/* Event Details */}
        <div className="box-border content-stretch flex flex-col gap-2 h-24 items-start justify-start p-0 relative shrink-0 w-[213px]">
          {/* Date */}
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
            <div className="relative shrink-0 size-4">
              <Image alt="Calendar icon" className="block max-w-none size-full" src={calendarIcon} width={20} height={20} />
            </div>
            <div className="basis-0 font-medium grow leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#697289] text-[12px] text-left">
              <p className="block leading-[16px]">{event.date}</p>
            </div>
          </div>
          
          {/* Title */}
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-full">
            <div className="basis-0 font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#13151a] text-[18px] text-left tracking-[-0.18px]">
              <p className="block leading-[24px]">{event.title}</p>
            </div>
          </div>
          
          {/* Venue */}
          <div className="font-medium leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#fb7102] text-[14px] text-left tracking-[-0.14px] w-full line-clamp-1">
            <p className="block leading-[1.35]">{event.venue}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full flex-wrap">
          {event.tags.map((tag, index) => (
            <EventTag key={index} label={tag.label} color={tag.color} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Upcoming Events Component
export default function UpcomingEvents() {
  // Sample event data
  const featuredEvent: EventData = {
    id: '1',
    title: 'Rebirth (Dance with JECO)',
    date: 'Jun 20, 2025',
    venue: 'Club Hous QMB',
    image: 'http://localhost:3845/assets/e082d28960cae8df25e6b34174b5e3104581d729.png',
    category: 'Rave',
    tags: []
  };

  const regularEvents: EventData[] = [
    {
      id: '2',
      title: 'Slides & Shots - Presentation Night',
      date: 'June 12, 2025',
      venue: 'The Joydragger\'s House',
      image: 'http://localhost:3845/assets/1953a23fc777c86e3713455649ecb6037575674b.png',
      tags: [
        { label: 'Party' },
        { label: 'Social Gathering' }
      ]
    },
    {
      id: '3',
      title: 'Karaoke Traffic Vibes (KTV)',
      date: 'June 12, 2025',
      venue: 'Bature Brewery',
      image: 'http://localhost:3845/assets/b650196d90f4ea7f5eaa8233621eff9658d08ff0.png',
      tags: [
        { label: 'Nightlife' },
        { label: 'Life Event' }
      ]
    },
    {
      id: '4',
      title: 'In the Loop',
      date: 'May 25, 2025',
      venue: 'Danfo Secret Cardem Restaurant',
      image: 'http://localhost:3845/assets/0a867a42c55fdf4985032b12a9815506a5ad3a4d.png',
      tags: [
        { label: 'Nightlife' }
      ]
    }
  ];

  const handleEventClick = (event: EventData) => {
    console.log('Event clicked:', event.title);
    // Here you would implement navigation to event details
  };

  const handleViewAll = () => {
    console.log('View all events');
    // Here you would implement navigation to events page
  };

  return (
    <div className="bg-[#f8f8f8] box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-10 items-start justify-start max-w-[1440px] px-8 py-[100px] relative shrink-0 w-full">
        
        {/* Section Header */}
        <div className="box-border content-stretch flex flex-row gap-11 h-[65px] items-end justify-start leading-[0] not-italic p-0 relative shrink-0 w-full">
          <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0 text-left">
            <div className="font-medium relative shrink-0 text-[#13151a] text-[32px] w-full">
              <p className="block leading-[1.2]">Upcoming Events</p>
            </div>
            <div className="font-normal relative shrink-0 text-[#50576b] text-[16px] w-full">
              <p className="block leading-[1.2]">
                Best events in Lagos you don&apos;t want to miss out on for anything
              </p>
            </div>
          </div>
          <button
            onClick={handleViewAll}
            className="font-semibold relative shrink-0 text-[#fb7102] text-[14px] text-nowrap text-right hover:underline transition-all"
          >
            <p className="block leading-[1.2] whitespace-pre">View all</p>
          </button>
        </div>

        {/* Events Content */}
        <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          {/* Featured Event (Left Side) */}
          <FeaturedEventCard 
            event={featuredEvent} 
            onClick={handleEventClick} 
          />

          {/* Regular Events (Right Side) */}
          <div className="basis-0 box-border content-stretch flex flex-col gap-6 grow items-start justify-start max-w-[452px] min-h-px min-w-px p-0 relative shrink-0">
            {regularEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}