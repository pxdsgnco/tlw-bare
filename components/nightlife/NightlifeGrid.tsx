'use client';

import NightlifeCard from './NightlifeCard';

interface NightlifeSpot {
  id: string;
  name: string;
  location: string;
  image: string;
  budgetLevel: 'Low' | 'Medium' | 'High';
  category: string;
}

interface NightlifeGridProps {
  spots?: NightlifeSpot[];
  showCount?: number;
  onSpotClick?: (spot: NightlifeSpot) => void;
}

// Real Lagos nightlife venues from Figma design
const mockNightlifeSpots: NightlifeSpot[] = [
  {
    id: '1',
    name: 'Capital Club',
    location: 'Victoria Island, Lagos',
    image: 'http://localhost:3845/assets/326bc860436df5d2374efa6d688a2179d27cd2a8.png',
    budgetLevel: 'High',
    category: 'Club'
  },
  {
    id: '2',
    name: 'Hard Rock Cafe',
    location: 'Victoria Island, Lagos',
    image: 'http://localhost:3845/assets/10463b494ce425e80cf3784c513861a17c41c5bd.png',
    budgetLevel: 'Medium',
    category: 'Restaurant & Bar'
  },
  {
    id: '3',
    name: 'Bature Breweries',
    location: 'Victoria Island, Lagos',
    image: 'http://localhost:3845/assets/8046e173090ef29587471e65277be6fe55b92257.png',
    budgetLevel: 'Low',
    category: 'Brewery'
  },
  {
    id: '4',
    name: 'The Beach by Gusto',
    location: 'Victoria Island, Lagos',
    image: 'http://localhost:3845/assets/3afac2c738c7018d7bf309846caa67b780616cc4.png',
    budgetLevel: 'Medium',
    category: 'Beach Club'
  },
  {
    id: '5',
    name: 'Citi Lounge',
    location: 'Surulere',
    image: 'http://localhost:3845/assets/a8cb75f463bd045e94326e41d5168e6fad43935a.png',
    budgetLevel: 'Low',
    category: 'Lounge'
  },
  {
    id: '6',
    name: 'Quilox',
    location: 'Victoria Island',
    image: 'http://localhost:3845/assets/799e6417e90bb12744b4559c2d71b888ebf4d90f.png',
    budgetLevel: 'High',
    category: 'Club'
  },
  {
    id: '7',
    name: 'Shiro',
    location: 'Victoria Island',
    image: 'http://localhost:3845/assets/42cbf28cf436b79fabd29edfbb7adca5570e93f3.png',
    budgetLevel: 'High',
    category: 'Lounge'
  },
  {
    id: '8',
    name: 'Bar 38',
    location: 'Yaba, Lagos',
    image: 'http://localhost:3845/assets/4a3e4b9925e8928e935465719fd4e9a40a764ff1.png',
    budgetLevel: 'Medium',
    category: 'Bar'
  },
  {
    id: '9',
    name: 'The Sailor\'s',
    location: 'Victoria Island',
    image: 'http://localhost:3845/assets/956727fbb1cd046c766f14db6726aa646a0e188f.png',
    budgetLevel: 'High',
    category: 'Lounge'
  }
];

export default function NightlifeGrid({ 
  spots = mockNightlifeSpots, 
  showCount = 9, 
  onSpotClick 
}: NightlifeGridProps) {
  const displayedSpots = spots.slice(0, showCount);

  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start max-w-[1440px] px-16 py-8 relative shrink-0 w-full">
        {/* Grid with flex wrap layout - 24px column gap, 40px row gap */}
        <div className="[flex-flow:wrap] box-border content-start flex gap-x-6 gap-y-10 items-start justify-start p-0 relative w-full">
          {displayedSpots.map((spot) => (
            <NightlifeCard
              key={spot.id}
              id={spot.id}
              name={spot.name}
              location={spot.location}
              image={spot.image}
              budgetLevel={spot.budgetLevel}
              category={spot.category}
              onClick={() => onSpotClick?.(spot)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}