import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    email: string;
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (username: string, password: string) => {
        // Hardcoded credentials for demo
        if (username === 'admin' && password === 'admin123') {
          set({
            isAuthenticated: true,
            user: {
              username: 'Admin Warung',
              email: 'admin@kasirwarung.id'
            }
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null
        });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);