CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL, -- 'spotify', 'youtube', etc.
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  integration_metadata JSONB DEFAULT '{}',
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_refreshed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, integration_type)
);

-- Enable RLS
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own integrations"
  ON user_integrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations"
  ON user_integrations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anon to manage integrations (for demo mode)
CREATE POLICY "Anon can manage integrations"
  ON user_integrations FOR ALL
  TO anon
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id 
  ON user_integrations(user_id);
  
CREATE INDEX IF NOT EXISTS idx_user_integrations_type 
  ON user_integrations(user_id, integration_type);
