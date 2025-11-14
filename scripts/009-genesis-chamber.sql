-- Genesis Chamber: Revolutionary gamified profile system with Origin Sage companion

-- Add all Genesis-specific columns to user_progress table
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS companion_unlocked BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS personality_type TEXT,
ADD COLUMN IF NOT EXISTS sage_affinities JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_answers JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS unlocked_sages TEXT[] DEFAULT '{"origin-sage"}';

-- Renamed from user_quests to genesis_quests for clarity
CREATE TABLE IF NOT EXISTS genesis_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  progress INTEGER DEFAULT 0,
  max_progress INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_genesis_quests_user_id ON genesis_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_genesis_quests_status ON genesis_quests(status);

-- Enable RLS
ALTER TABLE genesis_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quests"
  ON genesis_quests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests"
  ON genesis_quests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests"
  ON genesis_quests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Renamed from user_achievements to genesis_achievements for clarity
CREATE TABLE IF NOT EXISTS genesis_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_genesis_achievements_user_id ON genesis_achievements(user_id);

-- Enable RLS
ALTER TABLE genesis_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON genesis_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON genesis_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Companion conversation history
CREATE TABLE IF NOT EXISTS companion_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companion_messages_user_id ON companion_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_companion_messages_created_at ON companion_messages(created_at DESC);

-- Enable RLS
ALTER TABLE companion_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companion messages"
  ON companion_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companion messages"
  ON companion_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
