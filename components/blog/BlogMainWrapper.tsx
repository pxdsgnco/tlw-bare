import BlogContent from './BlogContent';
import BlogDetailsSidebar from './BlogDetailsSidebar';

interface BlogMainWrapperProps {
  content: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
}

export default function BlogMainWrapper({ content, tags, author }: BlogMainWrapperProps) {
  return (
    <div className="box-border content-stretch flex flex-row items-start justify-center p-0 relative size-full">
      <div className="basis-0 box-border content-stretch flex flex-row gap-[60px] grow items-start justify-start max-w-[1440px] min-h-px min-w-px pb-16 pt-8 px-16 relative shrink-0">
        
        {/* Main Content */}
        <BlogContent
          content={content}
          tags={tags}
          author={author}
        />

        {/* Sidebar */}
        <BlogDetailsSidebar />
      </div>
    </div>
  );
}