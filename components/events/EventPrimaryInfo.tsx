'use client';

import Image from 'next/image';

const imgLucideCalendar = "http://localhost:3845/assets/124423e53c6d9a437d13564b9f94da347c17e459.svg";
const imgLucideMapPin = "http://localhost:3845/assets/fc66d90599c9f3cdd8e0f780ef0bf155d55042c7.svg";
const imgLucideChevronRight = "http://localhost:3845/assets/7fb6928ae87c43d09ccb0b2432628281b4f233a8.svg";
const imgLucideUser = "http://localhost:3845/assets/cf151a2b0bb90d56585f1ca5a8fbd9ce134f4b4d.svg";
const imgLucideCircleAlert = "http://localhost:3845/assets/4c7c709741c47f291d62b90a1fb7e4543ed4c232.svg";
const imgLucideExternalLink = "http://localhost:3845/assets/6587554aa2d2322d5f5763e7986fa9083e923d92.svg";
const imgLucideCalendarPlus = "http://localhost:3845/assets/3871b9763a50855d713509f9a0c8295708fca70b.svg";
const imgLucideInstagram = "http://localhost:3845/assets/c21a33f9d2363f94ddfff69617da31fbfda0a6d7.svg";

interface EventInfo {
  price: string;
  currency?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  capacity: number;
  ageRestriction: string;
}

interface EventPrimaryInfoProps {
  eventInfo: EventInfo;
  onGetTickets?: () => void;
  onAddToCalendar?: () => void;
  onViewOnInstagram?: () => void;
  onLearnMoreVenue?: () => void;
}

export default function EventPrimaryInfo({ 
  eventInfo, 
  onGetTickets, 
  onAddToCalendar, 
  onViewOnInstagram,
  onLearnMoreVenue 
}: EventPrimaryInfoProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start pb-6 pt-8 px-6 relative rounded-md size-full border border-slate-200 border-solid">
      <div className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full">
        {/* Price Section */}
        <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start pb-6 pt-0 px-0 relative shrink-0 w-full border-b border-[#e5eaf0]">
          <div className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#13151a] text-[30px] text-center tracking-[-0.6px] w-full">
            <p className="block leading-[36px]">{eventInfo.currency || '₦'}{eventInfo.price}</p>
          </div>
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-center tracking-[-0.28px] w-full">
            <p className="block leading-[20px]">per person</p>
          </div>
        </div>

        {/* Event Details */}
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full">
          {/* Date and Time */}
          <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pb-0 pt-0.5 px-0 relative shrink-0">
              <div className="relative shrink-0 size-5">
                <Image
                  alt="Calendar"
                  className="block max-w-none size-full"
                  src={imgLucideCalendar}
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-[14px] text-left tracking-[-0.28px]">
              <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0 text-[#13151a] w-full">
                <p className="block leading-[20px]">{eventInfo.date}</p>
              </div>
              <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#697289] w-full">
                <p className="block leading-[20px]">{eventInfo.time}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pb-0 pt-0.5 px-0 relative shrink-0">
                <div className="relative shrink-0 size-5">
                  <Image
                    alt="Map pin"
                    className="block max-w-none size-full"
                    src={imgLucideMapPin}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
                <div className="box-border content-stretch flex flex-col items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14px] text-left tracking-[-0.28px] w-full">
                  <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0 text-[#13151a] w-full">
                    <p className="block leading-[20px]">{eventInfo.venue}</p>
                  </div>
                  <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#697289] w-full">
                    <p className="block leading-[20px]">{eventInfo.address}</p>
                  </div>
                </div>
                <button
                  onClick={onLearnMoreVenue}
                  className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-full hover:opacity-80 transition-opacity"
                >
                  <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#fb7102] text-[14px] text-left text-nowrap tracking-[-0.28px] underline">
                    <p className="block leading-[20px] whitespace-pre">Learn more about venue</p>
                  </div>
                  <div className="relative shrink-0 size-5">
                    <Image
                      alt="Chevron right"
                      className="block max-w-none size-full"
                      src={imgLucideChevronRight}
                      width={20}
                      height={20}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="relative shrink-0 size-5">
              <Image
                alt="User"
                className="block max-w-none size-full"
                src={imgLucideUser}
                width={20}
                height={20}
              />
            </div>
            <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap tracking-[-0.28px]">
              <p className="block leading-[20px] whitespace-pre">Capacity: {eventInfo.capacity} people</p>
            </div>
          </div>

          {/* Age Restriction */}
          <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0 w-full">
            <div className="relative shrink-0 size-5">
              <Image
                alt="Circle alert"
                className="block max-w-none size-full"
                src={imgLucideCircleAlert}
                width={20}
                height={20}
              />
            </div>
            <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap tracking-[-0.28px]">
              <p className="block leading-[20px] whitespace-pre">Age: {eventInfo.ageRestriction}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full">
          <button
            onClick={onGetTickets}
            className="bg-[#000000] box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-3 relative rounded-[10px] shrink-0 w-full hover:bg-gray-800 transition-colors"
          >
            <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-0.28px]">
              <p className="block leading-[16px] whitespace-pre">Get Tickets</p>
            </div>
            <div className="relative shrink-0 size-5">
              <Image
                alt="External link"
                className="block max-w-none size-full"
                src={imgLucideExternalLink}
                width={20}
                height={20}
              />
            </div>
          </button>

          <button
            onClick={onAddToCalendar}
            className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-3 relative rounded-[10px] shrink-0 w-full border border-[#e5eaf0] hover:bg-gray-50 transition-colors"
          >
            <div className="relative shrink-0 size-4">
              <Image
                alt="Calendar plus"
                className="block max-w-none size-full"
                src={imgLucideCalendarPlus}
                width={16}
                height={16}
              />
            </div>
            <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#3d4354] text-[14px] text-center text-nowrap tracking-[-0.28px]">
              <p className="block leading-[16px] whitespace-pre">Add Event to Calendar</p>
            </div>
          </button>

          <button
            onClick={onViewOnInstagram}
            className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-3 relative rounded-[10px] shrink-0 w-full border border-[#e5eaf0] hover:bg-gray-50 transition-colors"
          >
            <div className="relative shrink-0 size-4">
              <Image
                alt="Instagram"
                className="block max-w-none size-full"
                src={imgLucideInstagram}
                width={16}
                height={16}
              />
            </div>
            <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#3d4354] text-[14px] text-center text-nowrap tracking-[-0.28px]">
              <p className="block leading-[16px] whitespace-pre">View on Instagram</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}