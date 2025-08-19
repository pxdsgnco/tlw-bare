'use client';

interface NightlifeMainContentProps {
  content: string;
  venueName: string;
}

export default function NightlifeMainContent({ content: _content, venueName }: NightlifeMainContentProps) {
  // Figma-specified venue description content
  const figmaContent = [
    "The Beach by Gusto stands as one of Lagos' most prestigious beachfront destinations, offering an unparalleled nightlife experience that seamlessly blends luxury with the laid-back coastal atmosphere. Located on the pristine shores of Victoria Island, this venue has become synonymous with high-energy entertainment and sophisticated leisure.",
    "What sets The Beach by Gusto apart is its unique positioning as both a daytime beach club and a vibrant nightlife destination. As the sun sets over the Atlantic, the venue transforms into a pulsating hub of music, dance, and social connection. The famous Tropicana Sunday events have become legendary among Lagos party-goers, featuring the best Amapiano DJs and live performances that keep the energy flowing until the early hours.",
    "The venue boasts multiple zones designed to cater to different moods and preferences. The main dance floor, positioned right on the sand, offers an authentic beach party experience with state-of-the-art sound systems and lighting that creates an electric atmosphere. For those seeking a more intimate setting, the elevated VIP sections provide panoramic views of both the ocean and the bustling party below.",
    "The Beach by Gusto is particularly renowned for its Sunday events, which have become a cultural phenomenon in Lagos nightlife. These events attract a diverse crowd of professionals, creatives, and socialites who come together to celebrate life, music, and community. The venue's commitment to showcasing the best of Afrobeats and Amapiano has made it a launching pad for emerging artists and a favorite spot for established performers.",
    "Beyond the music and dancing, the venue offers a comprehensive dining experience with a menu that celebrates both local Nigerian flavors and international cuisine. The bar program features expertly crafted cocktails, premium spirits, and an extensive wine selection, all served by professional bartenders who understand the art of hospitality.",
    "Whether you're looking to dance the night away, enjoy a romantic dinner by the ocean, or simply unwind with friends while watching the sunset, The Beach by Gusto provides an unforgettable experience that captures the essence of Lagos' vibrant social scene."
  ];

  return (
    <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
      {/* h3 Title styled like events card */}
      <h3 className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#13151a] text-[24px] tracking-[-0.24px] w-full">
        About {venueName}
      </h3>
      
      {/* Figma content structure */}
      <div className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-5 items-center justify-center leading-[0] not-italic p-0 relative size-full text-[#50576b] text-[18px] text-left tracking-[-0.18px]">
        {figmaContent.map((paragraph, index) => (
          <div key={index} className="relative shrink-0 w-full">
            <p className="block leading-[28px]">{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
}