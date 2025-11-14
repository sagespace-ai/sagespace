-- Expand subscription tiers from 3 to 5 per zero-infra monetization requirements
-- Update user_subscriptions table to support 5 tiers: explorer, voyager, astral, oracle, celestial

-- Drop existing constraint
ALTER TABLE user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_plan_id_check;

-- Add new constraint with 5 tiers
ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_plan_id_check 
  CHECK (plan_id IN ('explorer', 'voyager', 'astral', 'oracle', 'celestial'));

-- Update default plan from 'free' to 'explorer'
ALTER TABLE user_subscriptions ALTER COLUMN plan_id SET DEFAULT 'explorer';

-- Migrate existing 'free' plans to 'explorer'
UPDATE user_subscriptions SET plan_id = 'explorer' WHERE plan_id = 'free';

-- Migrate existing 'pro' plans to 'astral' (middle tier)
UPDATE user_subscriptions SET plan_id = 'astral' WHERE plan_id = 'pro';

-- Migrate existing 'enterprise' plans to 'celestial' (top tier)
UPDATE user_subscriptions SET plan_id = 'celestial' WHERE plan_id = 'enterprise';

-- Add credits column for Council Deep Dive packs and XP boosts
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- Create purchases table if it doesn't exist (for tracking individual purchases)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'SUBSCRIPTION', 'COSMETIC', 'XP_PACK', 'GENESIS_UNLOCK', 'COUNCIL_PACK'
  sku TEXT NOT NULL, -- e.g. 'tier_astral_monthly', 'theme_aurora', 'xp_1000'
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_type ON purchases(type);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at DESC);

-- Add XP and Genesis unlock tracking to user_progress if not exists
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS genesis_unlocked BOOLEAN DEFAULT false;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS current_theme_id TEXT;

COMMENT ON TABLE purchases IS 'Tracks all monetary purchases including subscriptions, cosmetics, XP packs, and unlocks';
COMMENT ON COLUMN user_subscriptions.credits IS 'Credits for premium Council sessions and features';
COMMENT ON COLUMN user_progress.credits IS 'User credits balance for premium features';
COMMENT ON COLUMN user_progress.genesis_unlocked IS 'Whether user has unlocked premium Genesis Chamber features';
COMMENT ON COLUMN user_progress.current_theme_id IS 'Currently selected cosmetic theme';
