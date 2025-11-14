import type { SubscriptionPlanId, FeatureFlags } from '@/lib/types/subscription';

export function getFeaturesForPlan(planId: SubscriptionPlanId): FeatureFlags {
  switch (planId) {
    case 'free':
      return {
        maxSagesUnlocked: 10, // Origin Sage + 9 rotating sages
        rotatingSagesEnabled: true,
        rotatingSagesCount: 3, // 3 rotating sages per week
        councilMaxSagesPerSession: 2,
        councilSessionsPerDay: 2,
        messagesPerDay: 75,
        memoryRetentionDays: 7,
        maxArtifacts: 20,
        advancedInsights: false,
        customSagesEnabled: false,
        automationsEnabled: false,
        teamWorkspacesEnabled: false,
        apiAccessEnabled: false,
        whiteLabelEnabled: false,
      };
    
    case 'pro':
      return {
        maxSagesUnlocked: 'all', // All 300+ sages
        rotatingSagesEnabled: false, // Not needed with all unlocked
        rotatingSagesCount: 0,
        councilMaxSagesPerSession: 6,
        councilSessionsPerDay: 'unlimited',
        messagesPerDay: 'unlimited',
        memoryRetentionDays: 'full',
        maxArtifacts: 500,
        advancedInsights: true,
        customSagesEnabled: true,
        automationsEnabled: true,
        teamWorkspacesEnabled: false,
        apiAccessEnabled: false,
        whiteLabelEnabled: false,
      };
    
    case 'enterprise':
      return {
        maxSagesUnlocked: 'all',
        rotatingSagesEnabled: false,
        rotatingSagesCount: 0,
        councilMaxSagesPerSession: 'unlimited' as any,
        councilSessionsPerDay: 'unlimited',
        messagesPerDay: 'unlimited',
        memoryRetentionDays: 'full',
        maxArtifacts: 'unlimited',
        advancedInsights: true,
        customSagesEnabled: true,
        automationsEnabled: true,
        teamWorkspacesEnabled: true,
        apiAccessEnabled: true,
        whiteLabelEnabled: true,
      };
    
    default:
      return getFeaturesForPlan('free');
  }
}

export const PLAN_DETAILS = {
  free: {
    id: 'free' as const,
    name: 'Genesis Explorer',
    headline: '$0 / forever',
    priceCents: 0,
    interval: 'forever' as const,
    blurb: 'Everything you need to start your journey',
  },
  pro: {
    id: 'pro' as const,
    name: 'Sage Voyager',
    headline: '$9 / month',
    priceCents: 900,
    interval: 'month' as const,
    blurb: 'For power users who live inside SageSpace',
  },
  enterprise: {
    id: 'enterprise' as const,
    name: 'Council Architect',
    headline: '$49 / month',
    priceCents: 4900,
    interval: 'month' as const,
    blurb: 'For teams, firms, and white-label deployments',
  },
} as const;
