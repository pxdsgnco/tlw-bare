import HomeSearch from '@/components/homepage/HomeSearch';
import LatestStories from '@/components/homepage/LatestStories';
import FeaturedTrends from '@/components/homepage/FeaturedTrends';
import Nightlife from '@/components/homepage/Nightlife';
import UpcomingEvents from '@/components/homepage/UpcomingEvents';
import CuratedArticles from '@/components/homepage/CuratedArticles';
import CTA from '@/components/homepage/CTA';

export default function Home() {
  return (
    <div className="w-full">
      {/* Home Search Section */}
      <HomeSearch />
      
      {/* Latest Stories Section */}
      <LatestStories />
      
      {/* Featured Trends Section */}
      <FeaturedTrends />
      
      {/* Nightlife Section */}
      <Nightlife />
      
      {/* Upcoming Events Section */}
      <UpcomingEvents />
      
      {/* Curated Articles Section */}
      <CuratedArticles />
      
      {/* CTA Section */}
      <CTA />
    </div>
  );
}
