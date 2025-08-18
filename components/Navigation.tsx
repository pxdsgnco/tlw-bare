'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { hasAccess, UserRole } from '@/lib/auth';

const publicPages = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Nightlife', path: '/nightlife' },
  { name: 'Blog', path: '/blog' },
  { name: 'Community', path: '/community' },
  { name: 'Weekend Guide', path: '/weekend-guide' }
];

const userPages = [
  { name: 'Profile', path: '/user/profile' },
  { name: 'Bookmarks', path: '/user/bookmarks' },
  { name: 'Settings', path: '/user/settings' },
  { name: 'My Events', path: '/user/events', minRole: 'Curator' as UserRole },
  { name: 'My Nightlife', path: '/user/nightlife', minRole: 'Curator' as UserRole },
  { name: 'My Blog', path: '/user/blog', minRole: 'Admin' as UserRole },
  { name: 'Pages', path: '/user/pages', minRole: 'Admin' as UserRole }
];

export default function Navigation() {
  const { user, setUserRole } = useAuth();

  const availableUserPages = userPages.filter(page => 
    hasAccess(user.role, page.path)
  );

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="flex space-x-4">
              {publicPages.map(page => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="hover:bg-gray-700 px-3 py-2 rounded"
                >
                  {page.name}
                </Link>
              ))}
            </div>
            
            <div className="border-l border-gray-600 pl-4 ml-4">
              <div className="relative group">
                <button className="hover:bg-gray-700 px-3 py-2 rounded">
                  User Menu
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {availableUserPages.map(page => (
                    <Link
                      key={page.path}
                      href={page.path}
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Role: {user.role}</span>
            <select 
              value={user.role} 
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
            >
              <option value="Viewer">Viewer</option>
              <option value="Curator">Curator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}