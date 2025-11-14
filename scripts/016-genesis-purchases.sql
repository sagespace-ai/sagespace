-- Genesis Chamber Premium Purchases
CREATE TABLE IF NOT EXISTS genesis_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unlock_id TEXT NOT NULL,
  unlock_type TEXT NOT NULL CHECK (unlock_type IN ('companion_pack', 'achievement_pack', 'quest_bundle', 'sage_collection')),
  price_paid DECIMAL(10,2) NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, unlock_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_genesis_purchases_user ON genesis_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_genesis_purchases_type ON genesis_purchases(unlock_type);

-- RLS policies
ALTER TABLE genesis_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON genesis_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
  ON genesis_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);
