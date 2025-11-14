import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { XP_PACKS, SAGEPOINTS_PACKS } from '@/config/store-items';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, itemType } = await request.json();

    const allItems = [...XP_PACKS, ...SAGEPOINTS_PACKS];
    const item = allItems.find(i => i.id === itemId);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const finalValue = item.bonus 
      ? Math.floor(item.value * (1 + item.bonus / 100))
      : item.value;

    const { error: purchaseError } = await supabase.from('purchases').insert({
      user_id: user.id,
      type: item.type,
      sku: item.id,
      amount_cents: item.priceCents,
      currency: 'usd',
      meta: {
        item_name: item.name,
        base_value: item.value,
        bonus: item.bonus || 0,
        final_value: finalValue,
      },
    });

    if (purchaseError) throw purchaseError;

    if (item.type === 'XP_PACK') {
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('xp')
        .eq('user_id', user.id)
        .maybeSingle();

      const currentXP = progress?.xp || 0;
      const newXP = currentXP + finalValue;

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          xp: newXP,
          updated_at: new Date().toISOString(),
        });

      return NextResponse.json({
        success: true,
        type: 'xp',
        added: finalValue,
        newTotal: newXP,
      });
    }

    if (item.type === 'SAGEPOINTS_PACK') {
      const { data: sub, error: subError } = await supabase
        .from('user_subscriptions')
        .select('sage_points')
        .eq('user_id', user.id)
        .maybeSingle();

      const currentPoints = sub?.sage_points || 0;
      const newPoints = currentPoints + finalValue;

      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          sage_points: newPoints,
          updated_at: new Date().toISOString(),
        });

      return NextResponse.json({
        success: true,
        type: 'sagepoints',
        added: finalValue,
        newTotal: newPoints,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Error processing purchase:', error);
    return NextResponse.json({ error: 'Failed to process purchase' }, { status: 500 });
  }
}
