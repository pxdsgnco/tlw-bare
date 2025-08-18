'use client';

import Image from 'next/image';

const imgFrame118 = "http://localhost:3845/assets/141ebfe5aacbd456dec4d0f78bb92fc8b6396a8a.png";
const imgLucideArrowUpRight = "http://localhost:3845/assets/d2812799df1cc12cbb5da52ce41ebe010d42903e.svg";

export default function CTA() {
  const handleGetStarted = () => {
    console.log('Get Started clicked');
    // Here you would implement navigation to submission form
  };

  const handleTalkToExpert = () => {
    console.log('Talk to an Expert clicked');
    // Here you would implement contact functionality
  };

  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-row gap-20 items-start justify-center max-w-[1440px] px-8 py-16 relative rounded-[20px] shrink-0 w-full">
        <div className="basis-0 bg-slate-50 box-border content-stretch flex flex-row gap-20 grow items-center justify-start min-h-px min-w-px px-16 py-20 relative rounded-[20px] shrink-0">
          
          {/* Content Section */}
          <div className="basis-0 box-border content-stretch flex flex-col gap-8 grow items-start justify-start max-w-[480px] min-h-px min-w-80 p-0 relative shrink-0">
            
            {/* Text Content */}
            <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
              
              {/* Subtitle */}
              <div className="font-medium relative shrink-0 text-[#697289] text-[14px] tracking-[-0.14px] w-full">
                <p className="block leading-[20px]">
                  Join a Growing Community of Lagos Curators
                </p>
              </div>
              
              {/* Main Title */}
              <div className="font-semibold relative shrink-0 text-[#13151a] text-[32px] tracking-[-0.64px] w-full">
                <p className="block leading-[40px]">
                  Share your must-visit hotspot or incredible event!
                </p>
              </div>
              
              {/* Description */}
              <div className="font-normal relative shrink-0 text-[#50576b] text-[16px] tracking-[-0.16px] w-full">
                <p className="block leading-[24px]">
                  Be part of the city&apos;s go-to guide for unforgettable nights and must-attend events. Add your venue or event and connect with a community that&apos;s always in the know.
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0">
              
              {/* Get Started Button */}
              <button
                onClick={handleGetStarted}
                className="bg-[#20242b] relative rounded-[10px] shrink-0 hover:bg-[#2a2f37] transition-colors group"
              >
                <div className="bg-clip-padding border border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-3 relative">
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                    <p className="block leading-[20px] whitespace-pre">
                      Get Started
                    </p>
                  </div>
                  <div className="relative shrink-0 size-4 group-hover:translate-x-1 transition-transform">
                    <Image
                      alt="Arrow up right"
                      className="block max-w-none size-full"
                      src={imgLucideArrowUpRight}
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </button>
              
              {/* Talk to Expert Button */}
              <button
                onClick={handleTalkToExpert}
                className="bg-[#ffffff] relative rounded-[10px] shrink-0 border border-[#dddddd] hover:bg-gray-50 transition-colors"
              >
                <div className="bg-clip-padding border border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-3 relative">
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#3d4351] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                    <p className="block leading-[20px] whitespace-pre">
                      Talk to an Expert
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Image Section */}
          <div
            className="basis-0 bg-center bg-cover bg-no-repeat grow h-[392px] min-h-px min-w-px shrink-0 overflow-hidden"
            style={{ backgroundImage: `url('${imgFrame118}')` }}
          />
        </div>
      </div>
    </div>
  );
}