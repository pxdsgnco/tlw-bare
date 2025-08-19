'use client';

interface EventMainContentProps {
  images: string[];
  content: string;
}

export default function EventMainContent({ images, content }: EventMainContentProps) {
  const mainImage = images[0] || '';

  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[38px] grow h-auto items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
      {/* Image Gallery */}
      <div 
        className="bg-center bg-cover bg-no-repeat h-[665px] shrink-0 w-full rounded-lg overflow-hidden"
        style={{ backgroundImage: `url('${mainImage}')` }}
      />
      
      {/* Main Content */}
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#13151a] text-[24px] tracking-[-0.24px] w-full">
          <p className="block leading-[1.2]">About this event</p>
        </div>
        
        <div 
          className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#50576b] text-[18px] tracking-[-0.18px] w-full prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}