import { create } from 'zustand';

export type AuthModalView = 'login' | 'signup' | 'reset-password';

interface AuthModalStore {
  isOpen: boolean;
  view: AuthModalView;
  redirectPath?: string;
  openLogin: (redirectPath?: string) => void;
  openSignup: (redirectPath?: string) => void;
  openResetPassword: () => void;
  switchView: (view: AuthModalView) => void;
  close: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  view: 'login',
  redirectPath: undefined,
  
  openLogin: (redirectPath) => set({ 
    isOpen: true, 
    view: 'login',
    redirectPath 
  }),
  
  openSignup: (redirectPath) => set({ 
    isOpen: true, 
    view: 'signup',
    redirectPath 
  }),
  
  openResetPassword: () => set({ 
    isOpen: true, 
    view: 'reset-password' 
  }),
  
  switchView: (view) => set({ view }),
  
  close: () => set({ 
    isOpen: false, 
    redirectPath: undefined 
  }),
}));