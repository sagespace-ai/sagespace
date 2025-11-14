export type SubscriptionPlanId = 'explorer' | 'voyager' | 'astral' | 'oracle' | 'celestial';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

export interface FeatureFlags {
  maxSagesUnlocked: number | 'all';
  rotatingSagesEnabled: boolean;
  rotatingSagesCount: number;
  councilMaxSagesPerSession: number;
  councilSessionsPerDay: number | 'unlimited';
  messagesPerDay: number | 'unlimited';
  memoryRetentionDays: number | 'full';
  maxArtifacts: number | 'unlimited';
  advancedInsights: boolean;
  customSagesEnabled: boolean;
  automationsEnabled: boolean;
  teamWorkspacesEnabled: boolean;
  apiAccessEnabled: boolean;
  whiteLabelEnabled: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanDetails {
  id: SubscriptionPlanId;
  name: string;
  headline: string;
  priceCents: number;
  interval: 'month' | 'year' | 'forever';
  blurb?: string;
  features: FeatureFlags;
}

export interface SubscriptionWithFeatures {
  subscription: UserSubscription;
  features: FeatureFlags;
  isExplorer: boolean;
  isVoyager: boolean;
  isAstral: boolean;
  isOracle: boolean;
  isCelestial: boolean;
}
