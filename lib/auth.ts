export type UserRole = 'Viewer' | 'Curator' | 'Admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export const mockUser: User = {
  id: '1',
  name: 'Anderson Enegbuma',
  role: 'Admin' // Change this to test different roles
};

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
    '/user/profile',
    '/user/bookmarks',
    '/user/settings',
    '/user/events',
    '/user/nightlife',
    '/user/blog',
    '/user/pages'
  ]
};

export function hasAccess(userRole: UserRole, path: string): boolean {
  return rolePermissions[userRole].includes(path);
}