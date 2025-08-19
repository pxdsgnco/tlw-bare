'use client';

import { useRouter, useParams } from 'next/navigation';
import EventDetailsPage, { EventDetailsData } from '@/components/events/EventDetailsPage';
import { EventData } from '@/components/events/EventCard';

const getMockEventDetails = (slug: string): EventDetailsData => {
  return {
    id: slug,
    title: "Rebirth (Dance with JECO)",
    description: "An electrifying night of dance and music featuring JECO. Experience the rebirth of Lagos nightlife with incredible beats and unforgettable vibes.",
    content: `
      <p>Get ready for an unforgettable night as we present "Rebirth" - a spectacular dance event featuring the incredible JECO! This isn't just another party; it's a celebration of Lagos nightlife culture and the power of music to bring people together.</p>
      
      <p>JECO, one of Lagos' most sought-after DJs and performers, will be taking you on a musical journey that spans Afrobeats, Amapiano, House, and everything in between. Known for his electrifying performances and ability to read the crowd, JECO promises to deliver a set that will keep you dancing all night long.</p>
      
      <p><strong>The event will feature:</strong></p>
      <ul>
        <li>Live DJ performance by JECO</li>
        <li>State-of-the-art sound and lighting system</li>
        <li>Professional dancers and performers</li>
        <li>VIP sections with bottle service</li>
        <li>Food and drinks available for purchase</li>
        <li>Photo booth and professional photography</li>
        <li>Surprise guest appearances</li>
      </ul>
      
      <p>This is more than just a party - it's a rebirth of the Lagos nightlife scene. Come experience the energy, the music, and the community that makes Lagos nightlife legendary.</p>
      
      <p><strong>Dress code:</strong> Smart casual to glamorous. Come ready to dance and celebrate!</p>
    `,
    images: [
      "http://localhost:3845/assets/e082d28960cae8df25e6b34174b5e3104581d729.png"
    ],
    price: "15,000",
    currency: "₦",
    date: "Jun 20, 2025",
    time: "8:00 PM - 4:00 AM",
    venue: "Club Hous QMB",
    address: "Plot 1415 Tiamiyu Savage Street, Victoria Island, Lagos",
    capacity: 500,
    ageRestriction: "18+",
    organizer: {
      name: "Adunni Olorunnisola",
      title: "Celebrity Influencer",
      description: "Premier event organizers specializing in Unforgettable nightlife experiences across Lagos. We bring together the best DJs, venues, and vibes to create magical nights.",
      avatar: "http://localhost:3845/assets/774d08f3793ed7c4cbd8d6c425263d9aaf4b94e5.png",
      email: "info@lagosnightlife.com",
      phone: "+234 801 234 5678",
      socialLinks: {
        instagram: "https://instagram.com/lagosnightlife",
        twitter: "https://twitter.com/lagosnightlife",
        website: "https://lagosnightlife.com"
      }
    }
  };
};

const getMockSimilarEvents = (): EventData[] => {
  return [
    {
      id: '4',
      title: 'In the Loop',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: 'Danfo Secret Garden Restaurant',
      image: 'http://localhost:3845/assets/e9c428a662aa6298bcdf68f195b889d5ae89cce7.png',
      tags: [{ label: 'Nightlife' }],
    },
    {
      id: '2',
      title: 'Slides & Shots - Presentation Night',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: "The Joydragger's House",
      image: 'http://localhost:3845/assets/0a93470acdd29c87aed803716725923a770ad82e.png',
      tags: [{ label: 'Party' }, { label: 'Social Gathering' }],
    },
    {
      id: '3',
      title: 'Karaoke Traffic Vibes (KTV)',
      date: 'Jun 12, 2025',
      time: '8:00 PM',
      venue: 'Bature Brewery',
      image: 'http://localhost:3845/assets/8046e173090ef29587471e65277be6fe55b92257.png',
      tags: [{ label: 'Nightlife' }, { label: 'Life Event' }],
    }
  ];
};

export default function EventDetails() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const event = getMockEventDetails(slug);
  const similarEvents = getMockSimilarEvents();

  const handleLike = () => {
    console.log('Event liked:', event.title);
  };

  const handleSave = () => {
    console.log('Event saved:', event.title);
  };

  const handleShare = () => {
    console.log('Event shared:', event.title);
  };

  const handleGetTickets = () => {
    console.log('Get tickets clicked for:', event.title);
    // This would typically open an external ticketing link
  };

  const handleAddToCalendar = () => {
    console.log('Add to calendar clicked for:', event.title);
    // This would typically create a calendar event
  };

  const handleViewOnInstagram = () => {
    console.log('View on Instagram clicked for:', event.title);
    // This would typically open Instagram
  };

  const handleLearnMoreVenue = () => {
    console.log('Learn more about venue clicked for:', event.venue);
    // This would typically navigate to venue details
  };

  const handleSimilarEventClick = (clickedEvent: EventData) => {
    console.log('Similar event clicked:', clickedEvent.title);
    router.push(`/events/${clickedEvent.id}`);
  };

  return (
    <EventDetailsPage
      event={event}
      similarEvents={similarEvents}
      onLike={handleLike}
      onSave={handleSave}
      onShare={handleShare}
      onGetTickets={handleGetTickets}
      onAddToCalendar={handleAddToCalendar}
      onViewOnInstagram={handleViewOnInstagram}
      onLearnMoreVenue={handleLearnMoreVenue}
      onSimilarEventClick={handleSimilarEventClick}
    />
  );
}