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

    // TODO: Once migration 012-subscriptions-system.sql is run, enable database queries
    const features = getFeaturesForPlan('free');
    
    return NextResponse.json({
      subscription: {
        id: 'default-free',
        userId: user.id,
        planId: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      features,
      isPro: false,
      isEnterprise: false,
      isFree: true,
    });
  } catch (error) {
    console.error('[v0] Error in subscriptions/me:', error);
    
    const features = getFeaturesForPlan('free');
    return NextResponse.json({
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
      features,
      isPro: false,
      isEnterprise: false,
      isFree: true,
    });
  }
}
