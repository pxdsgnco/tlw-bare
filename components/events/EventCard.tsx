'use client';

import Image from 'next/image';

// Calendar icon imported as SVG asset below

const calendarIcon = "http://localhost:3845/assets/f7df124a7a8ee3439374c02f9153c60d3d0acecd.svg";

export interface EventTag {
  label: string;
  color?: 'default' | 'primary';
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  image: string;
  tags: EventTag[];
  category?: string;
}

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

interface EventCardProps {
  event: EventData;
  onClick: (event: EventData) => void;
  variant?: 'grid' | 'list';
}

export default function EventCard({ event, onClick, variant = 'grid' }: EventCardProps) {
  if (variant === 'list') {
    return (
      <div
        className="box-border content-stretch flex flex-row gap-5 items-center justify-start p-0 relative rounded-[20px] shrink-0 w-full cursor-pointer group"
        onClick={() => onClick(event)}
      >
        <div
          className="bg-center bg-cover bg-no-repeat h-[164.12px] shrink-0 w-[219px] overflow-hidden group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url('${event.image}')` }}
        />
        
        <div className="basis-0 box-border content-stretch flex flex-col gap-5 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
          <div className="box-border content-stretch flex flex-col gap-2 h-24 items-start justify-start p-0 relative shrink-0 w-[213px]">
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
              <div className="relative shrink-0 size-4">
                <Image alt="Calendar icon" className="block max-w-none size-full" src={calendarIcon} width={16} height={16} />
              </div>
              <div className="basis-0 font-medium grow leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#697289] text-[12px] text-left">
                <p className="block leading-[16px]">{event.date}{event.time && ` • ${event.time}`}</p>
              </div>
            </div>
            
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-full">
              <h3 className="basis-0 font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#13151a] text-[20px] text-left tracking-[-0.4px] block leading-[1.45]">
                {event.title}
              </h3>
            </div>
            
            <div className="font-medium leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#fb7102] text-[14px] text-left tracking-[-0.14px] w-full line-clamp-1">
              <p className="block leading-[1.35]">{event.venue}</p>
            </div>
          </div>

          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full flex-wrap">
            {event.tags.map((tag, index) => (
              <EventTag key={index} label={tag.label} color={tag.color} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Grid variant - matches Figma design exactly
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full cursor-pointer group"
      onClick={() => onClick(event)}
    >
      {/* Event Image */}
      <div
        className="bg-center bg-cover bg-no-repeat h-60 shrink-0 w-full group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url('${event.image}')` }}
      />
      
      {/* Event Content */}
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start pl-0 pr-6 py-0 relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start pl-0 pr-6 py-0 relative shrink-0 w-full">
          {/* Date and Time Metadata */}
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
              <div className="relative shrink-0 size-4">
                <Image alt="Calendar icon" className="block max-w-none size-full" src={calendarIcon} width={16} height={16} />
              </div>
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[12px] text-left text-nowrap">
                <p className="block leading-[16px] whitespace-pre">{event.date}</p>
              </div>
            </div>
            {event.time && (
              <>
                <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#697289] text-[12px] text-left text-nowrap">
                  <p className="block leading-[16px] whitespace-pre">·</p>
                </div>
                <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[12px] text-left text-nowrap">
                  <p className="block leading-[16px] whitespace-pre">{event.time}</p>
                </div>
              </>
            )}
          </div>
          
          {/* Title and Venue */}
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
            <h3 className="font-medium min-w-full relative shrink-0 text-[#13151a] text-[20px] tracking-[-0.4px] block leading-[1.45]" style={{ width: "min-content" }}>
              {event.title}
            </h3>
            <div className="font-semibold relative shrink-0 text-[#fb7102] text-[16px] text-nowrap">
              <p className="block leading-[16px] whitespace-pre">{event.venue}</p>
            </div>
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