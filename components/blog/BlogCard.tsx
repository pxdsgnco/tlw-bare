'use client';

import Link from 'next/link';
import Image from 'next/image';

const imgLucideChevronRight = "http://localhost:3845/assets/353458b3c36b2a394259351c733bce366edbcbba.svg";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

export default function BlogCard({ 
  title, 
  excerpt, 
  date, 
  readTime, 
  image, 
  slug 
}: BlogCardProps) {
  return (
    <Link 
      href={`/blog/${slug}`}
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full cursor-pointer group block"
    >
      
      {/* Article Image */}
      <div
        className="aspect-[421/240] bg-center bg-cover bg-no-repeat shrink-0 w-full overflow-hidden group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url('${image}')` }}
      />
      
      {/* Article Content */}
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start pl-0 pr-6 py-0 relative shrink-0 w-full">
        
        {/* Date + Read Time */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
          <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#697289] text-[13px] text-left text-nowrap">
            <p className="block leading-[16px] whitespace-pre">{date}</p>
          </div>
          <div className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#697289] text-[13px] text-left text-nowrap">
            <p className="block leading-[16px] whitespace-pre">·</p>
          </div>
          <div className="box-border content-stretch flex flex-row font-['Inter:Medium',_sans-serif] font-medium gap-1 items-center justify-center leading-[0] not-italic p-0 relative shrink-0 text-[#697289] text-[13px] text-left text-nowrap">
            <div className="relative shrink-0">
              <p className="block leading-[16px] text-nowrap whitespace-pre">{readTime}</p>
            </div>
            <div className="relative shrink-0">
              <p className="block leading-[16px] text-nowrap whitespace-pre">mins read</p>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#13151a] text-[18px] text-left tracking-[-0.18px] w-full text-left group-hover:text-[#fb7102] transition-colors">
          <p className="block leading-[1.45]">{title}</p>
        </div>
        
        {/* Excerpt */}
        <div className="-webkit-box css-k4ppra font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#50576b] text-[15px] text-left w-full">
          <p className="block leading-[1.55]">{excerpt}</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0 group-hover:translate-x-1 transition-transform">
        <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#fb7102] text-[15px] text-left text-nowrap tracking-[-0.15px]">
          <p className="[text-decoration-line:underline] [text-decoration-style:solid] [text-underline-position:from-font] adjustLetterSpacing block leading-[20px] whitespace-pre">Read post</p>
        </div>
        <div className="relative shrink-0 size-5">
          <Image 
            alt="Read more arrow" 
            className="block max-w-none size-full" 
            src={imgLucideChevronRight}
            width={20}
            height={20}
          />
        </div>
      </div>

      <style jsx>{`
        .adjustLetterSpacing {
          letter-spacing: inherit;
        }
        .css-k4ppra {
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          display: -webkit-box;
        }
        .-webkit-box {
          display: -webkit-box;
        }
      `}</style>
    </Link>
  );
}