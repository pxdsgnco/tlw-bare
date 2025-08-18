'use client';

import { useRef } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface NightlifeSpot {
  id: string;
  title: string;
  description: string;
  image: string;
}

const nightlifeSpots: NightlifeSpot[] = [
  {
    id: '1',
    title: 'The Beach by Gusto',
    description: 'Tropicana Sunday event is all about good music, live amapiano mostly for ballers who want to party all night',
    image: 'http://localhost:3845/assets/3afac2c738c7018d7bf309846caa67b780616cc4.png'
  },
  {
    id: '2',
    title: 'Citi Lounge',
    description: "You shouldn't miss the CITI SUNDAYS, elevate your weekend with our delectable dining experience",
    image: 'http://localhost:3845/assets/a8cb75f463bd045e94326e41d5168e6fad43935a.png'
  },
  {
    id: '3',
    title: 'Bature Breweries',
    description: 'Best for after work casual hangouts, great and affordable food and drinks',
    image: 'http://localhost:3845/assets/8046e173090ef29587471e65277be6fe55b92257.png'
  },
  {
    id: '4',
    title: 'Hard Rock Cafe',
    description: 'Amapiano vibes, high energy, mostly for ballers and entertainers. Reservation needed.',
    image: 'http://localhost:3845/assets/10463b494ce425e80cf3784c513861a17c41c5bd.png'
  }
];

interface NightlifeCardProps {
  spot: NightlifeSpot;
  onClick: (spot: NightlifeSpot) => void;
}

function NightlifeCard({ spot, onClick }: NightlifeCardProps) {
  return (
    <div 
      className="basis-0 box-border content-stretch flex flex-col gap-5 grow items-start justify-start min-h-px min-w-[372px] p-0 relative shrink-0 cursor-pointer group"
      onClick={() => onClick(spot)}
    >
      {/* Image */}
      <div
        className="bg-center bg-cover bg-no-repeat h-[280px] shrink-0 w-full overflow-hidden group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url('${spot.image}')` }}
      />
      
      {/* Content */}
      <div className="box-border content-stretch flex flex-row gap-8 items-start justify-start p-0 relative shrink-0 w-full">
        <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left">
          <div className="font-medium relative shrink-0 text-[#000000] text-[18px] tracking-[-0.18px] w-full">
            <p className="block leading-[normal]">{spot.title}</p>
          </div>
          <div className="font-medium overflow-ellipsis overflow-hidden relative shrink-0 text-[#697289] text-[14px] tracking-[-0.14px] w-full line-clamp-3">
            <p className="block leading-[20px]">{spot.description}</p>
          </div>
        </div>
        <div className="relative shrink-0 size-6 text-[#697289] group-hover:text-[#fb7102] transition-colors">
          <ArrowUpRight className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function Nightlife() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSpotClick = (spot: NightlifeSpot) => {
    console.log('Nightlife spot clicked:', spot.title);
    // Here you would implement navigation to spot details
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  const handleViewAll = () => {
    console.log('View all nightlife spots');
    // Here you would implement navigation to nightlife page
  };

  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-10 items-start justify-start max-w-[1440px] pb-[100px] pt-[60px] px-8 relative shrink-0 w-full">
        
        {/* Section Header */}
        <div className="box-border content-stretch flex flex-row gap-11 items-end justify-start leading-[0] not-italic p-0 relative shrink-0 w-full">
          <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0 text-left">
            <div className="font-medium relative shrink-0 text-[#13151a] text-[32px] w-full">
              <p className="block leading-[1.2]">Hottest Nightlife Spots</p>
            </div>
            <div className="font-normal relative shrink-0 text-[#50576b] text-[16px] w-full">
              <p className="block leading-[1.2]">
                Check out the very best spots tastefully curated for you by our editors
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

        {/* Content Section */}
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start overflow-hidden p-0 relative shrink-0 w-full">
          <div className="relative w-full group">
            
            {/* Left Navigation Button */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
              style={{ transform: 'translateY(-50%) translateX(-50%)' }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Posts Carousel */}
            <div
              ref={scrollContainerRef}
              className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0 overflow-x-auto scroll-smooth scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {nightlifeSpots.map((spot) => (
                <NightlifeCard
                  key={spot.id}
                  spot={spot}
                  onClick={handleSpotClick}
                />
              ))}
            </div>

            {/* Right Navigation Button */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
              style={{ transform: 'translateY(-50%) translateX(50%)' }}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Gradient Fade Effect */}
            <div className="absolute bg-gradient-to-r from-transparent h-[375px] right-0 to-white to-[115.65%] top-0 w-[115px] pointer-events-none" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}