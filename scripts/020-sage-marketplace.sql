-- Creator Profiles
CREATE TABLE IF NOT EXISTS marketplace_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 15.00 CHECK (commission_rate BETWEEN 10.00 AND 20.00),
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace Products (digital goods only)
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES marketplace_creators(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('journal', 'ritual-guide', 'meditation-audio', 'wallpaper', 'affirmation-deck', 'course', 'template')),
  price_usd DECIMAL(10,2) NOT NULL CHECK (price_usd >= 0.99),
  preview_image_url TEXT,
  file_url TEXT, -- Stored in Vercel Blob or similar
  file_size_mb DECIMAL(10,2),
  file_format TEXT,
  tags TEXT[],
  downloads_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace Purchases
CREATE TABLE IF NOT EXISTS marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES marketplace_creators(id) ON DELETE CASCADE,
  price_paid DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  creator_earnings DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  download_url TEXT,
  download_count INTEGER DEFAULT 0,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_user_id, product_id)
);

-- Marketplace Reviews
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES marketplace_purchases(id) ON DELETE CASCADE,
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
  reviewer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(purchase_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_products_creator ON marketplace_products(creator_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_category ON marketplace_products(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_buyer ON marketplace_purchases(buyer_user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_creator ON marketplace_purchases(creator_id);

-- RLS Policies
ALTER TABLE marketplace_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- Creators: public read, users can create/edit own
CREATE POLICY "Public can read active creators"
  ON marketplace_creators FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create creator profile"
  ON marketplace_creators FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can update own profile"
  ON marketplace_creators FOR UPDATE
  USING (auth.uid() = user_id);

-- Products: public read active, creators manage own
CREATE POLICY "Public can read active products"
  ON marketplace_products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Creators can insert own products"
  ON marketplace_products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketplace_creators
      WHERE id = creator_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update own products"
  ON marketplace_products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_creators
      WHERE id = creator_id AND user_id = auth.uid()
    )
  );

-- Purchases: buyers read own, creators see earnings
CREATE POLICY "Buyers can read own purchases"
  ON marketplace_purchases FOR SELECT
  USING (buyer_user_id = auth.uid());

CREATE POLICY "Creators can read own sales"
  ON marketplace_purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_creators
      WHERE id = creator_id AND user_id = auth.uid()
    )
  );

-- Reviews: public read, verified purchasers write
CREATE POLICY "Public can read reviews"
  ON marketplace_reviews FOR SELECT
  USING (true);

CREATE POLICY "Purchasers can write reviews"
  ON marketplace_reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketplace_purchases
      WHERE id = purchase_id AND buyer_user_id = auth.uid()
    )
  );
