'use client';

import EventCard, { EventData } from './EventCard';

interface EventSimilarEventsProps {
  events: EventData[];
  onEventClick: (event: EventData) => void;
}

export default function EventSimilarEvents({ events, onEventClick }: EventSimilarEventsProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative size-full">
      <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start max-w-[1440px] p-[64px] relative shrink-0 w-full">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#13151a] text-[28px] text-left tracking-[-0.28px] w-full">
          <p className="block leading-[1.2]">Similar events</p>
        </div>
        
        <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[421px]">
              <EventCard 
                event={event} 
                onClick={onEventClick} 
                variant="grid" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}