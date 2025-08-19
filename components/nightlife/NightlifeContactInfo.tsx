'use client';

import Image from 'next/image';

const imgLucidePhone = "http://localhost:3845/assets/e96c034692896f56bc90e92a7303d90dbb865c24.svg";
const imgLucideGlobe = "http://localhost:3845/assets/0d552f54aec6630d930bb66131c95238ccf9f0dd.svg";
const imgLucideInstagram = "http://localhost:3845/assets/34958832d54087cb66f2af3d4b650a4336235402.svg";
const imgLucideTwitter = "http://localhost:3845/assets/2aabf31d9824ffe1ce835945a8aaac786348f2f7.svg";
const imgLucideExternalLink = "http://localhost:3845/assets/2cdc3f045b2663e5dbb4a98ce96588005a088495.svg";

interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
  };
}

interface NightlifeContactInfoProps {
  contact: ContactInfo;
  onCall?: () => void;
}

export default function NightlifeContactInfo({ contact, onCall }: NightlifeContactInfoProps) {
  const handlePhoneClick = () => {
    if (onCall) {
      onCall();
    } else {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const handleWebsiteClick = () => {
    if (contact.website) {
      window.open(contact.website, '_blank');
    }
  };

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative rounded-md size-full">
      <div
        aria-hidden="true"
        className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-md"
      />
      
      {/* Header */}
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap tracking-[-0.36px]">
        <p className="adjustLetterSpacing block leading-[28px] whitespace-pre">
          Contact Information
        </p>
      </div>

      {/* Contact Methods and Social Links */}
      <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full">
        {/* Contact Methods */}
        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full">
          {/* Phone */}
          <button
            onClick={handlePhoneClick}
            className="box-border content-stretch flex flex-row gap-3 items-center justify-center p-0 relative shrink-0 w-full hover:opacity-80 transition-opacity"
          >
            <div className="relative shrink-0 size-4">
              <Image
                alt="Phone"
                className="block max-w-none size-full"
                src={imgLucidePhone}
                width={16}
                height={16}
              />
            </div>
            <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#fb7102] text-[14px] text-left">
              <p className="block leading-[20px]">{contact.phone}</p>
            </div>
          </button>

          {/* Website */}
          <button
            onClick={handleWebsiteClick}
            className="box-border content-stretch flex flex-row gap-3 items-center justify-center p-0 relative shrink-0 w-full hover:opacity-80 transition-opacity"
          >
            <div className="relative shrink-0 size-4">
              <Image
                alt="Globe"
                className="block max-w-none size-full"
                src={imgLucideGlobe}
                width={16}
                height={16}
              />
            </div>
            <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#fb7102] text-[14px] text-left">
              <p className="block leading-[20px]">Visit Website</p>
            </div>
          </button>
        </div>

        {/* Social Media Icons */}
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
          {/* Instagram */}
          {contact.socialLinks.instagram && (
            <button
              onClick={() => handleSocialClick(contact.socialLinks.instagram!)}
              className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 hover:opacity-80 transition-opacity"
              aria-label="Follow on Instagram"
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
            </button>
          )}

          {/* Twitter */}
          {contact.socialLinks.twitter && (
            <button
              onClick={() => handleSocialClick(contact.socialLinks.twitter!)}
              className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 hover:opacity-80 transition-opacity"
              aria-label="Follow on Twitter"
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
            </button>
          )}

          {/* External Link (if website exists) */}
          {contact.website && (
            <button
              onClick={handleWebsiteClick}
              className="box-border content-stretch flex flex-row gap-[6.667px] items-center justify-start p-0 relative shrink-0 hover:opacity-80 transition-opacity"
              aria-label="External Link"
            >
              <div className="relative shrink-0 size-5">
                <Image
                  alt="External Link"
                  className="block max-w-none size-full"
                  src={imgLucideExternalLink}
                  width={20}
                  height={20}
                />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}