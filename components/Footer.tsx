'use client';

import Image from 'next/image';

import { useState } from 'react';
import Link from 'next/link';
// import { MailOpen } from 'lucide-react';

const mailOpenIcon = "http://localhost:3845/assets/3913080ccc0bf4fbaad721b15c046b59692c6ae6.svg";

export default function Footer() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', { fullName, email });
    // Here you would implement newsletter subscription
    setFullName('');
    setEmail('');
  };

  const footerLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Nightlife', href: '/nightlife' },
    { name: 'Blog', href: '/blog' },
    { name: 'Curators', href: '/community' },
    { name: 'Weekender Tribe', href: '/community' },
    { name: 'Weekender Guide', href: '/weekend-guide' }
  ];

  return (
    <footer className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative w-full" role="contentinfo">
      <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-16 items-start justify-start max-w-[1440px] pb-10 pt-20 px-16 relative shrink-0 w-full">
        
        {/* Newsletter Section */}
        <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-row gap-[100px] items-start justify-end max-w-[1024px] p-0 relative shrink-0 w-full">
            
            {/* Left Content */}
            <div className="basis-0 box-border content-stretch flex flex-row gap-4 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
              <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative rounded-[14px] shrink-0 size-14 border border-[#e5eaf0] shadow-sm">
                <div className="relative shrink-0 size-6">
                  <Image alt="Mail icon" className="block max-w-none size-full" src={mailOpenIcon} width={20} height={20} />
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-center leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-[#000000] text-left">
                <div className="font-semibold relative shrink-0 text-[32px] tracking-[-0.64px] w-full">
                  <p className="block leading-[normal]">
                    Discover the Best Things to Do in Lagos, Every Weekend
                  </p>
                </div>
                <div className="font-normal relative shrink-0 text-[16px] tracking-[-0.16px] w-full">
                  <p className="block leading-[24px]">
                    From pop-ups to party spots, discover what&apos;s happening in Lagos before everyone else. Weekly drops, no noise.
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="basis-0 box-border content-stretch flex flex-col gap-4 grow items-center justify-start max-w-[404px] min-h-px min-w-px p-0 relative shrink-0">
              <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[16px] relative rounded-md shrink-0 w-full border border-[#e5eaf0] font-normal text-[15px] tracking-[-0.3px] text-[#838b9e] placeholder:text-[#838b9e] focus:outline-none focus:border-[#fb7102] transition-colors"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[16px] relative rounded-md shrink-0 w-full border border-[#e5eaf0] font-normal text-[15px] tracking-[-0.3px] text-[#838b9e] placeholder:text-[#838b9e] focus:outline-none focus:border-[#fb7102] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.6)] box-border content-stretch flex flex-row gap-2 items-center justify-center p-[16px] relative rounded-[10px] shrink-0 w-full transition-colors"
                >
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.32px]">
                    <p className="block leading-[16px] whitespace-pre">Subscribe</p>
                  </div>
                </button>
              </div>
              <div className="font-normal leading-[0] not-italic relative shrink-0 text-[#697289] text-center tracking-[-0.28px] w-full">
                <p className="leading-[16px] text-[14px]">
                  <span>We care about your </span>
                  <Link href="/privacy" className="underline text-[#fb7102] hover:text-[#e5650a] transition-colors">
                    privacy
                  </Link>
                  <span>, we won&apos;t spam</span>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="box-border content-stretch flex flex-row items-center justify-between pb-0 pt-8 px-0 relative shrink-0 w-full border-t border-[#e5eaf0]">
          <div className="box-border content-stretch flex flex-row items-center justify-center min-w-60 p-0 relative shrink-0">
            <div className="basis-0 font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#697289] text-[14px] text-left tracking-[-0.14px]">
              <p className="block leading-[16px]">
                © Copyright The Lagos Weekender. All rights reserved
              </p>
            </div>
          </div>
          <div className="flex flex-wrap font-medium gap-8 items-center justify-end leading-[0] min-w-60 not-italic p-0 relative shrink-0 text-[#697289] text-[14px] text-right tracking-[-0.14px]">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative shrink-0 text-nowrap hover:text-[#fb7102] transition-colors"
              >
                <p className="block leading-[16px] whitespace-pre">{link.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}