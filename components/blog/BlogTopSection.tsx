'use client';

import Image from 'next/image';

const imgMidYearBurnoutReal = "http://localhost:3845/assets/9ce5e735e99eefe6eaaaefb2fa5fb41ebacf7fbb.png";
const imgLucideChevronRight = "http://localhost:3845/assets/6a5f74ab34e0eeb6d03a8969e1b31f41a89effa4.svg";

interface FeaturedArticleData {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  badge?: string;
}

interface BlogTopSectionProps {
  featuredArticle?: FeaturedArticleData;
}

export default function BlogTopSection({ featuredArticle }: BlogTopSectionProps) {
  const defaultArticle: FeaturedArticleData = {
    id: '1',
    title: "Mid-Year Burnout Is Real — Here's Your Lagos Survival Plan",
    excerpt: "One thing about Lagosians? We don't need much to turn a regular day into a full-blown festival. And July? It's packed. Whether you're a front-row rager, a back-corner wine-and-observe type, or just follow the vibes (and your friends), July in Lagos has something for you. The parties are back-to-back, the invites are stacking up, and the FOMO is real. And best of all, you don't worry about anything; we've sifted through the madness to bring you the best of the best.",
    date: 'Jul 02, 2025',
    readTime: '5 min read',
    image: imgMidYearBurnoutReal,
    badge: 'Trending Articles'
  };

  const article = featuredArticle || defaultArticle;

  const handleReadPost = () => {
    console.log('Navigate to article:', article.title);
    // Here you would implement navigation to the full article
  };

  return (
    <div className="bg-slate-50 box-border content-stretch flex flex-col items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-11 items-center justify-start max-w-[1440px] px-8 py-16 relative shrink-0 w-full">
        
        {/* Page Title Block */}
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
          <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#fb7102] text-[14px] tracking-[-0.14px] uppercase w-full">
            <p className="block leading-[1.35]">THE BLOG</p>
          </div>
          <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000] text-[44px] tracking-[-1.32px] w-full">
            <p className="block leading-[1.35]">Latest Happenings Around Lagos</p>
          </div>
          <div className="font-['Inter:Regular',_sans-serif] font-normal max-w-[740px] relative shrink-0 text-[#50576b] text-[18px] tracking-[-0.36px] w-full">
            <p className="block leading-[28px]">
              Explore the vibrant streets of Lagos, where every corner tells a story. Discover captivating tales and rich cultural experiences that define this bustling city.
            </p>
          </div>
        </div>

        {/* Featured Article Card */}
        <div className="box-border content-stretch flex flex-row gap-10 items-center justify-start p-0 relative shrink-0 w-full">
          
          {/* Article Image */}
          <div 
            className="basis-0 bg-center bg-cover bg-no-repeat grow h-[408px] min-h-px min-w-px shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url('${article.image}')` }}
            onClick={handleReadPost}
          />
          
          {/* Article Content */}
          <div className="basis-0 box-border content-stretch flex flex-col gap-5 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
            
            {/* Badge */}
            {article.badge && (
              <div className="bg-[rgba(0,0,0,0.7)] box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-1.5 relative rounded-2xl shrink-0">
                <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.7)] border-solid inset-0 pointer-events-none rounded-2xl" />
                <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                  <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">{article.badge}</p>
                </div>
              </div>
            )}
            
            {/* Metadata */}
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[#697289] text-left text-nowrap w-full">
              <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[14px]">
                <p className="block leading-[16px] text-nowrap whitespace-pre">{article.date}</p>
              </div>
              <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0 text-[12px]">
                <p className="block leading-[16px] text-nowrap whitespace-pre">·</p>
              </div>
              <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[14px]">
                <p className="block leading-[16px] text-nowrap whitespace-pre">{article.readTime}</p>
              </div>
            </div>
            
            {/* Title and Excerpt */}
            <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left w-full">
              <button
                onClick={handleReadPost}
                className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000] text-[32px] tracking-[-0.96px] w-[484px] text-left hover:text-[#fb7102] transition-colors"
              >
                <p className="adjustLetterSpacing block leading-[1.35]">{article.title}</p>
              </button>
              <div className="-webkit-box css-brmhkr font-['Inter:Regular',_sans-serif] font-normal min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#50576b] text-[18px] tracking-[-0.18px]" style={{ width: "min-content" }}>
                <p className="block leading-[1.55]">{article.excerpt}</p>
              </div>
            </div>
            
            {/* Read Post CTA */}
            <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
              <button
                onClick={handleReadPost}
                className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
              >
                <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[15px] text-left text-nowrap tracking-[-0.15px] [text-decoration-line:underline] [text-decoration-style:solid] [text-underline-position:from-font]">
                  <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">Read post</p>
                </div>
                <div className="relative shrink-0 size-5">
                  <Image alt="Read more arrow" className="block max-w-none size-full" src={imgLucideChevronRight} width={20} height={20} />
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
        .css-brmhkr {
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          display: -webkit-box;
        }
        .-webkit-box {
          display: -webkit-box;
        }
      `}</style>
    </div>
  );
}