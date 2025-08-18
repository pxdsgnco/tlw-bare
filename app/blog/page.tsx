'use client';

import { useState } from 'react';
import BlogTopSection from '@/components/blog/BlogTopSection';
import BlogFilterSection from '@/components/blog/BlogFilterSection';
import BlogMainSection from '@/components/blog/BlogMainSection';


interface FeaturedArticleData {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  badge?: string;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSort, setSelectedSort] = useState('Most Recent');
  const [selectedShow, setSelectedShow] = useState('9');


  // Featured article data - this would typically come from an API
  const featuredArticle: FeaturedArticleData = {
    id: 'featured-1',
    title: 'Events in Lagos This Weekend: 4th – 6th July, 2025',
    excerpt: 'July came in with party shoes. This weekend alone, we\'ve clocked raves, night parties, and beachside madness.',
    date: 'Jul 03, 2025',
    readTime: '5',
    image: 'http://localhost:3845/assets/1f40c297638b1160833c9cb8127ebeec28e9f965.png',
    badge: 'Featured'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Section - Page Title and Featured Article */}
      <BlogTopSection 
        featuredArticle={featuredArticle}
      />
      
      {/* Filter Section */}
      <BlogFilterSection
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        selectedShow={selectedShow}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSelectedSort}
        onShowChange={setSelectedShow}
      />
      
      {/* Main Section - Content Grid */}
      <BlogMainSection 
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        articlesPerPage={parseInt(selectedShow)}
      />
    </div>
  );
}