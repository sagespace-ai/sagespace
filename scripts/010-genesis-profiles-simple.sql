-- Create a simple genesis_profiles table that stores onboarding data
-- This avoids modifying existing tables and can be run immediately

CREATE TABLE IF NOT EXISTS genesis_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  onboarding_completed BOOLEAN DEFAULT false,
  personality_type TEXT,
  sage_affinities JSONB DEFAULT '{}'::jsonb,
  onboarding_answers JSONB DEFAULT '[]'::jsonb,
  unlocked_sages TEXT[] DEFAULT ARRAY['origin-sage']::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE genesis_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own genesis profile"
  ON genesis_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own genesis profile"
  ON genesis_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own genesis profile"
  ON genesis_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create genesis_achievements table
CREATE TABLE IF NOT EXISTS genesis_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE genesis_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies  
CREATE POLICY "Users can view own achievements"
  ON genesis_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON genesis_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create genesis_quests table
CREATE TABLE IF NOT EXISTS genesis_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quest_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Enable RLS
ALTER TABLE genesis_quests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own quests"
  ON genesis_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests"
  ON genesis_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests"
  ON genesis_quests FOR UPDATE
  USING (auth.uid() = user_id);

-- Create companion_messages table for Origin Sage chat history
CREATE TABLE IF NOT EXISTS companion_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE companion_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own companion messages"
  ON companion_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companion messages"
  ON companion_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
