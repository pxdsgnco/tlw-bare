'use client';

import { useState } from 'react';
import BlogTopSection from '@/components/blog/BlogTopSection';
import BlogFilterSection from '@/components/blog/BlogFilterSection';
import BlogMainSection from '@/components/blog/BlogMainSection';



export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSort, setSelectedSort] = useState('Most Recent');
  const [selectedShow, setSelectedShow] = useState('9');


  // BlogTopSection will use its default featured article content

  return (
    <div className="min-h-screen bg-white">
      {/* Top Section - Page Title and Featured Article */}
      <BlogTopSection />
      
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