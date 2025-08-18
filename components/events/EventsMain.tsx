'use client';

import EventCard, { EventData } from './EventCard';

interface EventsMainProps {
  events: EventData[];
  onEventClick: (event: EventData) => void;
}

export default function EventsMain({ events, onEventClick }: EventsMainProps) {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative shrink-0 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 max-w-[1440px] pb-16 pt-8 px-16 relative shrink-0 w-full">
          {events.map((event) => (
            <div key={event.id} className="w-full">
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