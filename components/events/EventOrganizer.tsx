'use client';

import Image from 'next/image';

const imgLucideInstagram = "http://localhost:3845/assets/34958832d54087cb66f2af3d4b650a4336235402.svg";
const imgLucideTwitter = "http://localhost:3845/assets/2aabf31d9824ffe1ce835945a8aaac786348f2f7.svg";
const imgLucideExternalLink = "http://localhost:3845/assets/2cdc3f045b2663e5dbb4a98ce96588005a088495.svg";

interface EventOrganizerData {
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
}

interface EventOrganizerProps {
  organizer: EventOrganizerData;
}

export default function EventOrganizer({ organizer }: EventOrganizerProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative rounded-md shrink-0 w-full border border-slate-200">
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap tracking-[-0.36px]">
        <p className="block leading-[28px] whitespace-pre">Event Organizer</p>
      </div>

      {/* Organizer Profile */}
      <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full">
        <div 
          className="bg-[#e6e6e6] bg-center bg-cover rounded-[64px] shrink-0 size-12"
          style={{ backgroundImage: `url('${organizer.avatar}')` }}
        />
        <div className="basis-0 box-border content-stretch flex flex-col gap-0.5 grow items-start justify-start leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left">
          <div className="font-['Inter:Bold',_sans-serif] font-bold min-w-full relative shrink-0 text-[#13151a] text-[14px]">
            <p className="block leading-[20px]">{organizer.name}</p>
          </div>
          <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#697289] text-[12px] text-nowrap">
            <p className="block leading-[16px] whitespace-pre">{organizer.title}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] min-w-full not-italic relative shrink-0 text-[#50576b] text-[14px] text-left tracking-[-0.28px]">
        <p className="block leading-[20px]">{organizer.description}</p>
      </div>

      {/* Contact Information */}
      <div className="box-border content-stretch flex flex-col font-['Inter:Medium',_sans-serif] font-medium gap-2 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[#697289] text-[12px] text-left w-full">
        <div className="relative shrink-0 w-full">
          <p className="block leading-[16px]">Email: {organizer.email}</p>
        </div>
        <div className="relative shrink-0 w-full">
          <p className="block leading-[16px]">Phone: {organizer.phone}</p>
        </div>
      </div>

      {/* Social Links */}
      {organizer.socialLinks && (
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
          {organizer.socialLinks.instagram && (
            <a
              href={organizer.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 hover:opacity-70 transition-opacity"
            >
              <div className="relative shrink-0 size-5">
                <Image
                  alt="Instagram"
                  className="block max-w-none size-full"
                  src={imgLucideInstagram}
                  width={20}
                  height={20}
                />
              </div>
            </a>
          )}
          
          {organizer.socialLinks.twitter && (
            <a
              href={organizer.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 hover:opacity-70 transition-opacity"
            >
              <div className="relative shrink-0 size-5">
                <Image
                  alt="Twitter"
                  className="block max-w-none size-full"
                  src={imgLucideTwitter}
                  width={20}
                  height={20}
                />
              </div>
            </a>
          )}
          
          {organizer.socialLinks.website && (
            <a
              href={organizer.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="box-border content-stretch flex flex-row gap-[6.667px] items-center justify-start p-0 relative shrink-0 hover:opacity-70 transition-opacity"
            >
              <div className="relative shrink-0 size-5">
                <Image
                  alt="External link"
                  className="block max-w-none size-full"
                  src={imgLucideExternalLink}
                  width={20}
                  height={20}
                />
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  );
}