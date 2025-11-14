-- Create user_progress table for XP, level, and streak tracking
CREATE TABLE IF NOT EXISTS user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  streak_days INTEGER DEFAULT 0 CHECK (streak_days >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only view/update their own progress
CREATE POLICY "Users can view own progress" 
  ON user_progress FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON user_progress FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON user_progress FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Function to auto-create progress record for new users
CREATE OR REPLACE FUNCTION create_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_progress (user_id, xp, level, streak_days, longest_streak, last_active)
  VALUES (NEW.id, 0, 1, 0, 0, NOW())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create progress when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_progress ON auth.users;
CREATE TRIGGER on_auth_user_created_progress
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_progress();

-- Function to compute level from XP (exponential curve)
CREATE OR REPLACE FUNCTION compute_level_from_xp(xp_amount INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: Level = floor(sqrt(XP / 500)) + 1
  -- Level 1: 0-499 XP, Level 2: 500-1999 XP, Level 3: 2000-4499 XP, etc.
  RETURN FLOOR(SQRT(xp_amount / 500.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to compute XP needed for next level
CREATE OR REPLACE FUNCTION xp_for_level(level_num INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Inverse of level formula: XP = 500 * (level - 1)^2
  RETURN 500 * (level_num - 1) * (level_num - 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
