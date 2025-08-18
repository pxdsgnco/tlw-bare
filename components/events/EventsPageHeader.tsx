'use client';

export default function EventsPageHeader() {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start leading-[0] max-w-[1440px] not-italic pb-8 pt-16 px-16 relative shrink-0 text-left w-full">
        <div className="font-medium relative shrink-0 text-[#fb7102] text-[14px] tracking-[-0.14px] uppercase w-full">
          <p className="block leading-[1.35]">EVENTS</p>
        </div>
        <div className="font-medium relative shrink-0 text-[#000000] text-[44px] tracking-[-1.32px] w-full">
          <p className="block leading-[1.35]">Events in Lagos</p>
        </div>
        <div className="font-normal max-w-[740px] relative shrink-0 text-[#50576b] text-[18px] tracking-[-0.36px] w-full">
          <p className="block leading-[28px]">
            Discover the hottest events happening in Lagos. From concerts to
            parties, find your next unforgettable experience.
          </p>
        </div>
      </div>
    </div>
  );
}