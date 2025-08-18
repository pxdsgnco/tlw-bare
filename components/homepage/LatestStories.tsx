'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  thumbnail: string;
  isViewed?: boolean;
}

const stories: Story[] = [
  { id: '1', title: 'Ballers Carnival', thumbnail: 'http://localhost:3845/assets/d37a89481ea529deeaf50034865c73e1d3fae330.png' },
  { id: '2', title: 'Moroccan NightBar 38', thumbnail: 'http://localhost:3845/assets/e92bbeabdc9a12d15f841e9faf5982e29ea6c5aa.png' },
  { id: '3', title: 'Capital Club', thumbnail: 'http://localhost:3845/assets/486df3fc48656b28a40d576c2053ebcfd0e0c447.png' },
  { id: '4', title: 'Malinese Hard Rock Cafe', thumbnail: 'http://localhost:3845/assets/8b7676f3de862ecd61a867b1e81e1df9bafb35d4.png' },
  { id: '5', title: 'Bar 38', thumbnail: 'http://localhost:3845/assets/7b4aa06550511e90a4f5933d8ae934c06522944a.png' },
  { id: '6', title: 'Lagos Galleria', thumbnail: 'http://localhost:3845/assets/2bb53d140ed5d82d07d08411fbc86274b6489195.png' },
  { id: '7', title: 'Night of a Thousand Laffs', thumbnail: 'http://localhost:3845/assets/6e29e43c28d985b3f28b7f4663e73e90d69a8935.png' },
  { id: '8', title: 'Basketmouth', thumbnail: 'http://localhost:3845/assets/e5c77c9082b536148adfec28a455c37d857ff6e2.png' },
  { id: '9', title: 'The Coliseum', thumbnail: 'http://localhost:3845/assets/a45480b8b703f378a8b40c140267037cc1f9392e.png' },
  { id: '10', title: 'Sip Lounge rave', thumbnail: 'http://localhost:3845/assets/219ec81d41961f75b8b444e070118c93477195b8.png' },
  { id: '11', title: 'Quilox Gala', thumbnail: 'http://localhost:3845/assets/7479c09664097447c40e44a809c65847dcd93360.png' },
  { id: '12', title: 'Rendezvous', thumbnail: 'http://localhost:3845/assets/394685c14b893b65ac3248f46d13fd466b453c02.png' },
  { id: '13', title: 'Prima Dona Ikoyi Club', thumbnail: 'http://localhost:3845/assets/fc9438b915bf3580a2e3c9966f311eee25aa2533.png' },
  { id: '14', title: 'Severe', thumbnail: 'http://localhost:3845/assets/f13dad9ad00a251b654e2fdb3bf569de05eda269.png' }
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
          <div
            className="basis-0 bg-[#eeeeee] bg-center bg-cover grow h-[72px] min-h-px min-w-px relative rounded-full shrink-0"
            style={{ backgroundImage: `url('${story.thumbnail}')` }}
          >
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[72px] w-full rounded-full" />
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