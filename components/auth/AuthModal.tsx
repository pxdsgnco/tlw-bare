'use client';

import { useEffect } from 'react';
import { useAuthModal } from '@/hooks/useAuthModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ResetPasswordForm } from './ResetPasswordForm';

export function AuthModal() {
  const { isOpen, view, close } = useAuthModal();

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, close]);

  const getTitle = () => {
    switch (view) {
      case 'login':
        return 'Sign in to your account';
      case 'signup':
        return 'Create your account';
      case 'reset-password':
        return 'Reset your password';
      default:
        return '';
    }
  };

  const getSubtitle = () => {
    switch (view) {
      case 'login':
        return 'Welcome back! Please enter your details.';
      case 'signup':
        return 'Join The Lagos Weekender community';
      case 'reset-password':
        return 'No worries, we\'ll send you reset instructions.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {getTitle()}
            </DialogTitle>
            <p className="text-sm text-gray-600 text-center mt-2">
              {getSubtitle()}
            </p>
          </DialogHeader>
        </div>
        
        <div className="px-6 pb-6">
          {view === 'login' && <LoginForm />}
          {view === 'signup' && <SignupForm />}
          {view === 'reset-password' && <ResetPasswordForm />}
        </div>
      </DialogContent>
    </Dialog>
  );
}