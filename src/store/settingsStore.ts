import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/axios';

interface SettingsState {
  settings: {
    businessName: string;
    contactPhone?: string;
    contactEmail?: string;
    insideChittagong: number;
    outsideChittagong: number;
    logoUrl?: string;
  };
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: any) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        businessName: 'NovaCart',
        insideChittagong: 60,
        outsideChittagong: 120,
      },
      loading: false,
      fetchSettings: async () => {
        set({ loading: true });
        try {
          const res = await api.get('/settings');
          if (res.data) set({ settings: res.data });
        } catch (err) {
          console.error('Failed to fetch settings:', err);
        } finally {
          set({ loading: false });
        }
      },
      updateSettings: (newSettings) => set({ settings: newSettings }),
    }),
    {
      name: 'novacart-settings',
    }
  )
);
