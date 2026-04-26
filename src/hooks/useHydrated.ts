import { useEffect, useState } from 'react';

/**
 * Returns false on the first render (SSR + hydration), then true on client.
 * Use this to guard any component that reads from a Zustand `persist` store
 * to avoid SSR/client tree mismatch.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
