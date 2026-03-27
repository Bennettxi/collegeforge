'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { SubscriptionData, SubscriptionTier, GatedFeature, FEATURE_LIMITS } from '@/types/subscription';

const STORAGE_KEY = 'collegesprout_subscription';

const defaultSubscription: SubscriptionData = {
  tier: 'sprout',
  activatedAt: null,
};

type LimitKey = keyof typeof FEATURE_LIMITS.sprout;

interface SubscriptionContextValue {
  subscription: SubscriptionData;
  tier: SubscriptionTier;
  isPremium: boolean;
  canAccess: (feature: GatedFeature) => boolean;
  getLimit: (key: LimitKey) => number;
  upgradeToPremium: () => void;
  downgradeToFree: () => void;
  isLoaded: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function loadSubscription(): SubscriptionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSubscription;
    const parsed = JSON.parse(raw);
    return {
      tier: parsed.tier === 'mighty_oak' ? 'mighty_oak' : 'sprout',
      activatedAt: parsed.activatedAt ?? null,
      stripeCustomerId: parsed.stripeCustomerId,
      stripeSubscriptionId: parsed.stripeSubscriptionId,
    };
  } catch {
    return defaultSubscription;
  }
}

function saveSubscription(data: SubscriptionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionData>(defaultSubscription);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isInitialLoad = useRef(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadSubscription();
    setSubscription(saved);
    setIsLoaded(true);
    isInitialLoad.current = false;
  }, []);

  // Save to localStorage on changes (debounced)
  useEffect(() => {
    if (!isLoaded || isInitialLoad.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveSubscription(subscription);
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [subscription, isLoaded]);

  const tier = subscription.tier;
  const isPremium = tier === 'mighty_oak';

  const canAccess = useCallback((feature: GatedFeature): boolean => {
    if (tier === 'mighty_oak') return true;
    // All gated features are premium-only for sprout tier
    return false;
  }, [tier]);

  const getLimit = useCallback((key: LimitKey): number => {
    return FEATURE_LIMITS[tier][key];
  }, [tier]);

  const upgradeToPremium = useCallback(() => {
    setSubscription(prev => ({
      ...prev,
      tier: 'mighty_oak',
      activatedAt: new Date().toISOString(),
    }));
  }, []);

  const downgradeToFree = useCallback(() => {
    setSubscription(prev => ({
      ...prev,
      tier: 'sprout',
      activatedAt: null,
    }));
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      tier,
      isPremium,
      canAccess,
      getLimit,
      upgradeToPremium,
      downgradeToFree,
      isLoaded,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
