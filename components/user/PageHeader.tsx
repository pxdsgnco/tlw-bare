interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic p-0 relative text-left w-full">
        <h1 className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000] text-[32px] tracking-[-0.96px] w-full">
          <p className="block leading-[1.35]">{title}</p>
        </h1>
        <p className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center relative shrink-0 text-[16px] text-gray-500 w-full">
          {subtitle}
        </p>
      </div>
    </div>
  );
}