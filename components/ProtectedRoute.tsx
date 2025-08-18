'use client';

import { useAuth } from '@/contexts/AuthContext';
import { hasAccess } from '@/lib/auth';
import { usePathname } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!hasAccess(user.role, pathname)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-xl text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Your current role: <span className="font-semibold">{user.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}