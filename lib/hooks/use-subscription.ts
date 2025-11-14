'use client'

import { useState, useEffect } from 'react';
import type { SubscriptionWithFeatures } from '@/lib/types/subscription';
import { getFeaturesForPlan } from '@/lib/utils/subscription-features';

export function useSubscription() {
  const [data, setData] = useState<SubscriptionWithFeatures | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/subscriptions/me');
      
      if (!res.ok) {
        console.log('[v0] Subscription API returned error, using default explorer plan');
      }
      
      const subscriptionData = await res.json();
      setData(subscriptionData);
      setError(null);
    } catch (err) {
      console.log('[v0] Error loading subscription, using default explorer plan:', err);
      const defaultSub: SubscriptionWithFeatures = {
        subscription: {
          id: 'default-explorer',
          userId: 'unknown',
          planId: 'explorer',
          status: 'active',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        features: getFeaturesForPlan('explorer'),
        isExplorer: true,
        isVoyager: false,
        isAstral: false,
        isOracle: false,
        isCelestial: false,
      };
      setData(defaultSub);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function changePlan(planId: string) {
    try {
      const res = await fetch('/api/subscriptions/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to change plan');
      }
      
      await loadSubscription();
      return true;
    } catch (err) {
      console.error('[v0] Error changing plan:', err);
      return false;
    }
  }

  return {
    subscription: data?.subscription,
    features: data?.features,
    isExplorer: data?.isExplorer ?? true,
    isVoyager: data?.isVoyager ?? false,
    isAstral: data?.isAstral ?? false,
    isOracle: data?.isOracle ?? false,
    isCelestial: data?.isCelestial ?? false,
    isLoading,
    error,
    changePlan,
    refetch: loadSubscription,
  };
}
