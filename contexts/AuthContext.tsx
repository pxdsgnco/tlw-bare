'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, mockUser } from '@/lib/auth';

interface AuthContextType {
  user: User;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);

  const setUserRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  return (
    <AuthContext.Provider value={{ user, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}