'use client';

import { useRouter, useParams } from 'next/navigation';
import NightlifeDetailsPage, { NightlifeDetailsData } from '@/components/nightlife/NightlifeDetailsPage';
import { NightlifeVenue } from '@/components/nightlife/NightlifeCard';

const getMockNightlifeDetails = (slug: string): NightlifeDetailsData => {
  return {
    id: slug,
    name: "Atmosphere Lounge & Bar",
    description: "An upscale rooftop experience offering panoramic views of Lagos skyline with premium cocktails and fine dining.",
    content: `
      <p>Discover Lagos' most exclusive rooftop destination where luxury meets style. Atmosphere Lounge & Bar offers an unparalleled nightlife experience with breathtaking 360-degree views of the city skyline, creating the perfect backdrop for an unforgettable evening.</p>
      
      <p>Our expertly crafted cocktail menu features both classic favorites and innovative creations using premium spirits and fresh, locally-sourced ingredients. The kitchen serves contemporary cuisine with an African twist, perfect for sharing while you enjoy the stunning vistas.</p>
      
      <p><strong>What makes us special:</strong></p>
      <ul>
        <li>Panoramic rooftop terrace with Lagos skyline views</li>
        <li>Premium cocktail program with award-winning mixologists</li>
        <li>Contemporary African fusion cuisine</li>
        <li>Live DJ performances Thursday through Sunday</li>
        <li>VIP private dining areas and event spaces</li>
        <li>Climate-controlled indoor and outdoor seating</li>
        <li>Professional photography services available</li>
      </ul>
      
      <p>Whether you're celebrating a special occasion, hosting a business dinner, or simply looking to experience Lagos nightlife at its finest, Atmosphere Lounge & Bar provides the perfect setting for sophisticated entertainment.</p>
      
      <p><strong>Dress code:</strong> Smart casual to formal attire. No sportswear, flip-flops, or shorts after 7 PM.</p>
    `,
    images: [
      "http://localhost:3845/assets/venue-atmosphere-main.jpg",
      "http://localhost:3845/assets/venue-atmosphere-terrace.jpg",
      "http://localhost:3845/assets/venue-atmosphere-bar.jpg",
      "http://localhost:3845/assets/venue-atmosphere-dining.jpg",
      "http://localhost:3845/assets/venue-atmosphere-view.jpg"
    ],
    location: {
      address: "Plot 1415 Tiamiyu Savage Street, Victoria Island, Lagos",
      area: "Victoria Island",
      landmarks: "Opposite Eko Hotel, Near Federal Palace Hotel"
    },
    contact: {
      phone: "+234 901 234 5678",
      email: "reservations@atmospherelagos.com",
      website: "https://atmospherelagos.com",
      socialLinks: {
        instagram: "https://instagram.com/atmospherelagos",
        twitter: "https://twitter.com/atmospherelagos"
      }
    },
    operatingHours: {
      monday: { open: "", close: "", closed: true },
      tuesday: { open: "", close: "", closed: true },
      wednesday: { open: "6:00 PM", close: "2:00 AM", closed: false },
      thursday: { open: "6:00 PM", close: "2:00 AM", closed: false },
      friday: { open: "6:00 PM", close: "4:00 AM", closed: false },
      saturday: { open: "2:00 PM", close: "4:00 AM", closed: false },
      sunday: { open: "2:00 PM", close: "2:00 AM", closed: false }
    },
    budgetLevel: "High",
    category: "Rooftop Bar",
    amenities: [
      "Air Conditioning",
      "Valet Parking",
      "Wi-Fi",
      "Live Music",
      "Private Events",
      "Outdoor Seating",
      "Cocktail Menu",
      "Food Menu",
      "Dress Code",
      "Age Restriction (21+)"
    ],
    specialFeatures: [
      "Panoramic city views from 15th floor",
      "Award-winning mixology program",
      "Private VIP cabanas available",
      "Live DJ every weekend",
      "Professional event planning services"
    ],
    reservationPolicy: {
      required: true,
      advanceNotice: "24 hours minimum for dinner reservations",
      largeGroups: "48 hours notice required for groups of 8+",
      cancellation: "2 hours notice required for cancellations",
      deposit: "50% deposit required for weekend reservations"
    },
    priceRange: "₦15,000 - ₦50,000 per person",
    ageRestriction: "21+",
    capacity: 500,
    dressCode: "Smart casual to glamorous. No flip-flops, shorts, or athletic wear after 8 PM",
    peakHours: "Friday & Saturday 10 PM - 2 AM,\nSunday 4 PM - 10 PM"
  };
};

const getMockSimilarVenues = (): NightlifeVenue[] => {
  return [
    {
      id: '2',
      name: 'Sky Bar Lagos',
      location: 'Ikoyi',
      image: 'http://localhost:3845/assets/venue-skybar.jpg',
      budgetLevel: 'High',
      category: 'Rooftop Bar'
    },
    {
      id: '3',
      name: 'The Hangout Rooftop',
      location: 'Victoria Island',
      image: 'http://localhost:3845/assets/venue-hangout.jpg',
      budgetLevel: 'Medium',
      category: 'Rooftop Bar'
    },
    {
      id: '4',
      name: 'Quilox Nightclub',
      location: 'Victoria Island',
      image: 'http://localhost:3845/assets/venue-quilox.jpg',
      budgetLevel: 'High',
      category: 'Nightclub'
    }
  ];
};

export default function NightlifeDetails() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const venue = getMockNightlifeDetails(slug);
  const similarVenues = getMockSimilarVenues();

  const handleSave = () => {
    console.log('Venue saved:', venue.name);
  };

  const handleShare = () => {
    console.log('Venue shared:', venue.name);
  };

  const handleMakeReservation = () => {
    console.log('Make reservation clicked for:', venue.name);
    // This would typically open a reservation system
  };

  const handleViewOnInstagram = () => {
    console.log('View on Instagram clicked for:', venue.name);
    if (venue.contact.socialLinks.instagram) {
      window.open(venue.contact.socialLinks.instagram, '_blank');
    }
  };


  const handleCall = () => {
    console.log('Call clicked for:', venue.contact.phone);
    window.location.href = `tel:${venue.contact.phone}`;
  };

  const handleSimilarVenueClick = (clickedVenue: NightlifeVenue) => {
    console.log('Similar venue clicked:', clickedVenue.name);
    router.push(`/nightlife/${clickedVenue.id}`);
  };

  return (
    <NightlifeDetailsPage
      venue={venue}
      similarVenues={similarVenues}
      onSave={handleSave}
      onShare={handleShare}
      onMakeReservation={handleMakeReservation}
      onViewOnInstagram={handleViewOnInstagram}
      onCall={handleCall}
      onSimilarVenueClick={handleSimilarVenueClick}
    />
  );
}