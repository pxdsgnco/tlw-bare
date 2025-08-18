'use client';

import Image from 'next/image';

const chevronRightIcon = "http://localhost:3845/assets/7fb6928ae87c43d09ccb0b2432628281b4f233a8.svg";

// Types for article data
interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  size?: 'featured' | 'standard';
}

// Reusable Read Time component
interface ReadTimeProps {
  date: string;
  readTime: string;
  textSize?: 'sm' | 'xs';
}

function ReadTime({ date, readTime, textSize = 'xs' }: ReadTimeProps) {
  const sizeClasses = textSize === 'sm' ? 'text-[13px]' : 'text-[12px]';
  
  return (
    <div className={`box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full text-[#697289] ${sizeClasses} text-nowrap`}>
      <div className="font-medium leading-[0] not-italic relative shrink-0">
        <p className="block leading-[16px] whitespace-pre">{date}</p>
      </div>
      <div className="font-bold leading-[0] not-italic relative shrink-0">
        <p className="block leading-[16px] whitespace-pre">·</p>
      </div>
      <div className="font-medium leading-[0] not-italic relative shrink-0">
        <p className="block leading-[16px] whitespace-pre">{readTime}</p>
      </div>
    </div>
  );
}

// Reusable Call to Action component
interface CallToActionProps {
  onClick: () => void;
  variant?: 'featured' | 'standard';
}

function CallToAction({ onClick, variant = 'standard' }: CallToActionProps) {
  const textSize = variant === 'featured' ? 'text-[15px]' : 'text-[14px]';
  const fontWeight = variant === 'featured' ? 'font-medium' : 'font-normal';
  
  return (
    <button
      onClick={onClick}
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0 group"
    >
      <div className={`${fontWeight} leading-[0] not-italic relative shrink-0 text-[#fb7102] ${textSize} text-left text-nowrap tracking-[-0.15px] underline hover:no-underline transition-all`}>
        <p className="block leading-[20px] whitespace-pre">Read post</p>
      </div>
      <div className="relative shrink-0 size-5 group-hover:translate-x-1 transition-transform">
        <Image alt="Read more arrow" className="block max-w-none size-full" src={chevronRightIcon} width={20} height={20} />
      </div>
    </button>
  );
}

// Featured Article Card (Larger cards for first 2 articles)
interface FeaturedArticleCardProps {
  article: ArticleData;
  onClick: (article: ArticleData) => void;
}

function FeaturedArticleCard({ article, onClick }: FeaturedArticleCardProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[421px] cursor-pointer group">
      {/* Featured Image */}
      <div
        className="aspect-[421/240] bg-center bg-cover bg-no-repeat shrink-0 w-full overflow-hidden group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url('${article.image}')` }}
        onClick={() => onClick(article)}
      />
      
      {/* Article Content */}
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start pl-0 pr-6 py-0 relative shrink-0 w-full">
        {/* Date + Read Time */}
        <ReadTime date={article.date} readTime={article.readTime} textSize="sm" />
        
        {/* Title */}
        <button
          onClick={() => onClick(article)}
          className="font-medium leading-[0] not-italic relative shrink-0 text-[#13151a] text-[18px] text-left tracking-[-0.18px] w-full text-left hover:text-[#fb7102] transition-colors"
        >
          <p className="block leading-[1.45]">{article.title}</p>
        </button>
        
        {/* Excerpt */}
        <div className="font-medium leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#50576b] text-[15px] text-left w-full line-clamp-3">
          <p className="block leading-[1.55]">{article.excerpt}</p>
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction onClick={() => onClick(article)} variant="featured" />
    </div>
  );
}

// Standard Article Card (Smaller cards for remaining articles)
interface StandardArticleCardProps {
  article: ArticleData;
  onClick: (article: ArticleData) => void;
}

function StandardArticleCard({ article, onClick }: StandardArticleCardProps) {
  return (
    <div className="basis-0 bg-[#ffffff] box-border content-stretch flex flex-col gap-6 grow items-start justify-start min-h-px min-w-[372px] p-0 relative shrink-0 cursor-pointer group">
      {/* Article Image */}
      <div
        className="bg-center bg-cover bg-no-repeat h-60 shrink-0 w-full overflow-hidden group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url('${article.image}')` }}
        onClick={() => onClick(article)}
      />
      
      {/* Article Content */}
      <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start leading-[0] not-italic pl-0 pr-6 py-0 relative shrink-0 text-left w-full">
        {/* Date + Read Time */}
        <ReadTime date={article.date} readTime={article.readTime} />
        
        {/* Title */}
        <button
          onClick={() => onClick(article)}
          className="font-medium relative shrink-0 text-[#13151a] text-[18px] tracking-[-0.18px] w-full text-left hover:text-[#fb7102] transition-colors"
        >
          <p className="block leading-[1.45]">{article.title}</p>
        </button>
        
        {/* Excerpt */}
        <div className="font-medium overflow-ellipsis overflow-hidden relative shrink-0 text-[#50576b] text-[14px] tracking-[-0.14px] w-full line-clamp-3">
          <p className="block leading-[1.55]">{article.excerpt}</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-[8px]">
        <CallToAction onClick={() => onClick(article)} />
      </div>
    </div>
  );
}

