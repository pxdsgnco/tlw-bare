'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasAccess } from '@/lib/auth';
import { 
  LayoutDashboard, 
  User, 
  Bookmark, 
  Ticket, 
  Landmark, 
  Settings,
  ChevronRight 
} from 'lucide-react';

interface SidebarNavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  minRole?: string;
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    name: 'Dashboard',
    path: '/user/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Account Details', 
    path: '/user/profile',
    icon: User,
  },
  {
    name: 'Bookmarks',
    path: '/user/bookmarks', 
    icon: Bookmark,
  },
  {
    name: 'Events',
    path: '/user/events',
    icon: Ticket,
    minRole: 'Curator',
  },
  {
    name: 'Nightlife Spots',
    path: '/user/nightlife',
    icon: Landmark,
    minRole: 'Curator',
  },
  {
    name: 'Preferences',
    path: '/user/settings',
    icon: Settings,
  },
];

function Breadcrumbs() {
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

  return (
    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-0 py-2 relative shrink-0 w-full">
      {breadcrumbItems.map((item, index) => (
        <div key={item.path} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-[#525866]" />
          )}
          <Link
            href={item.path}
            className={`font-['BDO_Grotesk'] text-[14px] leading-[20px] text-left text-nowrap ${
              index === breadcrumbItems.length - 1
                ? 'text-[#697289] font-normal'
                : 'text-[#525866] font-semibold hover:text-[#fb7102] transition-colors'
            }`}
          >
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const availableNavItems = sidebarNavItems.filter(item => 
    !item.minRole || (user && hasAccess(user.role, item.path))
  );

  // Icon assets from Figma
  const iconAssets: Record<string, string> = {
    Dashboard: "http://localhost:3845/assets/3eea96cb8facd83a539a4e5aa3964cfe1d810c16.svg",
    'Account Details': "http://localhost:3845/assets/3ad2b9e3e637108ae5eb9dcacfeb8710d640eee5.svg",
    Bookmarks: "http://localhost:3845/assets/5d14d7c90f0339449683b49a1e2e68431dddf202.svg",
    Events: "http://localhost:3845/assets/b5e98efd130551f8c83e17bfa77ff547b18c5053.svg",
    'Nightlife Spots': "http://localhost:3845/assets/ba641c0c62768d1e4bd5a2014e49ef5b00180f43.svg",
    Preferences: "http://localhost:3845/assets/7a4d02080d3cf80131b2d85fc3db48bfe8232e2d.svg"
  };

  const lineAsset = "http://localhost:3845/assets/bc2beaf28c7b8ea56246aac5d78ae9300c103c14.svg";

  return (
    <aside className="bg-[#ffffff] box-border content-stretch flex flex-col gap-8 items-start justify-start max-w-[280px] p-[16px] relative rounded-md shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[#d9dfe8] border-solid inset-[-1px] pointer-events-none rounded-[7px]"
      />
      <nav className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative w-full">
          {availableNavItems.map((item, index) => {
            const isActive = pathname === item.path;
            const showDivider = index === availableNavItems.length - 2 && availableNavItems[availableNavItems.length - 1]?.name === 'Preferences';
            
            return (
              <div key={item.path}>
                {showDivider && (
                  <div className="h-0 relative shrink-0 w-full" style={{ marginBottom: '4px' }}>
                    <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                      <Image alt="" className="block max-w-none size-full" src={lineAsset} width={248} height={1} />
                    </div>
                  </div>
                )}
                
                {isActive ? (
                  <div className="bg-[rgba(251,113,2,0.1)] relative shrink-0 w-full">
                    <div
                      aria-hidden="true"
                      className="absolute border-[#fb7102] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
                    />
                    <Link href={item.path}>
                      <div className="bg-clip-padding border-[0px_0px_0px_2px] border-[transparent] border-solid box-border content-stretch flex flex-row gap-3 items-center justify-start px-4 py-2.5 relative w-full">
                        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0">
                          <div className="relative shrink-0 size-5">
                            <Image
                              alt=""
                              className="block max-w-none size-full"
                              src={iconAssets[item.name]}
                              width={20}
                              height={20}
                            />
                          </div>
                        </div>
                        <div className="basis-0 font-['Inter:Semi_Bold',_sans-serif] font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#fb7102] text-[15px] text-left">
                          <p className="block leading-[1.6]">{item.name}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="relative shrink-0 w-full hover:bg-gray-50 transition-colors">
                    <Link href={item.path}>
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-2 items-center justify-start p-[12px] relative w-full">
                        <div className={`box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 ${
                          item.name === 'Dashboard' ? 'gap-[6.667px]' : 
                          item.name === 'Bookmarks' ? 'gap-[5.333px]' : 
                          'gap-[6.667px]'
                        }`}>
                          <div className="relative shrink-0 size-5">
                            <Image
                              alt=""
                              className="block max-w-none size-full"
                              src={iconAssets[item.name]}
                              width={20}
                              height={20}
                            />
                          </div>
                        </div>
                        <div className={`basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-gray-500 text-left ${
                          item.name === 'Nightlife Spots' ? 'text-[16px]' : 'text-[15px]'
                        }`}>
                          <p className="block leading-[1.6]">{item.name}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col items-start justify-start p-0 relative min-h-screen w-full">
      {/* Main content area */}
      <div className="box-border content-stretch flex flex-col gap-5 items-center justify-start max-w-[1440px] min-h-[836px] px-8 py-10 relative shrink-0 w-full mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Two-column layout: Sidebar + Content */}
        <div className="box-border content-stretch flex flex-row gap-14 items-start justify-start p-0 relative shrink-0 w-full">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content area */}
          <div className="basis-0 bg-[#ffffff] box-border content-stretch flex flex-col gap-10 grow items-start justify-start min-h-px min-w-px p-0 relative rounded-md shrink-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}