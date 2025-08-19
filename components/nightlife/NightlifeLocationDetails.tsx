'use client';

import Image from 'next/image';

const imgLucideMapPin = "http://localhost:3845/assets/f5d4b406ff8e7de84358c1bf6f818122c21cb5a8.svg";
const imgLucideUser = "http://localhost:3845/assets/cf151a2b0bb90d56585f1ca5a8fbd9ce134f4b4d.svg";
const imgLucideExternalLink = "http://localhost:3845/assets/6587554aa2d2322d5f5763e7986fa9083e923d92.svg";
const imgLucideInstagram = "http://localhost:3845/assets/a30771c2f645fc52a193460f254f955f00812280.svg";

interface NightlifeLocationDetailsProps {
  venueName: string;
  location: {
    address: string;
    area: string;
    landmarks?: string;
  };
  capacity?: number;
  onMakeReservation?: () => void;
  onViewOnInstagram?: () => void;
}

export default function NightlifeLocationDetails({ 
  venueName,
  location, 
  capacity,
  onMakeReservation, 
  onViewOnInstagram
}: NightlifeLocationDetailsProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[24px] relative rounded-md size-full">
      <div
        aria-hidden="true"
        className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-md"
      />
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
        {/* Header with Location Details title */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-full">
          <div className="relative shrink-0 size-5">
            <Image
              alt="Map pin"
              className="block max-w-none size-full"
              src={imgLucideMapPin}
              width={20}
              height={20}
            />
          </div>
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#000000] text-[18px] text-left tracking-[-0.36px]">
            <p className="block leading-[28px]">Location Details</p>
          </div>
        </div>

        {/* Venue Information */}
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full">
          {/* Venue Name and Address */}
          <div className="box-border content-stretch flex flex-col h-[60px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14px] text-left tracking-[-0.28px] w-[311px]">
            <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0 text-[#13151a] w-full">
              <p className="block leading-[20px]">{venueName}</p>
            </div>
            <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#697289] w-full">
              <p className="block leading-[20px]">
                {location.address}
                {location.area && (
                  <>
                    <br />
                    {location.area}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Capacity Information */}
          {capacity && (
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
                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                  Capacity: {capacity} people
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full">
          {/* Make Reservations Button */}
          <button
            onClick={onMakeReservation}
            className="bg-[#000000] box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-3 relative rounded-[10px] shrink-0 w-full hover:bg-gray-800 transition-colors"
          >
            <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-0.28px]">
              <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">
                Make Reservations
              </p>
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

          {/* View on Instagram Button */}
          <button
            onClick={onViewOnInstagram}
            className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-3 relative rounded-[10px] shrink-0 w-full hover:bg-gray-50 transition-colors"
          >
            <div
              aria-hidden="true"
              className="absolute border border-[#e5eaf0] border-solid inset-[-1px] pointer-events-none rounded-[11px]"
            />
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
              <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">
                View on Instagram
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}