// Main Curated Articles Component
export default function CuratedArticles() {
  // Sample articles data
  const articles: ArticleData[] = [
    {
      id: '1',
      title: 'Events in Lagos This Weekend: 4th – 6th July, 2025',
      excerpt: 'July came in with party shoes. This weekend alone, we\'ve clocked raves, night parties, and beachside madness. Whether',
      date: 'Jul 03, 2025',
      readTime: '5 mins read',
      image: 'http://localhost:3845/assets/1f40c297638b1160833c9cb8127ebeec28e9f965.png',
      size: 'featured'
    },
    {
      id: '2',
      title: 'The Anti-Outside Guide: For When You\'re Done With People, But Still Want Soft Life',
      excerpt: 'Let\'s get this straight: in Lagos, "outside" doesn\'t always have to mean a carnival of activity. We say "we\'re outside" and it\'s parties, clubs, concerts, link-ups, and all those high-energy, people-filled activities that drain your battery faster than scrolling through Instagram.',
      date: 'Jul 02, 2025',
      readTime: '5 mins read',
      image: 'http://localhost:3845/assets/0a93470acdd29c87aed803716725923a770ad82e.png',
      size: 'featured'
    },
    {
      id: '3',
      title: 'Mid-Year Burnout Is Real — Here\'s Your Lagos Survival Plan',
      excerpt: 'We\'re halfway through 2025, and if you feel like you\'ve been running on vibes and inshallah since February, welcome. Between office deadlines, black tax, traffic, side hustles,',
      date: 'Jun 27, 2025',
      readTime: '5 min read',
      image: 'http://localhost:3845/assets/370fa4896c95266c9c5f61a5e4426379337d2f9d.png'
    },
    {
      id: '4',
      title: 'Events in Lagos This Weekend: 26th – 29th June, 2025',
      excerpt: 'June was quite a character, with moody weather, public holidays that went by faster than Keke in traffic, all while still managing work, friends, and family.',
      date: 'Jun 26, 2025',
      readTime: '5 min read',
      image: 'http://localhost:3845/assets/268c08f536b98d5e2a0491ce5d7b48fe8f748248.png'
    },
    {
      id: '5',
      title: '6 Instagrammable Spots in Lagos',
      excerpt: 'Let\'s be honest: Lagos looks extra fine when the sun is out. Whether you\'re chasing golden hour, curating your soft life aesthetic,',
      date: 'Jun 20, 2025',
      readTime: '5 min read',
      image: 'http://localhost:3845/assets/85ad52be9efb52dc9e9608dafebbcbe9096020f9.png'
    },
    {
      id: '6',
      title: 'Events in Lagos This Weekend: 20th – 22nd June, 2025',
      excerpt: 'While the public holidays for this month are done and dusted, we still have some days till we\'re done with June and of',
      date: 'Jun 19, 2025',
      readTime: '5 min read',
      image: 'http://localhost:3845/assets/61136ffef3a230d6bf582c2fa62d6322f6352fc7.png'
    }
  ];

  const handleArticleClick = (article: ArticleData) => {
    console.log('Article clicked:', article.title);
    // Here you would implement navigation to article details
  };

  const handleViewAll = () => {
    console.log('View all articles');
    // Here you would implement navigation to articles page
  };

  // Separate featured and standard articles
  const featuredArticles = articles.filter(article => article.size === 'featured');
  const standardArticles = articles.filter(article => !article.size || article.size === 'standard');

  return (
    <div className="box-border content-stretch flex flex-row items-start justify-center p-0 relative w-full">
      <div className="basis-0 box-border content-stretch flex flex-col gap-20 grow items-start justify-start max-w-[1440px] min-h-px min-w-px px-8 py-[100px] relative shrink-0">
        
        {/* Section Container */}
        <div className="box-border content-stretch flex flex-col gap-10 items-start justify-start p-0 relative shrink-0 w-full">
          
          {/* Section Header */}
          <div className="box-border content-stretch flex flex-row gap-11 h-[65px] items-end justify-start leading-[0] not-italic p-0 relative shrink-0 w-full">
            <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0 text-left">
              <div className="font-medium relative shrink-0 text-[#13151a] text-[32px] w-full">
                <p className="block leading-[1.2]">Curated Articles</p>
              </div>
              <div className="font-normal relative shrink-0 text-[#50576b] text-[16px] w-full">
                <p className="block leading-[1.2]">
                  Amazing discoveries around we believe you would find interesting
                </p>
              </div>
            </div>
            <button
              onClick={handleViewAll}
              className="font-semibold relative shrink-0 text-[#fb7102] text-[14px] text-nowrap text-right hover:underline transition-all"
            >
              <p className="block leading-[1.2] whitespace-pre">View all</p>
            </button>
          </div>

          {/* Articles Grid */}
          <div className="flex flex-wrap gap-6 items-start justify-start p-0 relative shrink-0 w-full">
            
            {/* Featured Articles (First 2) */}
            {featuredArticles.map((article) => (
              <FeaturedArticleCard
                key={article.id}
                article={article}
                onClick={handleArticleClick}
              />
            ))}

            {/* Standard Articles (Remaining 4) */}
            {standardArticles.map((article) => (
              <StandardArticleCard
                key={article.id}
                article={article}
                onClick={handleArticleClick}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}