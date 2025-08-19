'use client';

import { useState } from 'react';
import SelectField from '@/components/ui/SelectField';

interface NightlifeFiltersProps {
  onFilterChange?: (filters: {
    category: string;
    budget: string;
    valetParking: string;
    reservations: string;
    showCount: string;
  }) => void;
}

export default function NightlifeFilters({ onFilterChange }: NightlifeFiltersProps) {
  const [category, setCategory] = useState('All Categories');
  const [budget, setBudget] = useState('All Budgets');
  const [valetParking, setValetParking] = useState('All Options');
  const [reservations, setReservations] = useState('All');
  const [showCount, setShowCount] = useState('9');

  // Notify parent component when filters change
  const notifyFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        category,
        budget,
        valetParking,
        reservations,
        showCount
      });
    }
  };

  const categoryOptions = ['All Categories', 'Bar', 'Club', 'Lounge', 'Rooftop', 'Restaurant & Bar'];
  const budgetOptions = ['All Budgets', 'Low Budget', 'Medium Budget', 'High Budget'];
  const valetOptions = ['All Options', 'Available', 'Not Available'];
  const reservationOptions = ['All', 'Required', 'Recommended', 'Walk-in'];
  const showOptions = ['6', '9', '12', '18'];

  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-row items-start justify-between max-w-[1440px] px-16 py-8 relative shrink-0 w-full">
        {/* Left side filters */}
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
          <SelectField
            label="Category"
            value={category}
            options={categoryOptions}
            onChange={(value) => {
              setCategory(value);
              setTimeout(notifyFilterChange, 0);
            }}
            width="w-[193px]"
          />
          <SelectField
            label="Budget"
            value={budget}
            options={budgetOptions}
            onChange={(value) => {
              setBudget(value);
              setTimeout(notifyFilterChange, 0);
            }}
            width="w-[193px]"
          />
          <SelectField
            label="Valet Parking"
            value={valetParking}
            options={valetOptions}
            onChange={(value) => {
              setValetParking(value);
              setTimeout(notifyFilterChange, 0);
            }}
            width="w-[190px]"
          />
          <SelectField
            label="Reservations"
            value={reservations}
            options={reservationOptions}
            onChange={(value) => {
              setReservations(value);
              setTimeout(notifyFilterChange, 0);
            }}
            width="w-[202px]"
          />
        </div>

        {/* Right side - Show count */}
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
  );
}