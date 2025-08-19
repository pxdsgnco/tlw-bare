'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholderImages';

interface FeaturedEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
  category: string;
}

const featuredEvents: FeaturedEvent[] = [
  {
    id: '1',
    title: 'Make Music Lagos',
    date: 'Jun 21, 2025',
    venue: 'LiveSpot Entertarium',
    image: PLACEHOLDER_IMAGES.hero_1,
    category: 'Featured Event'
  },
  {
    id: '2', 
    title: 'Lagos Jazz Festival',
    date: 'Jul 15, 2025',
    venue: 'Tafawa Balewa Square',
    image: PLACEHOLDER_IMAGES.hero_2,
    category: 'Featured Event'
  },
  {
    id: '3',
    title: 'Afrobeats Concert',
    date: 'Aug 10, 2025', 
    venue: 'National Stadium',
    image: PLACEHOLDER_IMAGES.hero_1,
    category: 'Featured Event'
  },
  {
    id: '4',
    title: 'Comedy Night Special',
    date: 'Sep 5, 2025',
    venue: 'Eko Convention Centre',
    image: PLACEHOLDER_IMAGES.hero_2,
    category: 'Featured Event'
  },
  {
    id: '5',
    title: 'Fashion Week Lagos',
    date: 'Oct 20, 2025',
    venue: 'Victoria Island',
    image: PLACEHOLDER_IMAGES.hero_1,
    category: 'Featured Event'
  }
];

export default function FeaturedTrends() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    setIsAutoPlaying(false);
  };

  const currentEvent = featuredEvents[currentSlide];

  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-[52px] items-start justify-start max-w-[1440px] pb-10 pt-6 px-8 relative shrink-0 w-full">
        
        {/* Carousel Container */}
        <div className="relative w-full group">
          
          {/* Main Slide */}
          <div className="relative box-border content-stretch flex flex-col gap-[499px] h-[692px] items-start justify-end p-[36px] shrink-0 w-full overflow-hidden transition-all duration-500 ease-in-out">
            
            {/* Background Image */}
            <Image
              src={currentEvent.image}
              alt={`${currentEvent.title} featured event`}
              width={1200}
              height={692}
              priority={true}
              className="absolute inset-0 object-cover w-full h-full z-0"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute bg-gradient-to-b from-transparent from-[62.572%] inset-0 to-black" />
            
            {/* Featured Event Badge */}
            <div className="absolute bg-[#fb7102] box-border content-stretch flex flex-row gap-2 items-center justify-center left-6 px-3 py-1.5 rounded-2xl top-6 z-10">
              <div className="font-semibold leading-[0] not-italic relative shrink-0 text-black text-[14px] text-left text-nowrap tracking-[-0.14px]">
                <p className="block leading-[16px] whitespace-pre">{currentEvent.category}</p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Content */}
            <div className="box-border content-stretch flex flex-row gap-20 items-end justify-start p-0 relative shrink-0 w-full z-10">
              
              {/* Event Details */}
              <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-end leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-white text-left">
                <div className="font-normal opacity-50 relative shrink-0 text-[14px] tracking-[-0.14px] w-full">
                  <p className="block leading-[normal]">{currentEvent.date}</p>
                </div>
                <div className="font-medium relative shrink-0 text-[24px] tracking-[-0.24px] w-full">
                  <p className="block leading-[normal]">{currentEvent.title}</p>
                </div>
                <div className="font-normal opacity-80 relative shrink-0 text-[16px] tracking-[-0.16px] w-full">
                  <p className="block leading-[normal]">{currentEvent.venue}</p>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                {featuredEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1 shrink-0 transition-all duration-300 hover:scale-y-150 ${
                      index === currentSlide 
                        ? 'bg-[#fb7102] w-12' 
                        : 'bg-[#d9d9d9] w-6 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}