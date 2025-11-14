import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getFeaturesForPlan } from '@/lib/utils/subscription-features';

export async function GET() {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // If no subscription exists, create default explorer (free) plan
    if (!subscription) {
      const { data: newSub, error: createError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: 'explorer',
          status: 'active',
        })
        .select()
        .single();

      if (createError) {
        console.error('[v0] Error creating subscription:', createError);
        // Fallback to default
        const features = getFeaturesForPlan('explorer');
        return NextResponse.json({
          subscription: {
            id: 'default-explorer',
            userId: user.id,
            planId: 'explorer',
            status: 'active',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            credits: 0,
          },
          features,
          isExplorer: true,
          isVoyager: false,
          isAstral: false,
          isOracle: false,
          isCelestial: false,
        });
      }

      const planId = newSub.plan_id;
      const features = getFeaturesForPlan(planId);
      
      return NextResponse.json({
        subscription: {
          id: newSub.id,
          userId: newSub.user_id,
          planId: newSub.plan_id,
          status: newSub.status,
          currentPeriodEnd: newSub.current_period_end,
          cancelAtPeriodEnd: newSub.cancel_at_period_end,
          createdAt: newSub.created_at,
          updatedAt: newSub.updated_at,
          credits: newSub.credits || 0,
        },
        features,
        isExplorer: planId === 'explorer',
        isVoyager: planId === 'voyager',
        isAstral: planId === 'astral',
        isOracle: planId === 'oracle',
        isCelestial: planId === 'celestial',
      });
    }

    const planId = subscription.plan_id;
    const features = getFeaturesForPlan(planId);
    
    return NextResponse.json({
      subscription: {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        createdAt: subscription.created_at,
        updatedAt: subscription.updated_at,
        credits: subscription.credits || 0,
      },
      features,
      isExplorer: planId === 'explorer',
      isVoyager: planId === 'voyager',
      isAstral: planId === 'astral',
      isOracle: planId === 'oracle',
      isCelestial: planId === 'celestial',
    });
  } catch (error) {
    console.error('[v0] Error in subscriptions/me:', error);
    
    const features = getFeaturesForPlan('explorer');
    return NextResponse.json({
      subscription: {
        id: 'default-explorer',
        userId: 'unknown',
        planId: 'explorer',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        credits: 0,
      },
      features,
      isExplorer: true,
      isVoyager: false,
      isAstral: false,
      isOracle: false,
      isCelestial: false,
    });
  }
}
