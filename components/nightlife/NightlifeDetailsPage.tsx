'use client';

import NightlifeDetailsPageHeader from './NightlifeDetailsPageHeader';
import NightlifeImageGallery from './NightlifeImageGallery';
import NightlifeMainContent from './NightlifeMainContent';
import NightlifeAmenities from './NightlifeAmenities';
import NightlifeSpecialFeatures from './NightlifeSpecialFeatures';
import NightlifeLocationDetails from './NightlifeLocationDetails';
import NightlifeOperatingHours from './NightlifeOperatingHours';
import NightlifeReservationPolicy from './NightlifeReservationPolicy';
import NightlifeContactInfo from './NightlifeContactInfo';
import NightlifeSimilarVenues from './NightlifeSimilarVenues';
import { NightlifeVenue } from './NightlifeCard';

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

interface ReservationPolicy {
  required: boolean;
  advanceNotice?: string;
  largeGroups?: string;
  cancellation?: string;
  deposit?: string;
}

export interface NightlifeDetailsData {
  id: string;
  name: string;
  description: string;
  content: string;
  images: string[];
  location: {
    address: string;
    area: string;
    landmarks?: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    socialLinks: {
      instagram?: string;
      twitter?: string;
    };
  };
  operatingHours: {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
  };
  budgetLevel: 'Low' | 'Medium' | 'High';
  category: string;
  amenities: string[];
  specialFeatures: string[];
  reservationPolicy: ReservationPolicy;
  priceRange: string;
  ageRestriction: string;
  capacity?: number;
  dressCode?: string;
  peakHours?: string;
}

interface NightlifeDetailsPageProps {
  venue: NightlifeDetailsData;
  similarVenues: NightlifeVenue[];
  onSave?: () => void;
  onShare?: () => void;
  onMakeReservation?: () => void;
  onViewOnInstagram?: () => void;
  onCall?: () => void;
  onSimilarVenueClick?: (venue: NightlifeVenue) => void;
}

export default function NightlifeDetailsPage({
  venue,
  similarVenues,
  onSave,
  onShare,
  onMakeReservation,
  onViewOnInstagram,
  onCall,
  onSimilarVenueClick = () => {}
}: NightlifeDetailsPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <NightlifeDetailsPageHeader
        venueName={venue.name}
        description={venue.description}
        onSave={onSave}
        onShare={onShare}
      />

      {/* Main Content Grid */}
      <div className="box-border content-stretch flex flex-row items-start justify-center p-0 relative size-full">
        <div className="basis-0 box-border content-stretch flex flex-row gap-11 grow items-start justify-start max-w-[1440px] min-h-px min-w-px pb-16 pt-8 px-16 relative shrink-0">
          {/* Left Column - Image Gallery, Main Content, Amenities & Special Features */}
          <div className="basis-0 box-border content-stretch flex flex-col gap-[38px] grow h-auto items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
            {/* Image Gallery */}
            <NightlifeImageGallery
              images={venue.images}
              venueName={venue.name}
            />
            
            {/* Main Content - About the venue */}
            <NightlifeMainContent
              content={venue.content}
              venueName={venue.name}
            />

            {/* Amenities & Features */}
            <NightlifeAmenities amenities={venue.amenities} />

            {/* Special Features */}
            <NightlifeSpecialFeatures specialFeatures={venue.specialFeatures} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[360px]">
            {/* Location Details with Action Buttons */}
            <NightlifeLocationDetails
              venueName={venue.name}
              location={venue.location}
              capacity={venue.capacity}
              onMakeReservation={onMakeReservation}
              onViewOnInstagram={onViewOnInstagram}
            />

            {/* Operating Hours */}
            <NightlifeOperatingHours 
              operatingHours={venue.operatingHours}
              dressCode={venue.dressCode}
              peakHours={venue.peakHours}
            />

            {/* Reservation Policy */}
            <NightlifeReservationPolicy reservationPolicy={venue.reservationPolicy} />

            {/* Contact Information */}
            <NightlifeContactInfo contact={venue.contact} onCall={onCall} />
          </div>
        </div>
      </div>

      {/* Similar Venues */}
      <NightlifeSimilarVenues
        venues={similarVenues}
        onVenueClick={onSimilarVenueClick}
      />
    </div>
  );
}