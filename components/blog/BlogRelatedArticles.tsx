import BlogCard from './BlogCard';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

interface BlogRelatedArticlesProps {
  articles: Article[];
}

export default function BlogRelatedArticles({ articles }: BlogRelatedArticlesProps) {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative size-full">
      <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start max-w-[1440px] p-[64px] relative shrink-0 w-full">
        
        {/* Section Title */}
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#13151a] text-[32px] text-left tracking-[-0.32px] w-full">
          <p className="block leading-[1.2]">Related articles</p>
        </div>

        {/* Articles Grid */}
        <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          {articles.slice(0, 3).map((article) => (
            <div key={article.id} className="flex-1 min-w-0">
              <div className="[&>div]:!w-full">
                <BlogCard
                  title={article.title}
                  excerpt={article.excerpt}
                  date={article.date}
                  readTime={article.readTime}
                  image={article.image}
                  slug={article.slug}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}