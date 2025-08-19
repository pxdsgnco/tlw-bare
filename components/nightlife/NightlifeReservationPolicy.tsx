'use client';

import Image from 'next/image';

const imgLucidePhone = "http://localhost:3845/assets/5be5ba95c9eb33d3587271f8732374536cba8468.svg";
const imgLucideGlobe = "http://localhost:3845/assets/bcb414e8566e94396f14973f70cb3de9d504af8f.svg";

interface ReservationPolicy {
  required: boolean;
  advanceNotice?: string;
  largeGroups?: string;
  cancellation?: string;
  deposit?: string;
}

interface NightlifeReservationPolicyProps {
  reservationPolicy: ReservationPolicy;
}

export default function NightlifeReservationPolicy({ reservationPolicy }: NightlifeReservationPolicyProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative rounded-md size-full">
      <div
        aria-hidden="true"
        className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-md"
      />
      
      {/* Header */}
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap tracking-[-0.36px]">
        <p className="adjustLetterSpacing block leading-[28px] whitespace-pre">
          Reservation Policy
        </p>
      </div>

      {/* Status Indicators */}
      <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full">
        {/* Reservation Required */}
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-center p-0 relative shrink-0 w-full">
          <div className="relative shrink-0 size-4">
            <Image
              alt="Phone"
              className="block max-w-none size-full"
              src={imgLucidePhone}
              width={16}
              height={16}
            />
          </div>
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#13151a] text-[14px] text-left">
            <p className="block leading-[20px]">Reservation Required</p>
          </div>
        </div>

        {/* No Walk-ins */}
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-center p-0 relative shrink-0 w-full">
          <div className="relative shrink-0 size-4">
            <Image
              alt="Globe"
              className="block max-w-none size-full"
              src={imgLucideGlobe}
              width={16}
              height={16}
            />
          </div>
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#13151a] text-[14px] text-left">
            <p className="block leading-[20px]">No Walk-ins</p>
          </div>
        </div>
      </div>

      {/* Highlighted Information Box */}
      <div className="bg-blue-50 box-border content-stretch flex flex-row gap-2 items-center justify-center p-[12px] relative rounded-lg shrink-0 w-full">
        <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#50576b] text-[12px] text-left">
          <p className="block leading-[16px]">
            {reservationPolicy.advanceNotice || "Reservations recommended 48 hours in advance, required for weekends"}
          </p>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
        <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#13151a] text-[14px] w-full">
          <p className="block leading-[20px]">Cancellation:</p>
        </div>
        <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#50576b] text-[12px] w-full">
          <p className="block leading-[16px]">
            {reservationPolicy.cancellation || "24-hour cancellation policy. Late cancellations may incur charges"}
          </p>
        </div>
      </div>

      {/* Group Booking Policy */}
      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
        <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#13151a] text-[14px] w-full">
          <p className="block leading-[20px]">Group Booking:</p>
        </div>
        <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#50576b] text-[12px] w-full">
          <p className="block leading-[16px]">
            {reservationPolicy.largeGroups || "Group bookings (8+ people) require 72-hour advance notice and deposit"}
          </p>
        </div>
      </div>
    </div>
  );
}