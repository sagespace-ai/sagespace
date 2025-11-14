import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getFeaturesForPlan, PLAN_DETAILS } from '@/lib/utils/subscription-features';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId || !['free', 'pro', 'enterprise'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    // Get current subscription
    const { data: currentSub } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const currentPlanId = currentSub?.plan_id || 'free';
    const currentFeatures = getFeaturesForPlan(currentPlanId);
    const newFeatures = getFeaturesForPlan(planId);
    const planDetails = PLAN_DETAILS[planId as keyof typeof PLAN_DETAILS];

    // Calculate feature differences
    const featureDiffs = {
      sages: {
        current: currentFeatures.maxSagesUnlocked,
        new: newFeatures.maxSagesUnlocked,
      },
      messages: {
        current: currentFeatures.messagesPerDay,
        new: newFeatures.messagesPerDay,
      },
      council: {
        current: currentFeatures.councilMaxSagesPerSession,
        new: newFeatures.councilMaxSagesPerSession,
      },
      memory: {
        current: currentFeatures.memoryRetentionDays,
        new: newFeatures.memoryRetentionDays,
      },
      insights: {
        current: currentFeatures.advancedInsights,
        new: newFeatures.advancedInsights,
      },
    };

    return NextResponse.json({
      currentPlan: {
        id: currentPlanId,
        name: PLAN_DETAILS[currentPlanId as keyof typeof PLAN_DETAILS].name,
      },
      targetPlan: {
        ...planDetails,
        features: newFeatures,
      },
      featureDiffs,
      isUpgrade: planId === 'pro' || (planId === 'enterprise' && currentPlanId !== 'enterprise'),
      isDowngrade: (planId === 'free' && currentPlanId !== 'free') || (planId === 'pro' && currentPlanId === 'enterprise'),
    });
  } catch (error) {
    console.error('[v0] Error in subscriptions/preview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
