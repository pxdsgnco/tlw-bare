'use client';

import Image from 'next/image';

const imgLucideCheck = "http://localhost:3845/assets/6b67d87344c796771536fd5ec6789d97a5718f0f.svg";

interface NightlifeAmenitiesProps {
  amenities: string[];
}

export default function NightlifeAmenities({ amenities: _amenities }: NightlifeAmenitiesProps) {
  // Figma-specified amenities organized in three columns
  const figmaAmenities = {
    column1: [
      "Valet Parking",
      "Full Bar Service", 
      "Live DJ",
      "Air Conditioning (Indoor Areas)"
    ],
    column2: [
      "VIP Sections",
      "Restaurant",
      "Dance Floor", 
      "Security"
    ],
    column3: [
      "Private Cabanas",
      "Beach Access",
      "Outdoor Seating",
      "Coat Check"
    ]
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative size-full">
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#13151a] text-[20px] text-left tracking-[-0.2px] w-full">
        <p className="block leading-[28px]">Amenities & Features</p>
      </div>
      <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
        {/* Column 1 */}
        <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-center justify-center min-h-px min-w-px p-0 relative shrink-0">
          {figmaAmenities.column1.map((amenity, index) => (
            <div key={index} className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
              <div className="relative shrink-0 size-5">
                <Image
                  alt="Check"
                  className="block max-w-none size-full"
                  src={imgLucideCheck}
                  width={20}
                  height={20}
                />
              </div>
              <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#50576b] text-[16px] text-left tracking-[-0.16px]">
                <p className="block leading-[28px]">{amenity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 */}
        <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-center justify-center min-h-px min-w-px p-0 relative shrink-0">
          {figmaAmenities.column2.map((amenity, index) => (
            <div key={index} className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
              <div className="relative shrink-0 size-5">
                <Image
                  alt="Check"
                  className="block max-w-none size-full"
                  src={imgLucideCheck}
                  width={20}
                  height={20}
                />
              </div>
              <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#50576b] text-[16px] text-left tracking-[-0.16px]">
                <p className="block leading-[28px]">{amenity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3 */}
        <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-center justify-center min-h-px min-w-px p-0 relative shrink-0">
          {figmaAmenities.column3.map((amenity, index) => (
            <div key={index} className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
              <div className="relative shrink-0 size-5">
                <Image
                  alt="Check"
                  className="block max-w-none size-full"
                  src={imgLucideCheck}
                  width={20}
                  height={20}
                />
              </div>
              <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#50576b] text-[16px] text-left tracking-[-0.16px]">
                <p className="block leading-[28px]">{amenity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}