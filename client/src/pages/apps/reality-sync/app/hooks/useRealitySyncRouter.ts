import { useState, useCallback } from 'react';

export type RealitySyncRoute =
  | { view: 'onboarding' }
  | { view: 'vault-list' }
  | { view: 'vault-dashboard'; vaultId: string }
  | { view: 'capture'; vaultId: string }
  | { view: 'assets'; vaultId: string }
  | { view: 'exports'; vaultId: string }
  | { view: 'settings' };

export interface RealitySyncRouter {
  currentRoute: RealitySyncRoute;
  navigate: (route: RealitySyncRoute) => void;
  goBack: () => void;
  canGoBack: boolean;
  history: RealitySyncRoute[];
}

export function useRealitySyncRouter(
  initialRoute: RealitySyncRoute = { view: 'onboarding' }
): RealitySyncRouter {
  const [history, setHistory] = useState<RealitySyncRoute[]>([initialRoute]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useCallback((route: RealitySyncRoute) => {
    setHistory(prev => [...prev.slice(0, currentIndex + 1), route]);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  return {
    currentRoute: history[currentIndex],
    navigate,
    goBack,
    canGoBack: currentIndex > 0,
    history,
  };
}
