export type UserRole = 'Viewer' | 'Curator' | 'Admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export const rolePermissions = {
  Viewer: [
    '/',
    '/events',
    '/nightlife',
    '/blog',
    '/community',
    '/weekend-guide',
    '/user/profile',
    '/user/bookmarks',
    '/user/settings'
  ],
  Curator: [
    '/',
    '/events',
    '/nightlife',
    '/blog',
    '/community',
    '/weekend-guide',
    '/user/dashboard',
    '/user/profile',
    '/user/bookmarks',
    '/user/settings',
    '/user/events',
    '/user/nightlife'
  ],
  Admin: [
    '/',
    '/events',
    '/nightlife',
    '/blog',
    '/community',
    '/weekend-guide',
    '/user/dashboard',
    '/user/profile',
    '/user/bookmarks',
    '/user/settings',
    '/user/events',
    '/user/nightlife',
    '/user/stories',
    '/user/blog',
    '/user/pages',
    '/user/admin/featured-events'
  ]
};

export function hasAccess(userRole: UserRole | undefined, path: string): boolean {
  if (!userRole) return false;
  return rolePermissions[userRole].includes(path);
}