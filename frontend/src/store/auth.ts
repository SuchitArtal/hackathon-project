import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUserName: (name) => set({ userName: name }),
      isAuthenticated: false,
      logout: () => set({ token: null, isAuthenticated: false, userName: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 