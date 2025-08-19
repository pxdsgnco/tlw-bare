'use client';

import Image from 'next/image';

const imgLucideChevronRight = "http://localhost:3845/assets/f97dae574acc3dd29a9b8c317d7670b7ea538246.svg";
const imgLucideHeart = "http://localhost:3845/assets/a9d7ffb2fe16f2b08a5ef3ee3e7192b794ad6d4f.svg";
const imgLucideBookmark = "http://localhost:3845/assets/63508985349003a8d39ff8c43f23bc21ba8dcab0.svg";
const imgLucideShare = "http://localhost:3845/assets/de7417d9f698a93d7d3ada5bc4151da0677c81fd.svg";

interface EventDetailsPageHeaderProps {
  title: string;
  description: string;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export default function EventDetailsPageHeader({ 
  title, 
  description, 
  onLike, 
  onSave, 
  onShare 
}: EventDetailsPageHeaderProps) {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative size-full">
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start max-w-[1440px] pb-8 pt-16 px-16 relative shrink-0 w-full">
        {/* Breadcrumb */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-0 py-2 relative shrink-0 w-full">
          <div className="font-['BDO_Grotesk:DemiBold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap">
            <p className="block leading-[20px] whitespace-pre">Home</p>
          </div>
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
            <div className="relative shrink-0 size-4">
              <Image
                alt="Chevron right"
                className="block max-w-none size-full"
                src={imgLucideChevronRight}
                width={16}
                height={16}
              />
            </div>
          </div>
          <div className="font-['BDO_Grotesk:DemiBold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap">
            <p className="block leading-[20px] whitespace-pre">Events</p>
          </div>
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
            <div className="relative shrink-0 size-4">
              <Image
                alt="Chevron right"
                className="block max-w-none size-full"
                src={imgLucideChevronRight}
                width={16}
                height={16}
              />
            </div>
          </div>
          <div className="font-['BDO_Grotesk:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap">
            <p className="block leading-[20px] whitespace-pre">{title}</p>
          </div>
        </div>

        {/* Title, Description and Action Buttons */}
        <div className="box-border content-stretch flex flex-row items-end justify-between p-0 relative shrink-0 w-full">
          <div className="basis-0 box-border content-stretch flex flex-col gap-4 grow items-start justify-start leading-[0] max-w-[720px] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left">
            <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#000000] text-[44px] tracking-[-0.44px] w-full">
              <p className="block leading-[1.35]">{title}</p>
            </div>
            <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#50576b] text-[18px] tracking-[-0.36px] w-full">
              <p className="block leading-[28px]">{description}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0">
            <button
              onClick={onLike}
              className="h-10 relative rounded-md shrink-0 border border-slate-200 border-solid bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 h-10 items-center justify-center px-[17px] py-[9px] relative">
                <div className="relative shrink-0 size-4">
                  <Image
                    alt="Heart"
                    className="block max-w-none size-full"
                    src={imgLucideHeart}
                    width={16}
                    height={16}
                  />
                </div>
                <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap">
                  <p className="block leading-[16px] whitespace-pre">Like</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={onSave}
              className="h-10 relative rounded-md shrink-0 border border-slate-200 border-solid bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 h-10 items-center justify-center px-[17px] py-[9px] relative">
                <div className="relative shrink-0 size-4">
                  <Image
                    alt="Bookmark"
                    className="block max-w-none size-full"
                    src={imgLucideBookmark}
                    width={16}
                    height={16}
                  />
                </div>
                <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap">
                  <p className="block leading-[16px] whitespace-pre">Save</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={onShare}
              className="h-10 relative rounded-md shrink-0 border border-slate-200 border-solid bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 h-10 items-center justify-center px-[17px] py-[9px] relative">
                <div className="relative shrink-0 size-4">
                  <Image
                    alt="Share"
                    className="block max-w-none size-full"
                    src={imgLucideShare}
                    width={16}
                    height={16}
                  />
                </div>
                <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap">
                  <p className="block leading-[16px] whitespace-pre">Share</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}