import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { themeId } = await request.json();

    // Check if theme exists
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single();

    if (themeError || !theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    // Check if user already owns it
    const { data: existing } = await supabase
      .from('user_themes')
      .select('*')
      .eq('user_id', user.id)
      .eq('theme_id', themeId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Theme already owned' }, { status: 400 });
    }

    // For now, just grant the theme (Stripe integration coming)
    const { error: purchaseError } = await supabase
      .from('user_themes')
      .insert({
        user_id: user.id,
        theme_id: themeId,
      });

    if (purchaseError) throw purchaseError;

    // Record purchase
    await supabase.from('purchases').insert({
      user_id: user.id,
      type: 'COSMETIC',
      sku: `theme_${themeId}`,
      amount_cents: theme.price_cents,
      currency: 'usd',
      meta: { theme_name: theme.name },
    });

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error('[v0] Error purchasing theme:', error);
    return NextResponse.json({ error: 'Failed to purchase theme' }, { status: 500 });
  }
}
