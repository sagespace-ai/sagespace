-- POD Design Templates (agent-generated)
CREATE TABLE IF NOT EXISTS pod_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_name TEXT NOT NULL,
  theme TEXT NOT NULL,
  design_concept TEXT NOT NULL,
  color_palette TEXT[] NOT NULL,
  main_elements TEXT[] NOT NULL,
  product_description TEXT NOT NULL,
  design_file_url TEXT, -- Uploaded to Printful/Printify
  created_by_agent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POD Products (linked to external platforms)
CREATE TABLE IF NOT EXISTS pod_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES pod_designs(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL CHECK (product_type IN ('mug', 'tshirt', 'poster', 'sticker', 'hoodie', 'tote')),
  product_name TEXT NOT NULL,
  base_price_usd DECIMAL(10,2) NOT NULL,
  external_url TEXT NOT NULL, -- Printful/Printify product page
  platform TEXT NOT NULL CHECK (platform IN ('printful', 'printify', 'redbubble')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User POD Interactions
CREATE TABLE IF NOT EXISTS user_pod_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES pod_products(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'design_request', 'external_click')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pod_products_design ON pod_products(design_id);
CREATE INDEX IF NOT EXISTS idx_pod_products_type ON pod_products(product_type);
CREATE INDEX IF NOT EXISTS idx_pod_interactions_user ON user_pod_interactions(user_id);

-- RLS Policies
ALTER TABLE pod_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pod_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read pod designs"
  ON pod_designs FOR SELECT
  USING (true);

CREATE POLICY "Public can read active pod products"
  ON pod_products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert own pod interactions"
  ON user_pod_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own pod interactions"
  ON user_pod_interactions FOR SELECT
  USING (auth.uid() = user_id);
