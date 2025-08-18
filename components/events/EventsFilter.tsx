'use client';

import Image from 'next/image';

import { useState } from 'react';
import SelectField from '@/components/ui/SelectField';

const imgLucideCalendar = "http://localhost:3845/assets/04da3a8b987fcdcef74bea4952a0e219294ce594.svg";
const imgLucideGrid2X2 = "http://localhost:3845/assets/b0f7aee20f8cad4f12600ad82aab8fcd29ecca5c.svg";
const imgLucideLayoutList = "http://localhost:3845/assets/2a76c832be6fddc5b68a4e818f76d72620718f6b.svg";


interface TimeFilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TimeFilterButton({ label, isActive, onClick }: TimeFilterButtonProps) {
  return (
    <div
      className={`box-border content-stretch flex flex-row gap-2 items-center justify-center p-[8px] relative rounded-[64px] shrink-0 size-10 cursor-pointer ${
        isActive 
          ? 'bg-[#fb7102] border border-[#fb7102]' 
          : 'bg-[#ffffff] border border-[#e3e3e3]'
      }`}
      onClick={onClick}
    >
      <div className={`font-bold leading-[0] not-italic relative shrink-0 text-[9px] text-left text-nowrap ${
        isActive ? 'text-[#ffffff]' : 'text-[#000000]'
      }`}>
        <p className="block leading-[normal] whitespace-pre">{label}</p>
      </div>
    </div>
  );
}

interface CalendarDayProps {
  day: string;
  date: number;
  isLast?: boolean;
}

function CalendarDay({ day, date, isLast = false }: CalendarDayProps) {
  return (
    <div className={`relative shrink-0 ${isLast ? 'w-[52px]' : 'w-[53px]'}`}>
      {!isLast && (
        <div className="absolute right-0 top-0 bottom-0 w-px bg-[#e8e8e9]" />
      )}
      <div className="box-border flex flex-col gap-0.5 items-center justify-center p-2 h-full">
        <div className="font-medium text-[#000000] text-[10px] uppercase leading-tight">
          {day}
        </div>
        <div className="font-semibold text-[#000000] text-[16px] leading-tight">
          {date}
        </div>
      </div>
    </div>
  );
}

interface EventsFilterProps {
  onFilterChange?: (filters: {
    timeFilter: 'ALL' | 'DAY' | 'NIGHT';
    layoutType: 'grid' | 'list';
    priceRange: string;
    location: string;
    category: string;
    showCount: string;
  }) => void;
}

