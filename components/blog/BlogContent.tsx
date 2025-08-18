const imgAuthorAvatar = "http://localhost:3845/assets/774d08f3793ed7c4cbd8d6c425263d9aaf4b94e5.png";

interface BlogContentProps {
  content: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
}

export default function BlogContent({ content, tags, author }: BlogContentProps) {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[60px] grow h-auto items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
      
      {/* Article Content */}
      <div className="box-border content-stretch flex flex-col h-auto items-start justify-start p-0 relative shrink-0 w-full">
        <div 
          className="font-['Inter:Regular',_sans-serif] font-normal leading-[28px] not-italic relative shrink-0 text-[#50576b] text-[16px] text-left tracking-[-0.32px] w-full"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Tags */}
      <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full">
        <div className="font-['Brockmann:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#13151a] text-[20px] text-left tracking-[-0.4px] w-full">
          <p className="block leading-[1.45]">Tags</p>
        </div>
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full flex-wrap">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-1.5 relative rounded-2xl shrink-0 border border-[#d9dfe8] border-solid"
            >
              <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#50576b] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">#{tag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Author Card */}
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-[32px] relative rounded-md shrink-0 w-full border border-[#d9dfe8] border-solid">
        <div
          className="bg-[#e6e6e6] bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] rounded shrink-0 size-[88px]"
          style={{ backgroundImage: `url('${author.avatar || imgAuthorAvatar}')` }}
        />
        <div className="basis-0 box-border content-stretch flex flex-col gap-[9px] grow items-start justify-start leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left">
          <div className="font-['Brockmann:Medium',_sans-serif] relative shrink-0 text-[#13151a] text-[20px] tracking-[-0.4px] w-full">
            <p className="block leading-[1.45]">About the author</p>
          </div>
          <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#50576b] text-[14px] w-full">
            <p className="block leading-[1.55]">{author.bio}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .adjustLetterSpacing {
          letter-spacing: inherit;
        }
      `}</style>
    </div>
  );
}