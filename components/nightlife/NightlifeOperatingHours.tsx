'use client';

import Image from 'next/image';

const imgLucideClock4 = "http://localhost:3845/assets/e371a1019b6398f1fb601934e465a1fc5010a32e.svg";
const imgLine1 = "http://localhost:3845/assets/1f0703bb1128f672aa1a76e3c390cd338a8f8403.svg";

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

interface NightlifeOperatingHoursProps {
  operatingHours: {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
  };
  dressCode?: string;
  peakHours?: string;
}

export default function NightlifeOperatingHours({ 
  operatingHours, 
  dressCode = "Smart casual to glamorous. No flip-flops, shorts, or athletic wear after 8 PM",
  peakHours = "Friday & Saturday 10 PM - 2 AM,\nSunday 4 PM - 10 PM"
}: NightlifeOperatingHoursProps) {
  const dayNames = {
    monday: 'Monday:',
    tuesday: 'Tuesday:',
    wednesday: 'Wednesday:',
    thursday: 'Thursday:',
    friday: 'Friday:',
    saturday: 'Saturday:',
    sunday: 'Sunday:'
  };

  const formatHours = (dayHours: DayHours) => {
    if (dayHours.closed) {
      return 'Closed';
    }
    return `${dayHours.open} - ${dayHours.close}`;
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative rounded-md size-full">
      <div
        aria-hidden="true"
        className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-md"
      />
      
      {/* Header with Clock Icon */}
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
        <div className="relative shrink-0 size-5">
          <Image
            alt="Clock"
            className="block max-w-none size-full"
            src={imgLucideClock4}
            width={20}
            height={20}
          />
        </div>
        <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#000000] text-[18px] text-left tracking-[-0.36px]">
          <p className="block leading-[28px]">Operating Hours</p>
        </div>
      </div>

      {/* Daily Schedule */}
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
        {Object.entries(operatingHours).map(([day, hours]) => (
          <div 
            key={day}
            className="box-border content-stretch flex flex-row gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14px] tracking-[-0.28px] w-full"
          >
            <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#13151a] text-left text-nowrap">
              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                {dayNames[day as keyof typeof dayNames]}
              </p>
            </div>
            <div className={`
              basis-0 font-['Inter:Regular',_sans-serif] font-normal grow min-h-px min-w-px relative shrink-0 text-right
              ${hours.closed ? 'text-red-500' : 'text-[#50576b]'}
            `}>
              <p className="block leading-[20px]">{formatHours(hours)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Horizontal Line Separator */}
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <Image
            alt="Separator line"
            className="block max-w-none size-full"
            src={imgLine1}
            width={311}
            height={1}
          />
        </div>
      </div>

      {/* Dress Code Section */}
      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
        <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#13151a] text-[14px] w-full">
          <p className="block leading-[20px]">Dress Code:</p>
        </div>
        <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#50576b] text-[12px] w-full">
          <p className="block leading-[16px]">{dressCode}</p>
        </div>
      </div>

      {/* Peak Hours Section */}
      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
        <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#13151a] text-[14px] w-full">
          <p className="block leading-[20px]">Peak Hours:</p>
        </div>
        <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#50576b] text-[12px] w-full">
          <p className="block leading-[16px]" style={{ whiteSpace: 'pre-line' }}>{peakHours}</p>
        </div>
      </div>
    </div>
  );
}