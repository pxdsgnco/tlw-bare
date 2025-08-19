'use client';

import { MapPin, Wallet } from 'lucide-react';

interface NightlifeCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  budgetLevel: 'Low' | 'Medium' | 'High';
  category?: string;
  onClick?: () => void;
}

export interface NightlifeVenue {
  id: string;
  name: string;
  location: string;
  image: string;
  budgetLevel: 'Low' | 'Medium' | 'High';
  category?: string;
}

function BudgetIndicator({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const getBudgetText = () => {
    switch (level) {
      case 'Low': return 'Low Budget';
      case 'Medium': return 'Medium Budget';
      case 'High': return 'High Budget';
      default: return 'Low Budget';
    }
  };

  return (
    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative">
      <div className="relative shrink-0 size-5">
        <Wallet className="w-5 h-5 text-[#697289]" />
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap">
        <p className="block leading-[20px] whitespace-pre">{getBudgetText()}</p>
      </div>
    </div>
  );
}

export default function NightlifeCard({ 
  name, 
  location, 
  image, 
  budgetLevel, 
  onClick 
}: NightlifeCardProps) {
  return (
    <div 
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-[421px] cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div 
        className="aspect-[421/240] bg-center bg-cover bg-no-repeat box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 shrink-0 w-full group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url('${image}')` }}
      />
      
      {/* Content */}
      <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start pl-0 pr-6 py-0 relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
          {/* Name */}
          <h3 className="font-medium min-w-full relative shrink-0 text-[#13151a] text-[20px] tracking-[-0.4px] block leading-[1.45]" style={{ width: "min-content" }}>
            {name}
          </h3>
          
          {/* Location and Budget */}
          <div className="box-border content-stretch flex flex-row gap-5 items-start justify-start p-0 relative shrink-0 w-full">
            {/* Location */}
            <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0">
              <div className="box-border content-stretch flex flex-row gap-[7.273px] items-center justify-center pb-0 pt-[1.818px] px-0 relative shrink-0 w-5">
                <div className="relative shrink-0 size-[18.182px]">
                  <MapPin className="w-[18.182px] h-[18.182px] text-[#697289]" />
                </div>
              </div>
              <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-left text-nowrap">
                <p className="block leading-[20px] whitespace-pre">{location}</p>
              </div>
            </div>
            
            {/* Budget */}
            <BudgetIndicator level={budgetLevel} />
          </div>
        </div>
      </div>
    </div>
  );
}