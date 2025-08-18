'use client';

import Image from 'next/image';

import { useState } from 'react';

const imgLucideMail = "http://localhost:3845/assets/abcfda3bfc174a646035e52e4c7076ed7745ee85.svg";

export default function BlogDetailsSidebar() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', { email });
    // Here you would implement newsletter subscription
    setEmail('');
  };

  return (
    <div className="box-border content-stretch flex flex-row items-center justify-start max-w-[400px] p-0 relative shrink-0 w-[382px]">
      <div className="basis-0 bg-slate-50 box-border content-stretch flex flex-col gap-8 grow items-start justify-start min-h-px min-w-px p-[32px] relative shrink-0">
        
        {/* Header */}
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#13151a] text-[20px] tracking-[-0.4px] w-full">
            <p className="block leading-[28px]">Subscribe to the Newsletter</p>
          </div>
          <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#50576b] text-[16px] tracking-[-0.32px] w-full">
            <p className="block leading-[24px]">Stay informed with expert analysis, industry trends, and actionable tips.</p>
          </div>
        </div>

        {/* Newsletter Form */}
        <form onSubmit={handleSubscribe} className="box-border content-stretch flex flex-col gap-4 items-center justify-start p-0 relative shrink-0 w-full">
          
          {/* Email Input */}
          <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[12px] relative rounded-[10px] shrink-0 w-full border border-[#e5eaf0]">
            <div className="relative shrink-0 size-5">
              <Image alt="Email icon" className="block max-w-none size-full" src={imgLucideMail} width={20} height={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic bg-transparent outline-none flex-1 text-[#838b9e] text-[14px] text-left tracking-[-0.28px] placeholder:text-[#838b9e]"
            />
          </div>

          {/* Subscribe Button */}
          <button
            type="submit"
            className="bg-[#000000] hover:bg-[#333333] box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-3 relative rounded-[10px] shrink-0 w-full transition-colors"
          >
            <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-0.28px]">
              <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">Subscribe</p>
            </div>
          </button>

          {/* Privacy Notice */}
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#697289] text-[14px] text-center tracking-[-0.28px] w-full">
            <p className="leading-[16px]">
              <span>We care about your </span>
              <a href="/privacy" className="underline text-[#fb7102] hover:text-[#e5650a] transition-colors">
                privacy
              </a>
              <span>, we won&apos;t spam</span>
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .adjustLetterSpacing {
          letter-spacing: inherit;
        }
      `}</style>
    </div>
  );
}