'use client';

import Image from 'next/image';

import Link from 'next/link';

const imgLucideChevronRight = "http://localhost:3845/assets/f97dae574acc3dd29a9b8c317d7670b7ea538246.svg";
const imgLucideHeart = "http://localhost:3845/assets/a9d7ffb2fe16f2b08a5ef3ee3e7192b794ad6d4f.svg";
const imgLucideBookmark = "http://localhost:3845/assets/63508985349003a8d39ff8c43f23bc21ba8dcab0.svg";
const imgLucideShare = "http://localhost:3845/assets/b5d97c06c45272b17fb4717b1f538d6a47ba59a8.svg";
const imgAuthorAvatar = "http://localhost:3845/assets/774d08f3793ed7c4cbd8d6c425263d9aaf4b94e5.png";

interface BlogPageHeaderProps {
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export default function BlogPageHeader({
  title,
  excerpt,
  author,
  date,
  readTime,
  onLike,
  onSave,
  onShare
}: BlogPageHeaderProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative size-full">
      <div className="box-border content-stretch flex flex-col gap-10 items-start justify-start max-w-[1440px] pb-8 pt-16 px-16 relative shrink-0 w-full">
        
        {/* Breadcrumb */}
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-0 py-2 relative shrink-0 w-full">
            <Link href="/" className="font-['BDO_Grotesk:DemiBold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap hover:text-[#fb7102] transition-colors">
              <p className="block leading-[20px] whitespace-pre">Home</p>
            </Link>
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
              <div className="relative shrink-0 size-4">
                <Image alt="Breadcrumb separator" className="block max-w-none size-full" src={imgLucideChevronRight} width={16} height={16} />
              </div>
            </div>
            <Link href="/blog" className="font-['BDO_Grotesk:DemiBold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap hover:text-[#fb7102] transition-colors">
              <p className="block leading-[20px] whitespace-pre">Blog</p>
            </Link>
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
              <div className="relative shrink-0 size-4">
                <Image alt="Breadcrumb separator" className="block max-w-none size-full" src={imgLucideChevronRight} width={16} height={16} />
              </div>
            </div>
            <div className="font-['BDO_Grotesk:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ff6b00] text-[14px] text-left text-nowrap">
              <p className="block leading-[20px] whitespace-pre">The Anti-Outside Guide</p>
            </div>
          </div>
        </div>

        {/* Title + Excerpt */}
        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-[978px]">
          <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.45] relative shrink-0 text-[#000000] text-[36px] tracking-[-1.08px] w-[786px]">
            <p className="adjustLetterSpacing block mb-0">
              {title}
            </p>
          </div>
          <div className="font-['Inter:Regular',_sans-serif] font-normal min-w-full relative shrink-0 text-[#50576b] text-[18px] tracking-[-0.36px]" style={{ width: "min-content" }}>
            <p className="block leading-[28px]">
              {excerpt}
            </p>
          </div>
        </div>

        {/* Author + Actions */}
        <div className="box-border content-stretch flex flex-row h-11 items-end justify-between p-0 relative shrink-0 w-full">
          
          {/* Author Card (Micro) */}
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative">
              <div
                className="bg-[#e6e6e6] bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] rounded shrink-0 size-11"
                style={{ backgroundImage: `url('${author.avatar || imgAuthorAvatar}')` }}
              />
              <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[198px]">
                <div className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left w-full">
                  <p className="block leading-[normal]">{author.name}</p>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 h-4 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[#697289] text-[12px] text-left text-nowrap w-full">
                  <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0">
                    <p className="block leading-[16px] text-nowrap whitespace-pre">{date}</p>
                  </div>
                  <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0">
                    <p className="block leading-[16px] text-nowrap whitespace-pre">·</p>
                  </div>
                  <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0">
                    <p className="block leading-[16px] text-nowrap whitespace-pre">{readTime} min read</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative">
              
              {/* Like Button */}
              <button
                onClick={onLike}
                className="h-10 relative rounded-md shrink-0 border border-slate-200 border-solid hover:bg-gray-50 transition-colors"
              >
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 h-10 items-center justify-center px-[17px] py-[9px] relative">
                  <div className="relative shrink-0 size-4">
                    <Image alt="Like icon" className="block max-w-none size-full" src={imgLucideHeart} width={20} height={20} />
                  </div>
                  <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap">
                    <p className="block leading-[16px] whitespace-pre">Like</p>
                  </div>
                </div>
              </button>

              {/* Save Button */}
              <button
                onClick={onSave}
                className="h-10 relative rounded-md shrink-0 border border-slate-200 border-solid hover:bg-gray-50 transition-colors"
              >
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 h-10 items-center justify-center px-[17px] py-[9px] relative">
                  <div className="relative shrink-0 size-4">
                    <Image alt="Bookmark icon" className="block max-w-none size-full" src={imgLucideBookmark} width={20} height={20} />
                  </div>
                  <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap">
                    <p className="block leading-[16px] whitespace-pre">Save</p>
                  </div>
                </div>
              </button>

              {/* Share Button */}
              <button
                onClick={onShare}
                className="h-10 relative rounded-md shrink-0 border border-slate-200 border-solid hover:bg-gray-50 transition-colors"
              >
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 h-10 items-center justify-center px-[17px] py-[9px] relative">
                  <div className="relative shrink-0 size-4">
                    <Image alt="Share icon" className="block max-w-none size-full" src={imgLucideShare} width={20} height={20} />
                  </div>
                  <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap">
                    <p className="block leading-[16px] whitespace-pre">Share</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .adjustLetterSpacing {
          letter-spacing: inherit;
        }
      `}</style>
    </div>
  );
}