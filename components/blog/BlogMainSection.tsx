'use client';

import { useState } from 'react';
import BlogCard from './BlogCard';
import BlogPagination from './BlogPagination';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category?: string;
  slug: string;
}

interface BlogMainSectionProps {
  articles?: BlogArticle[];
  selectedCategory?: string;
  selectedSort?: string;
  articlesPerPage?: number;
}


export default function BlogMainSection({ 
  articles, 
  selectedCategory = 'All Categories',
  selectedSort = 'Most Recent',
  articlesPerPage = 9
}: BlogMainSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sample articles data
  const defaultArticles: BlogArticle[] = [
    {
      id: '1',
      title: 'Events in Lagos This Weekend: 4th – 6th July, 2025',
      excerpt: 'July came in with party shoes. This weekend alone, we\'ve clocked raves, night parties, and beachside madness. Whether',
      date: 'Jul 03, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/1f40c297638b1160833c9cb8127ebeec28e9f965.png',
      category: 'Events',
      slug: 'events-in-lagos-this-weekend-4th-6th-july-2025'
    },
    {
      id: '2',
      title: 'The Anti-Outside Guide: For When You\'re Done With People, But Still Want Soft Life',
      excerpt: 'Let\'s get this straight: in Lagos, "outside" doesn\'t always have to mean a carnival of activity. We say "we\'re outside" and it\'s parties, clubs, concerts, link-ups, and all those high-energy, people-filled activities that drain your battery faster than scrolling through Instagram.',
      date: 'Jul 02, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/0a93470acdd29c87aed803716725923a770ad82e.png',
      category: 'Things to do',
      slug: 'the-anti-outside-guide-for-when-youre-done-with-people-but-still-want-soft-life'
    },
    {
      id: '3',
      title: 'Events in Lagos This Weekend: 26th – 29th June, 2025',
      excerpt: 'June was quite a character, with moody weather, public holidays that went by faster than Keke in traffic, all while still managing work, friends, and family.',
      date: 'Jun 26, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/268c08f536b98d5e2a0491ce5d7b48fe8f748248.png',
      category: 'Events',
      slug: 'events-in-lagos-this-weekend-26th-29th-june-2025'
    },
    {
      id: '4',
      title: '6 Instagrammable Spots in Lagos',
      excerpt: 'Let\'s be honest: Lagos looks extra fine when the sun is out. Whether you\'re chasing golden hour, curating your soft life aesthetic,',
      date: 'Jun 20, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/85ad52be9efb52dc9e9608dafebbcbe9096020f9.png',
      category: 'Travel',
      slug: '6-instagrammable-spots-in-lagos'
    },
    {
      id: '5',
      title: 'Events in Lagos This Weekend: 20th – 22nd June, 2025',
      excerpt: 'While the public holidays for this month are done and dusted, we still have some days till we\'re done with June and of',
      date: 'Jun 19, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/61136ffef3a230d6bf582c2fa62d6322f6352fc7.png',
      category: 'Events',
      slug: 'events-in-lagos-this-weekend-20th-22nd-june-2025'
    },
    {
      id: '6',
      title: 'Here\'s Where to Eat in Lagos Mainland for Under ₦15k',
      excerpt: 'Not everyone wants to cross the bridge to eat brunch with a side of parking wahala. Sometimes, you just want good food and good vibes on a budget,',
      date: 'Jun 18, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/5aacfd52f62bae03ae1990e65f7ab045e8b7855b.png',
      category: 'Food',
      slug: 'heres-where-to-eat-in-lagos-mainland-for-under-15k'
    },
    {
      id: '7',
      title: 'The Presummer Crash Course: Fashion Tips, Wellness Tips, And Activities',
      excerpt: 'Summer in Lagos isn\'t the weather; it\'s just a prelude to Detty December activities. We\'re talking summer-themed parties, people travelling in and out of the country.',
      date: 'Jun 13, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/14bd846fff3ff9fbdc3da452e1730978a24db67c.png',
      category: 'Fashion',
      slug: 'the-presummer-crash-course-fashion-tips-wellness-tips-and-activities'
    },
    {
      id: '8',
      title: 'Events in Lagos This Weekend: 12th – 15th June, 2025',
      excerpt: 'Happy Democracy Day, Today\'s not for stress. It\'s not for any meeting, the third mainland madness, or "let\'s just do a quick Zoom."',
      date: 'Jun 12, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/6826b5d04a5e8cd717682d0edd5ffb755643edd3.png',
      category: 'Events',
      slug: 'events-in-lagos-this-weekend-12th-15th-june-2025'
    },
    {
      id: '9',
      title: 'The Best Festivals & Parties Happening in Lagos this June',
      excerpt: 'We started June with a bit of rain, it\'s becoming more frequent, and some days are more cloudy than others. Of course,',
      date: 'Jun 7, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/69818f8fb22141a04122639d1bd79f86be5d1084.png',
      category: 'Entertainment',
      slug: 'the-best-festivals-parties-happening-in-lagos-this-june'
    },
    {
      id: '10',
      title: 'Events in Lagos This Weekend: 6th – 8th June, 2025',
      excerpt: 'We\'re kicking things off on a high note—a public holiday, courtesy of our Muslim fam. And yes, it\'s the meat one. If you\'ve got',
      date: 'Jun 5, 2025',
      readTime: '5',
      image: 'http://localhost:3845/assets/1cadcac29a3701fcaae2c746263098a14f2cd7ca.png',
      category: 'Events',
      slug: 'events-in-lagos-this-weekend-6th-8th-june-2025'
    }
  ];

  const articlesData = articles || defaultArticles;

  // Filter articles based on category
  const filteredArticles = articlesData.filter(article => {
    const matchesCategory = selectedCategory === 'All Categories' || article.category === selectedCategory;
    return matchesCategory;
  });

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (selectedSort) {
      case 'Oldest First':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'Most Popular':
        // For now, sort by title as a placeholder for popularity
        return a.title.localeCompare(b.title);
      case 'Most Recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = sortedArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="box-border content-stretch flex flex-col gap-16 items-center justify-start p-0 relative w-full">
      <div className="box-border content-stretch flex flex-col gap-20 items-center justify-start max-w-[1440px] pb-20 px-16 relative shrink-0 w-full">
        
        {/* Articles Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {currentArticles.map((article) => (
            <div key={article.id} className="flex flex-col">
              <BlogCard
                title={article.title}
                excerpt={article.excerpt}
                date={article.date}
                readTime={article.readTime}
                image={article.image}
                slug={article.slug}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}