'use client';

import { ChevronRight } from 'lucide-react';

export default function NightlifePageHeader() {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start max-w-[1440px] pb-8 pt-16 px-16 relative shrink-0 w-full">
        {/* Breadcrumb */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-0 py-2 relative shrink-0 w-full">
          <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap">
            <p className="block leading-[20px] whitespace-pre">Home</p>
          </div>
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
            <div className="relative shrink-0 size-4">
              <ChevronRight className="w-4 h-4 text-[#525866]" />
            </div>
          </div>
          <div className="font-normal leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap">
            <p className="block leading-[20px] whitespace-pre">Nightlife Spots</p>
          </div>
        </div>

        {/* Title */}
        <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#000000] text-[44px] text-left tracking-[-0.44px] w-full">
          <p className="block leading-[1.35]">Lagos Nightlife</p>
        </div>

        {/* Subtitle */}
        <div className="font-normal leading-[0] max-w-[640px] not-italic relative shrink-0 text-[#50576b] text-[18px] text-left tracking-[-0.36px] w-full">
          <p className="block leading-[28px]">
            Explore the best bars, clubs, and lounges Lagos has to offer. From rooftop views to underground vibes.
          </p>
        </div>
      </div>
    </div>
  );
}