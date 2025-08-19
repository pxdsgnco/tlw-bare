'use client';

import { NightlifeVenue } from './NightlifeCard';
import Image from 'next/image';

// Figma venue images
const img = "http://localhost:3845/assets/326bc860436df5d2374efa6d688a2179d27cd2a8.png";
const img2 = "http://localhost:3845/assets/10463b494ce425e80cf3784c513861a17c41c5bd.png";
const img3 = "http://localhost:3845/assets/8046e173090ef29587471e65277be6fe55b92257.png";

// Figma icons
const imgLucideWallet = "http://localhost:3845/assets/dbbf74ae793946d6572453636a387397d32d7fca.svg";
const imgLucideMapPin = "http://localhost:3845/assets/4035a381a3a4b0e634b9b4bfeb1424e8b216d9ec.svg";

interface BudgetProps {
  budgetClass?: "High" | "Low" | "Medium";
}

function Budget({ budgetClass = "Low" }: BudgetProps) {
  if (budgetClass === "Medium") {
    return (
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative size-full">
        <div className="relative shrink-0 size-5">
          <Image
            alt="Wallet"
            className="block max-w-none size-full"
            src={imgLucideWallet}
            width={20}
            height={20}
          />
        </div>
        <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap">
          <p className="block leading-[20px] whitespace-pre">Medium Budget</p>
        </div>
      </div>
    );
  }
  if (budgetClass === "High") {
    return (
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative size-full">
        <div className="relative shrink-0 size-5">
          <Image
            alt="Wallet"
            className="block max-w-none size-full"
            src={imgLucideWallet}
            width={20}
            height={20}
          />
        </div>
        <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap">
          <p className="block leading-[20px] whitespace-pre">High Budget</p>
        </div>
      </div>
    );
  }
  return (
    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative size-full">
      <div className="relative shrink-0 size-5">
        <Image
          alt="Wallet"
          className="block max-w-none size-full"
          src={imgLucideWallet}
          width={20}
          height={20}
        />
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap">
        <p className="block leading-[20px] whitespace-pre">Low Budget</p>
      </div>
    </div>
  );
}

interface NightlifeSimilarVenuesProps {
  venues: NightlifeVenue[];
  onVenueClick: (venue: NightlifeVenue) => void;
}

export default function NightlifeSimilarVenues({ venues, onVenueClick }: NightlifeSimilarVenuesProps) {
  // Figma data with exact venue names and images
  const figmaVenues = [
    {
      id: '1',
      name: 'Capital Club',
      location: 'Victoria Island, Lagos',
      image: img,
      budgetClass: 'High' as const
    },
    {
      id: '2', 
      name: 'Hard Rock Cafe',
      location: 'Victoria Island, Lagos',
      image: img2,
      budgetClass: 'Medium' as const
    },
    {
      id: '3',
      name: 'Bature Breweries',
      location: 'Victoria Island, Lagos', 
      image: img3,
      budgetClass: 'Low' as const
    }
  ];

  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative size-full">
      <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start max-w-[1440px] p-[64px] relative shrink-0 w-full">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#13151a] text-[28px] text-left tracking-[-0.28px] w-full">
          <p className="block leading-[1.2]">Similar venues</p>
        </div>
        
        <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          {figmaVenues.map((venue, index) => (
            <div key={venue.id} className="bg-[#ffffff] box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-[421px] cursor-pointer" onClick={() => onVenueClick(venues[index] || venues[0])}>
              <div
                className="aspect-[421/240] bg-center bg-cover bg-no-repeat box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 shrink-0 w-full"
                style={{ backgroundImage: `url('${venue.image}')` }}
              />
              <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start pl-0 pr-6 py-0 relative shrink-0 w-full">
                <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
                  <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#13151a] text-[20px] text-left tracking-[-0.4px] w-full">
                    <p className="block leading-[1.45]">{venue.name}</p>
                  </div>
                  <div className="box-border content-stretch flex flex-row gap-5 items-start justify-start p-0 relative shrink-0 w-full">
                    <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0">
                      <div className="box-border content-stretch flex flex-row gap-[7.273px] items-center justify-center pb-0 pt-[1.818px] px-0 relative shrink-0 w-5">
                        <div className="relative shrink-0 size-[18.182px]">
                          <Image
                            alt="Map pin"
                            className="block max-w-none size-full"
                            src={imgLucideMapPin}
                            width={18}
                            height={18}
                          />
                        </div>
                      </div>
                      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap">
                        <p className="block leading-[20px] whitespace-pre">{venue.location}</p>
                      </div>
                    </div>
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0">
                      <Budget budgetClass={venue.budgetClass} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}