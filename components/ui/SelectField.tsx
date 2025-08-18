'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width?: string;
  className?: string;
}

export default function SelectField({ 
  label, 
  value, 
  options, 
  onChange, 
  width = "w-60", 
  className = "" 
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={selectRef} className={`bg-[#ffffff] h-[52px] relative rounded shrink-0 ${width} ${className}`}>
      <div 
        className="relative rounded size-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start overflow-clip pl-[15px] pr-[13px] py-[5px] relative size-full border border-[#e8e8e9] rounded">
          <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
            <div className="box-border content-stretch flex flex-col gap-px items-start justify-center leading-[0] not-italic p-0 relative text-left w-full">
              <div className="font-normal relative shrink-0 text-[#707a8f] text-[12px] w-full">
                <p className="block leading-[1.35]">{label}</p>
              </div>
              <div className="font-medium relative shrink-0 text-[#50576b] text-[15px] w-full">
                <p className="block leading-[1.45]">{value}</p>
              </div>
            </div>
          </div>
          <div className="relative shrink-0 size-6">
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative size-6">
              <ChevronDown className={`w-5 h-5 text-[#50576b] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#e8e8e9] rounded shadow-lg z-50">
            <div className="py-1 max-h-48 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[#50576b] text-[15px] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}