export default function EventsFilter({ onFilterChange }: EventsFilterProps) {
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'DAY' | 'NIGHT'>('ALL');
  const [layoutType, setLayoutType] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState('All Prices');
  const [location, setLocation] = useState('All Locations');
  const [category, setCategory] = useState('All Categories');
  const [showCount, setShowCount] = useState('9');

  // Notify parent component when filters change
  const notifyFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        timeFilter,
        layoutType,
        priceRange,
        location,
        category,
        showCount
      });
    }
  };

  const priceOptions = ['All Prices', 'Free', 'Under ₦5,000', '₦5,000 - ₦15,000', 'Above ₦15,000'];
  const locationOptions = ['All Locations', 'Victoria Island', 'Lekki', 'Ikeja', 'Ikoyi', 'Surulere'];
  const categoryOptions = ['All Categories', 'Concert', 'Party', 'Workshop', 'Exhibition', 'Festival'];
  const showOptions = ['6', '9', '12', '18'];

  const calendarDays = [
    { day: 'Mon', date: 14 },
    { day: 'Tue', date: 15 },
    { day: 'Wed', date: 16 },
    { day: 'Thu', date: 17 },
    { day: 'Fri', date: 18 },
    { day: 'Sat', date: 19 },
    { day: 'Sun', date: 20 }
  ];

  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start max-w-[1440px] px-16 py-8 relative shrink-0 w-full">
        
        {/* Top Filter Row */}
        <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
          {/* Left Side - Time Filter */}
          <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
            <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full">
              <div className="bg-[#f4f4f4] box-border content-stretch flex flex-row gap-1 items-center justify-start p-[6px] relative rounded-[64px] shrink-0 border border-[#e3e3e3]">
                <TimeFilterButton
                  label="ALL"
                  isActive={timeFilter === 'ALL'}
                  onClick={() => {
                    setTimeFilter('ALL');
                    setTimeout(notifyFilterChange, 0);
                  }}
                />
                <TimeFilterButton
                  label="DAY"
                  isActive={timeFilter === 'DAY'}
                  onClick={() => {
                    setTimeFilter('DAY');
                    setTimeout(notifyFilterChange, 0);
                  }}
                />
                <TimeFilterButton
                  label="NIGHT"
                  isActive={timeFilter === 'NIGHT'}
                  onClick={() => {
                    setTimeFilter('NIGHT');
                    setTimeout(notifyFilterChange, 0);
                  }}
                />
              </div>
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[15px] text-left text-nowrap">
                <p className="block leading-[normal] whitespace-pre">All Events</p>
              </div>
            </div>
          </div>

          {/* Center - Calendar */}
          <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0">
            <div className="relative rounded-lg self-stretch shrink-0 w-[52px] border border-[#e8e8e9]">
              <div className="box-border content-stretch flex flex-col gap-0.5 h-full items-center justify-center p-[9px] relative w-[52px]">
                <div className="relative shrink-0 size-5">
                  <Image alt="Calendar icon" className="block max-w-none size-full" src={imgLucideCalendar} width={16} height={16} />
                </div>
              </div>
            </div>
            <div className="relative rounded-lg shrink-0 border border-[#e8e8e9] overflow-hidden">
              <div className="flex flex-row h-[52px]">
                {calendarDays.map((day, index) => (
                  <CalendarDay
                    key={day.day}
                    day={day.day}
                    date={day.date}
                    isLast={index === calendarDays.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Layout Toggle */}
          <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-end min-h-px min-w-px p-0 relative shrink-0">
            <div className="bg-[#f1f2f4] box-border content-stretch flex flex-row gap-0.5 items-center justify-start p-[5px] relative rounded shrink-0 border border-slate-200">
              <div 
                className={`relative shrink-0 cursor-pointer rounded transition-colors ${layoutType === 'grid' ? 'bg-[#ffffff]' : ''}`}
                onClick={() => {
                  setLayoutType('grid');
                  setTimeout(notifyFilterChange, 0);
                }}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-2 relative">
                  <div className="relative shrink-0 size-5">
                    <Image alt="Grid view" className="block max-w-none size-full" src={imgLucideGrid2X2} width={16} height={16} />
                  </div>
                </div>
              </div>
              <div 
                className={`relative shrink-0 cursor-pointer rounded transition-colors ${layoutType === 'list' ? 'bg-[#ffffff]' : ''}`}
                onClick={() => {
                  setLayoutType('list');
                  setTimeout(notifyFilterChange, 0);
                }}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-2 relative">
                  <div className={`relative shrink-0 ${layoutType === 'list' ? '' : 'opacity-50'}`}>
                    <div className="relative shrink-0 size-5">
                      <Image alt="List view" className="block max-w-none size-full" src={imgLucideLayoutList} width={16} height={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Filter Row */}
        <div className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
            <SelectField
              label="Price Range"
              value={priceRange}
              options={priceOptions}
              onChange={(value) => {
                setPriceRange(value);
                setTimeout(notifyFilterChange, 0);
              }}
            />
            <SelectField
              label="Location"
              value={location}
              options={locationOptions}
              onChange={(value) => {
                setLocation(value);
                setTimeout(notifyFilterChange, 0);
              }}
            />
            <SelectField
              label="Category"
              value={category}
              options={categoryOptions}
              onChange={(value) => {
                setCategory(value);
                setTimeout(notifyFilterChange, 0);
              }}
            />
          </div>
          
          <SelectField
            label="Show"
            value={showCount}
            options={showOptions}
            onChange={(value) => {
              setShowCount(value);
              setTimeout(notifyFilterChange, 0);
            }}
            width="w-[111px]"
          />
        </div>
      </div>
    </div>
  );
}