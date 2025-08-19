'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholderImages';

interface Story {
  id: string;
  title: string;
  thumbnail: string;
  isViewed?: boolean;
}

const stories: Story[] = [
  { id: '1', title: 'Ballers Carnival', thumbnail: PLACEHOLDER_IMAGES.event_1 },
  { id: '2', title: 'Moroccan NightBar 38', thumbnail: PLACEHOLDER_IMAGES.event_2 },
  { id: '3', title: 'Capital Club', thumbnail: PLACEHOLDER_IMAGES.event_3 },
  { id: '4', title: 'Malinese Hard Rock Cafe', thumbnail: PLACEHOLDER_IMAGES.event_1 },
  { id: '5', title: 'Bar 38', thumbnail: PLACEHOLDER_IMAGES.event_2 },
  { id: '6', title: 'Lagos Galleria', thumbnail: PLACEHOLDER_IMAGES.event_3 },
  { id: '7', title: 'Night of a Thousand Laffs', thumbnail: PLACEHOLDER_IMAGES.event_1 },
  { id: '8', title: 'Basketmouth', thumbnail: PLACEHOLDER_IMAGES.event_2 },
  { id: '9', title: 'The Coliseum', thumbnail: PLACEHOLDER_IMAGES.event_3 },
  { id: '10', title: 'Sip Lounge rave', thumbnail: PLACEHOLDER_IMAGES.event_1 },
  { id: '11', title: 'Quilox Gala', thumbnail: PLACEHOLDER_IMAGES.event_2 },
  { id: '12', title: 'Rendezvous', thumbnail: PLACEHOLDER_IMAGES.event_3 },
  { id: '13', title: 'Prima Dona Ikoyi Club', thumbnail: PLACEHOLDER_IMAGES.event_1 },
  { id: '14', title: 'Severe', thumbnail: PLACEHOLDER_IMAGES.event_2 }
];

interface StoryItemProps {
  story: Story;
  onClick: (story: Story) => void;
}

function StoryItem({ story, onClick }: StoryItemProps) {
  return (
    <div 
      className="relative shrink-0 cursor-pointer group"
      onClick={() => onClick(story)}
    >
      <div className="flex flex-col gap-2 items-center justify-start p-0 relative">
        {/* Story Circle with Border */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[5px] relative rounded-full shrink-0 w-[82px] group-hover:scale-105 transition-transform">
          <div className="absolute border-[#fb7102] border-[3px] border-solid inset-0 pointer-events-none rounded-full" />
          <div className="basis-0 bg-[#eeeeee] grow h-[72px] min-h-px min-w-px relative rounded-full shrink-0 overflow-hidden">
            <Image
              src={story.thumbnail}
              alt={`${story.title} story thumbnail`}
              width={72}
              height={72}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
        </div>
        
        {/* Story Title */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-2 py-0 relative shrink-0 w-[84px]">
          <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#1c1c1c] text-[13px] text-center">
            <p className="block leading-[normal] overflow-hidden text-ellipsis truncate">
              {story.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LatestStories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleStoryClick = (story: Story) => {
    console.log('Story clicked:', story.title);
    // Here you would implement story viewing functionality
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start max-w-[1440px] overflow-hidden px-8 py-6 relative shrink-0 w-full">
        

        {/* Stories Container with Navigation */}
        <div className="relative w-full">
          
          {/* Left Navigation Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            style={{ transform: 'translateY(-50%) translateX(-50%)' }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Stories List */}
          <div
            ref={scrollContainerRef}
            className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative overflow-x-auto scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story) => (
              <StoryItem
                key={story.id}
                story={story}
                onClick={handleStoryClick}
              />
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            style={{ transform: 'translateY(-50%) translateX(50%)' }}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Gradient Fade Effect */}
          <div className="absolute bg-gradient-to-r bottom-0 from-transparent right-0 to-white to-[63.942%] top-0 w-[168px] pointer-events-none" />
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}