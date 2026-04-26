import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'Employee';
}

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => {
        set({ user, token });
        if (typeof window !== 'undefined') localStorage.setItem('token', token);
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') localStorage.removeItem('token');
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'admin-auth' }
  )
);
