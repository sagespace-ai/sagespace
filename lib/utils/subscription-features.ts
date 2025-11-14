import type { SubscriptionPlanId, FeatureFlags } from '@/lib/types/subscription';

export function getFeaturesForPlan(planId: SubscriptionPlanId): FeatureFlags {
  switch (planId) {
    case 'explorer':
      // Free tier - Genesis basics
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
    
    case 'voyager':
      // $9/month - Solid personal use
      return {
        maxSagesUnlocked: 50, // 50 curated sages
        rotatingSagesEnabled: true,
        rotatingSagesCount: 10,
        councilMaxSagesPerSession: 4,
        councilSessionsPerDay: 10,
        messagesPerDay: 500,
        memoryRetentionDays: 30,
        maxArtifacts: 100,
        advancedInsights: true,
        customSagesEnabled: false,
        automationsEnabled: false,
        teamWorkspacesEnabled: false,
        apiAccessEnabled: false,
        whiteLabelEnabled: false,
      };
    
    case 'astral':
      // $19/month - Power user tier
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
    
    case 'oracle':
      // $49/month - Professional tier
      return {
        maxSagesUnlocked: 'all',
        rotatingSagesEnabled: false,
        rotatingSagesCount: 0,
        councilMaxSagesPerSession: 10,
        councilSessionsPerDay: 'unlimited',
        messagesPerDay: 'unlimited',
        memoryRetentionDays: 'full',
        maxArtifacts: 2000,
        advancedInsights: true,
        customSagesEnabled: true,
        automationsEnabled: true,
        teamWorkspacesEnabled: true,
        apiAccessEnabled: true,
        whiteLabelEnabled: false,
      };
    
    case 'celestial':
      // $99/month - Enterprise tier
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
      return getFeaturesForPlan('explorer');
  }
}

export const PLAN_DETAILS = {
  explorer: {
    id: 'explorer' as const,
    name: 'Genesis Explorer',
    headline: '$0 / forever',
    priceCents: 0,
    interval: 'forever' as const,
    blurb: 'Begin your cosmic journey with essential wisdom',
    stripePriceId: null,
  },
  voyager: {
    id: 'voyager' as const,
    name: 'Sage Voyager',
    headline: '$9 / month',
    priceCents: 900,
    interval: 'month' as const,
    blurb: 'Expand your horizons with deeper insights',
    stripePriceId: process.env.STRIPE_PRICE_VOYAGER || null,
  },
  astral: {
    id: 'astral' as const,
    name: 'Astral Navigator',
    headline: '$19 / month',
    priceCents: 1900,
    interval: 'month' as const,
    blurb: 'Navigate the full cosmos with unlimited access',
    stripePriceId: process.env.STRIPE_PRICE_ASTRAL || null,
  },
  oracle: {
    id: 'oracle' as const,
    name: 'Cosmic Oracle',
    headline: '$49 / month',
    priceCents: 4900,
    interval: 'month' as const,
    blurb: 'Harness divine wisdom for teams and professionals',
    stripePriceId: process.env.STRIPE_PRICE_ORACLE || null,
  },
  celestial: {
    id: 'celestial' as const,
    name: 'Celestial Architect',
    headline: '$99 / month',
    priceCents: 9900,
    interval: 'month' as const,
    blurb: 'Command the universe with enterprise power',
    stripePriceId: process.env.STRIPE_PRICE_CELESTIAL || null,
  },
} as const;
