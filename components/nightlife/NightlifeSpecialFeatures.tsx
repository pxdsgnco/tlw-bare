'use client';

import Image from 'next/image';

const imgLucideCrown = "http://localhost:3845/assets/77bd354552a0a95eafa21275aaea5bd40c9767b1.svg";
const imgLucideCheck = "http://localhost:3845/assets/6b67d87344c796771536fd5ec6789d97a5718f0f.svg";

interface NightlifeSpecialFeaturesProps {
  specialFeatures: string[];
}

export default function NightlifeSpecialFeatures({ specialFeatures: _specialFeatures }: NightlifeSpecialFeaturesProps) {
  // Figma-specified special features organized in three columns
  const figmaFeatures = {
    column1: [
      "Beachfront Location",
      "Live Performances"
    ],
    column2: [
      "Sunset Views",
      "Celebrity Appearances"
    ],
    column3: [
      "Themed Events",
      "Private Event Hosting"
    ]
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative size-full">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-full">
        <div className="relative shrink-0 size-6">
          <Image
            alt="Crown"
            className="block max-w-none size-full"
            src={imgLucideCrown}
            width={24}
            height={24}
          />
        </div>
        <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#13151a] text-[20px] text-left tracking-[-0.2px]">
          <p className="block leading-[28px]">Special Features</p>
        </div>
      </div>
      <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
        {/* Column 1 */}
        <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-center justify-center min-h-px min-w-px p-0 relative shrink-0">
          {figmaFeatures.column1.map((feature, index) => (
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
                <p className="block leading-[28px]">{feature}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 */}
        <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-center justify-center min-h-px min-w-px p-0 relative shrink-0">
          {figmaFeatures.column2.map((feature, index) => (
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
                <p className="block leading-[28px]">{feature}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3 */}
        <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-center justify-center min-h-px min-w-px p-0 relative shrink-0">
          {figmaFeatures.column3.map((feature, index) => (
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
                <p className="block leading-[28px]">{feature}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}