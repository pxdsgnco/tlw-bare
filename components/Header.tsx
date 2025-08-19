'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasAccess, UserRole } from '@/lib/auth';
import { ChevronDown, MapPin, Search, Bell } from 'lucide-react';
import { SearchModal } from '@/components/search/SearchModal';
import { useSearchModal } from '@/components/search/useSearchModal';
import type { Creator } from '@/components/search/SearchModal';

const logoImg = "http://localhost:3845/assets/0c18dc1e3edf0be8d6e78c6c601cfcb169710e54.png";
// const avatarImg = "http://localhost:3845/assets/f6788670d632683a8251e3354244a769cac57ac5.svg";

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    title: 'New Event Added',
    message: 'Check out the latest event in Lagos!',
    time: '2 minutes ago',
    read: false
  },
  {
    id: '2',
    title: 'Your Event is Live',
    message: 'Your event "Music Festival" has been published.',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    title: 'New Follower',
    message: 'Someone started following your events.',
    time: '3 hours ago',
    read: true
  }
];

interface LocationSelectorProps {
  location?: "Abuja" | "Lagos";
}

function LocationSelector({ location = "Lagos" }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start px-4 py-3 relative rounded-md cursor-pointer border border-[#dddddd]"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
        <div className="box-border content-stretch flex flex-row gap-[5px] items-center justify-start p-0 relative shrink-0">
          <MapPin className="w-5 h-5 text-[#50576b]" />
        </div>
        <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#50576b] text-[16px] text-left text-nowrap">
          <p className="block leading-[normal] whitespace-pre">{location}</p>
        </div>
      </div>
      <ChevronDown className="w-4 h-4 text-[#50576b]" />
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#dddddd] rounded-md shadow-lg z-10">
          <div className="p-2">
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsOpen(false)}>
              Lagos
            </div>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsOpen(false)}>
              Abuja
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-[12px] relative rounded-md shrink-0 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <Bell className="w-6 h-6 text-[#343434]" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#fb7102] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#dddddd] rounded-md shadow-lg z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-[16px] text-[#343434]">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[#fb7102] text-sm hover:underline font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        !notification.read ? 'bg-[#fb7102]' : 'bg-transparent'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[14px] text-[#343434] truncate">
                          {notification.title}
                        </h4>
                        <p className="text-[13px] text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[12px] text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <Link 
                  href="/notifications" 
                  className="block text-center text-[#fb7102] text-sm hover:underline font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function NavMenu() {
  const pathname = usePathname();
  const navigationItems = [
    { name: 'Events', path: '/events' },
    { name: 'Nightlife', path: '/nightlife' },
    { name: 'Blog', path: '/blog' },
    { name: 'Weekend Guide', path: '/weekend-guide' },
    { name: 'Community', path: '/community' }
  ];

  return (
    <nav className="box-border content-stretch flex flex-row items-center justify-start p-0 relative" role="navigation" aria-label="Main navigation">
      <ul className="flex flex-row items-center justify-start p-0 list-none m-0">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          const isActiveOrHover = isActive ? 'bg-[#FFF1E6] text-[#fb7102]' : 'bg-[#ffffff] text-[#343434] hover:bg-[#FFF1E6] hover:text-[#fb7102]';
          
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`${isActiveOrHover} box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-3 relative rounded-md shrink-0 transition-colors`}
              >
                <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.16px]">
                  <p className="block leading-[normal] whitespace-pre">{item.name}</p>
                </div>
                {item.name === 'Community' && (
                  <ChevronDown className={`w-4 h-4 ${isActive ? 'text-[#fb7102]' : 'text-[#343434]'}`} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface UserDropdownProps {
  user: { id: string; name: string; role: UserRole };
  setUserRole: (role: UserRole) => void;
}

function UserDropdown({ user, setUserRole }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const userPages = [
    { name: 'Dashboard', path: '/user/dashboard', minRole: 'Curator' as UserRole },
    { name: 'Profile', path: '/user/profile' },
    { name: 'Bookmarks', path: '/user/bookmarks' },
    { name: 'Settings', path: '/user/settings' },
    { name: 'My Events', path: '/user/events', minRole: 'Curator' as UserRole },
    { name: 'My Nightlife', path: '/user/nightlife', minRole: 'Curator' as UserRole },
    { name: 'My Blog', path: '/user/blog', minRole: 'Admin' as UserRole },
    { name: 'Pages', path: '/user/pages', minRole: 'Admin' as UserRole }
  ];

  const availableUserPages = userPages.filter(page => 
    hasAccess(user.role, page.path)
  );

  return (
    <div className="relative">
      <div
        className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative rounded-lg shrink-0 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start px-3 py-2 relative shrink-0">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 size-[52px]">
              <div className="relative shrink-0 size-11 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="font-medium text-[#8e8e8e] text-[16px]">
                  {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </span>
              </div>
            </div>
            <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left text-nowrap w-[140px]">
              <div className="flex flex-col font-semibold justify-center overflow-ellipsis overflow-hidden relative shrink-0 text-[#000000] text-[16px] w-full">
                <p className="block leading-[1.55] overflow-hidden text-ellipsis">
                  {user.name}
                </p>
              </div>
              <div className="font-normal overflow-ellipsis overflow-hidden relative shrink-0 text-[#999999] text-[13px] w-full">
                <p className="block leading-[1.6] overflow-hidden text-ellipsis">
                  {user.name.toLowerCase().replace(' ', '')}@example.com
                </p>
              </div>
            </div>
          </div>
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 size-6">
            <ChevronDown className="w-4 h-4 text-[#343434]" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-[#dddddd] rounded-md shadow-lg z-10">
          <div className="p-2">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="text-sm text-gray-500">Role: {user.role}</div>
              <select 
                value={user.role} 
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="mt-1 w-full bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm border"
              >
                <option value="Viewer">Viewer</option>
                <option value="Curator">Curator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {availableUserPages.map(page => (
              <Link
                key={page.path}
                href={page.path}
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {page.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { user, setUserRole } = useAuth();
  const isLoggedIn = user && user.name !== 'Demo User'; // Simple check for demo - change name in auth.ts to test logged-in state
  const { isOpen: isSearchOpen, openModal: openSearch, closeModal: closeSearch } = useSearchModal();

  // Handle creator selection from search
  const handleCreatorSelect = (creator: Creator) => {
    console.log('Selected creator:', creator);
    // Navigate to creator profile - you can implement this based on your routing structure
    // For now, we'll just show an alert
    alert(`Selected creator: ${creator.name}`);
    // Example navigation:
    // window.location.href = `/creator/${creator.id}`;
  };

  return (
    <header className="bg-[#ffffff] box-border content-stretch flex flex-col items-center justify-center p-0 relative w-full" role="banner">
      <div className="box-border content-stretch flex flex-row h-[100px] items-center justify-between max-w-[1440px] p-[32px] relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-row gap-8 items-center justify-start p-0 relative shrink-0">
          <div className="box-border content-stretch flex flex-row gap-8 items-center justify-start p-0 relative shrink-0">
            <Link href="/" className="h-16 shrink-0 w-[69.23px] relative">
              <Image 
                src={logoImg} 
                alt="Company Logo" 
                fill
                className="object-cover"
                priority
              />
            </Link>
            <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-4 items-center justify-start relative rounded-md shrink-0 w-[143px]">
              <LocationSelector />
            </div>
          </div>
          <NavMenu />
        </div>
        
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-end p-0 relative shrink-0">
          <button 
            className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-[12px] relative rounded-md shrink-0 cursor-pointer hover:bg-gray-50 transition-colors" 
            aria-label="Search"
            onClick={openSearch}
          >
            <Search className="w-6 h-6 text-[#343434]" />
          </button>
          
          {isLoggedIn && <NotificationsDropdown />}
          
          {isLoggedIn ? (
            <UserDropdown user={user} setUserRole={setUserRole} />
          ) : (
            <>
              <button className="box-border content-stretch flex flex-row gap-4 items-center justify-start px-5 py-3 relative rounded-md shrink-0 border border-[#dddddd] hover:bg-gray-50 transition-colors">
                <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#50576b] text-[16px] text-left text-nowrap">
                  <p className="block leading-[normal] whitespace-pre">Login</p>
                </div>
              </button>
              <button className="bg-[#fb7102] box-border content-stretch flex flex-row gap-4 items-center justify-start px-5 py-3 relative rounded-md shrink-0 border border-[#fb7102] hover:bg-[#e5650a] transition-colors">
                <div className="font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
                  <p className="block leading-[normal] whitespace-pre">Sign up</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onCreatorSelect={handleCreatorSelect}
        placeholder="Search for creators, content, or topics..."
      />
    </header>
  );
}