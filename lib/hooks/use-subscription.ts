'use client'

import { useState, useEffect } from 'react';
import type { SubscriptionWithFeatures } from '@/lib/types/subscription';

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
        console.log('[v0] Subscription API returned error, using default free plan');
      }
      
      const subscriptionData = await res.json();
      setData(subscriptionData);
      setError(null);
    } catch (err) {
      console.log('[v0] Error loading subscription, using default free plan:', err);
      const defaultSub: SubscriptionWithFeatures = {
        subscription: {
          id: 'default-free',
          userId: 'unknown',
          planId: 'free',
          status: 'active',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        features: {
          maxSages: 1,
          maxConversations: 10,
          maxMessages: 100,
          hasCouncil: false,
          hasMemory: false,
          hasPersonaEditor: false,
          hasMultiverse: false,
          hasMarketplace: false,
          hasTeamFeatures: false,
          hasPrioritySupport: false,
          hasAdvancedAnalytics: false,
        },
        isPro: false,
        isEnterprise: false,
        isFree: true,
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
    isPro: data?.isPro ?? false,
    isEnterprise: data?.isEnterprise ?? false,
    isFree: data?.isFree ?? true,
    isLoading,
    error,
    changePlan,
    refetch: loadSubscription,
  };
}
