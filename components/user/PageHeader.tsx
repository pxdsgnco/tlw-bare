'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBreadcrumbs?: boolean;
  className?: string;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  showBreadcrumbs = true, 
  className = '' 
}: PageHeaderProps) {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    ...pathSegments.slice(1).map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
      path: '/' + pathSegments.slice(0, index + 2).join('/'),
    })),
  ];

  // Use provided title for the last breadcrumb item
  if (title && breadcrumbItems.length > 0) {
    breadcrumbItems[breadcrumbItems.length - 1].name = title;
  }

  return (
    <header className={`box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full ${className}`}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <nav aria-label="Breadcrumb" className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-0 py-0 relative shrink-0 w-full">
          <ol className="flex items-center gap-2 list-none p-0 m-0">
            {breadcrumbItems.map((item, index) => (
              <li key={item.path} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-[#525866] shrink-0" aria-hidden="true" />
                )}
                <Link
                  href={item.path}
                  className={`font-['BDO_Grotesk'] text-[14px] leading-[20px] text-left text-nowrap transition-colors ${
                    index === breadcrumbItems.length - 1
                      ? 'text-[#697289] font-normal cursor-default pointer-events-none'
                      : 'text-[#525866] font-semibold hover:text-[#fb7102]'
                  }`}
                  {...(index === breadcrumbItems.length - 1 && { 'aria-current': 'page' })}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Page Title and Subtitle */}
      <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full">
        <h1 className="font-['Inter:Medium',_sans-serif] font-medium text-[#000000] text-[32px] leading-[43px] tracking-[-0.96px] m-0 w-full">
          {title}
        </h1>
        {subtitle && (
          <p className="font-['Inter:Regular',_sans-serif] font-normal text-[16px] leading-[24px] text-[#697289] m-0 w-full">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}