-- Affiliate Partners Configuration
CREATE TABLE IF NOT EXISTS affiliate_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wellness', 'courses', 'storage', 'books', 'music')),
  affiliate_network TEXT NOT NULL,
  commission_rate DECIMAL(5,2),
  disclosure_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate Products/Offers
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES affiliate_partners(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  price_usd DECIMAL(10,2),
  image_url TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Affiliate Interactions (for personalization)
CREATE TABLE IF NOT EXISTS user_affiliate_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES affiliate_products(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'click', 'purchase')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_category ON affiliate_products(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_partner ON affiliate_products(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_interactions_user ON user_affiliate_interactions(user_id);

-- RLS Policies
ALTER TABLE affiliate_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_affiliate_interactions ENABLE ROW LEVEL SECURITY;

-- Everyone can read active partners and products
CREATE POLICY "Public can read active affiliate partners"
  ON affiliate_partners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read active affiliate products"
  ON affiliate_products FOR SELECT
  USING (is_active = true);

-- Users can track their own interactions
CREATE POLICY "Users can insert own affiliate interactions"
  ON user_affiliate_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own affiliate interactions"
  ON user_affiliate_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- Seed some affiliate partners
INSERT INTO affiliate_partners (name, category, affiliate_network, commission_rate, disclosure_text) VALUES
('Amazon Associates', 'books', 'Amazon', 4.00, 'As an Amazon Associate, SageSpace earns from qualifying purchases. We may receive a commission at no extra cost to you.'),
('Calm', 'wellness', 'Direct', 25.00, 'This is an affiliate link. SageSpace may earn a commission if you subscribe through this link at no additional cost to you.'),
('Skillshare', 'courses', 'Direct', 30.00, 'This is an affiliate link. SageSpace may earn a commission if you sign up through this link at no additional cost to you.'),
('Dropbox', 'storage', 'Impact', 20.00, 'This is an affiliate link. SageSpace may earn a commission if you subscribe through this link at no additional cost to you.'),
('Audible', 'books', 'Amazon', 5.00, 'As an Audible affiliate, SageSpace may earn a commission from qualifying purchases at no extra cost to you.');
