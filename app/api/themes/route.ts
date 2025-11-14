import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get all themes
    const { data: themes, error } = await supabase
      .from('themes')
      .select('*')
      .order('price_cents', { ascending: true });

    if (error) throw error;

    // If user is logged in, get their owned themes
    if (user) {
      const { data: userThemes } = await supabase
        .from('user_themes')
        .select('theme_id')
        .eq('user_id', user.id);

      const ownedThemeIds = new Set(userThemes?.map(ut => ut.theme_id) || []);

      return NextResponse.json({
        themes: themes.map(theme => ({
          ...theme,
          owned: ownedThemeIds.has(theme.id) || !theme.is_premium,
        })),
      });
    }

    return NextResponse.json({
      themes: themes.map(theme => ({
        ...theme,
        owned: !theme.is_premium,
      })),
    });
  } catch (error) {
    console.error('[v0] Error fetching themes:', error);
    return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
  }
}
