-- Create themes and cosmetics system for monetization
-- Themes table for storing available cosmetic themes
CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tier TEXT, -- minimum tier required (null = free for all)
  is_premium BOOLEAN DEFAULT false,
  price_cents INTEGER DEFAULT 0,
  config JSONB NOT NULL, -- colors, gradients, logo variant
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK (tier IS NULL OR tier IN ('explorer', 'voyager', 'astral', 'oracle', 'celestial'))
);

-- Enable RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Anyone can view themes
CREATE POLICY "Anyone can view themes"
  ON themes FOR SELECT
  USING (true);

-- User theme ownership tracking
CREATE TABLE IF NOT EXISTS user_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, theme_id)
);

-- Enable RLS
ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own themes"
  ON user_themes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase themes"
  ON user_themes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add current_theme_id to user_progress if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_progress' 
                 AND column_name = 'current_theme_id') THEN
    ALTER TABLE user_progress ADD COLUMN current_theme_id TEXT REFERENCES themes(id);
  END IF;
END $$;

-- Insert default free themes
INSERT INTO themes (id, name, description, tier, is_premium, price_cents, config) VALUES
  ('default_cosmic', 'Cosmic Night', 'The classic SageSpace experience with deep cosmic vibes', NULL, false, 0, '{
    "background": "from-slate-950 via-purple-950 to-slate-900",
    "text": "text-white",
    "accent": "from-cyan-400 via-purple-400 to-pink-400",
    "logoVariant": "spiral_default"
  }'),
  ('nebula_dream', 'Nebula Dream', 'Soft purples and blues like floating through stardust', 'voyager', true, 500, '{
    "background": "from-indigo-950 via-purple-900 to-blue-950",
    "text": "text-white",
    "accent": "from-blue-400 via-indigo-400 to-purple-400",
    "logoVariant": "spiral_nebula"
  }'),
  ('aurora_frost', 'Aurora Frost', 'Cool cyan and green northern lights', 'voyager', true, 500, '{
    "background": "from-slate-950 via-teal-950 to-emerald-950",
    "text": "text-white",
    "accent": "from-cyan-300 via-teal-300 to-emerald-300",
    "logoVariant": "spiral_aurora"
  }'),
  ('solar_flare', 'Solar Flare', 'Warm golds and oranges like a cosmic sunrise', 'astral', true, 900, '{
    "background": "from-slate-950 via-amber-950 to-orange-950",
    "text": "text-white",
    "accent": "from-amber-400 via-orange-400 to-red-400",
    "logoVariant": "spiral_solar"
  }'),
  ('void_obsidian', 'Void Obsidian', 'Ultra-minimal black with subtle purple hints', 'astral', true, 900, '{
    "background": "from-black via-slate-950 to-black",
    "text": "text-slate-200",
    "accent": "from-purple-500 to-violet-500",
    "logoVariant": "spiral_void"
  }'),
  ('celestial_gold', 'Celestial Gold', 'Premium gold and violet for the elite', 'celestial', true, 1900, '{
    "background": "from-slate-950 via-violet-950 to-purple-950",
    "text": "text-white",
    "accent": "from-yellow-400 via-amber-400 to-orange-400",
    "logoVariant": "spiral_gold"
  }')
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_themes_tier ON themes(tier);
CREATE INDEX IF NOT EXISTS idx_themes_premium ON themes(is_premium);
CREATE INDEX IF NOT EXISTS idx_user_themes_user_id ON user_themes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_themes_theme_id ON user_themes(theme_id);

COMMENT ON TABLE themes IS 'Available cosmetic themes for purchase';
COMMENT ON TABLE user_themes IS 'Tracks which themes each user owns';
