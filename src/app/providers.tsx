'use client';
import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { fetchSettings, settings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings.businessName) {
      document.title = `${settings.businessName} | Premium Lifestyle Marketplace`;
    }
  }, [settings.businessName]);

  return <>{children}</>;
}
