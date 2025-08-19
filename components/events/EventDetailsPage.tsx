'use client';

import EventDetailsPageHeader from './EventDetailsPageHeader';
import EventMainContent from './EventMainContent';
import EventPrimaryInfo from './EventPrimaryInfo';
import EventOrganizer from './EventOrganizer';
import EventSimilarEvents from './EventSimilarEvents';
import { EventData } from './EventCard';

export interface EventDetailsData {
  id: string;
  title: string;
  description: string;
  content: string;
  images: string[];
  price: string;
  currency?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  capacity: number;
  ageRestriction: string;
  organizer: {
    name: string;
    title: string;
    description: string;
    avatar: string;
    email: string;
    phone: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      website?: string;
    };
  };
}

interface EventDetailsPageProps {
  event: EventDetailsData;
  similarEvents: EventData[];
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onGetTickets?: () => void;
  onAddToCalendar?: () => void;
  onViewOnInstagram?: () => void;
  onLearnMoreVenue?: () => void;
  onSimilarEventClick?: (event: EventData) => void;
}

export default function EventDetailsPage({
  event,
  similarEvents,
  onLike,
  onSave,
  onShare,
  onGetTickets,
  onAddToCalendar,
  onViewOnInstagram,
  onLearnMoreVenue,
  onSimilarEventClick = () => {}
}: EventDetailsPageProps) {
  const eventInfo = {
    price: event.price,
    currency: event.currency,
    date: event.date,
    time: event.time,
    venue: event.venue,
    address: event.address,
    capacity: event.capacity,
    ageRestriction: event.ageRestriction
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <EventDetailsPageHeader
        title={event.title}
        description={event.description}
        onLike={onLike}
        onSave={onSave}
        onShare={onShare}
      />

      {/* Content Grid */}
      <div className="box-border content-stretch flex flex-row items-start justify-center p-0 relative size-full">
        <div className="basis-0 box-border content-stretch flex flex-row gap-11 grow items-start justify-start max-w-[1440px] min-h-px min-w-px pb-16 pt-8 px-16 relative shrink-0">
          {/* Left Column - Main Content */}
          <EventMainContent
            images={event.images}
            content={event.content}
          />

          {/* Right Column - Sidebar */}
          <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[360px]">
            {/* Primary Info */}
            <EventPrimaryInfo
              eventInfo={eventInfo}
              onGetTickets={onGetTickets}
              onAddToCalendar={onAddToCalendar}
              onViewOnInstagram={onViewOnInstagram}
              onLearnMoreVenue={onLearnMoreVenue}
            />

            {/* Organizer Details */}
            <EventOrganizer organizer={event.organizer} />
          </div>
        </div>
      </div>

      {/* Similar Events */}
      <EventSimilarEvents
        events={similarEvents}
        onEventClick={onSimilarEventClick}
      />
    </div>
  );
}