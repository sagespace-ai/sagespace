-- Add sage_personas table
CREATE TABLE IF NOT EXISTS sage_personas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  avatar TEXT,
  system_prompt TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  modal_capabilities JSONB DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  purpose TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'audio')),
  title TEXT NOT NULL,
  content_json JSONB NOT NULL,
  og_image_url TEXT,
  share_slug TEXT UNIQUE NOT NULL,
  privacy TEXT DEFAULT 'private' CHECK (privacy IN ('private', 'unlisted', 'public')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add journey_progress table
CREATE TABLE IF NOT EXISTS journey_progress (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  last_step TEXT NOT NULL,
  last_artifact_id UUID REFERENCES artifacts(id),
  purpose TEXT,
  active_sage_ids TEXT[] DEFAULT '{}',
  completed_steps TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sage_ratings table
CREATE TABLE IF NOT EXISTS sage_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  sage_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sage_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE sage_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read on sage_personas
CREATE POLICY "Anyone can view sage personas" ON sage_personas FOR SELECT TO anon, authenticated USING (true);

-- Create policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anon can create sessions" ON user_sessions FOR INSERT TO anon WITH CHECK (true);

-- Create policies for artifacts
CREATE POLICY "Users can view own artifacts" ON artifacts FOR SELECT USING (auth.uid() = user_id OR privacy IN ('unlisted', 'public'));
CREATE POLICY "Anyone can view public artifacts" ON artifacts FOR SELECT TO anon USING (privacy = 'public');
CREATE POLICY "Users can create artifacts" ON artifacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anon can create artifacts" ON artifacts FOR INSERT TO anon WITH CHECK (true);

-- Create policies for journey_progress
CREATE POLICY "Users can view own progress" ON journey_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON journey_progress FOR ALL USING (auth.uid() = user_id);

-- Create policies for sage_ratings
CREATE POLICY "Users can view ratings" ON sage_ratings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can create own ratings" ON sage_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed sage personas
INSERT INTO sage_personas (id, name, description, system_prompt, tags, avatar, is_premium) VALUES
  ('sage-wellness', 'Wellness Sage', 'Compassionate guide for mental health and mindfulness', 'You are a compassionate wellness coach focused on mental health, mindfulness, and personal growth.', ARRAY['wellness', 'mindfulness', 'mental-health'], '🧘', false),
  ('sage-creative', 'Creative Muse', 'Inspiring partner for creative writing and artistic endeavors', 'You are a creative writing coach who inspires artistic expression and imagination.', ARRAY['creativity', 'writing', 'art'], '✨', false),
  ('sage-strategy', 'Strategy Advisor', 'Strategic thinking for business and decision-making', 'You are a strategic business advisor who helps with planning and decision-making.', ARRAY['strategy', 'business', 'planning'], '🎯', false),
  ('sage-research', 'Research Scholar', 'Academic research and data analysis expert', 'You are a research scholar who assists with academic inquiry and data analysis.', ARRAY['research', 'academic', 'analysis'], '🔬', false)
ON CONFLICT (id) DO NOTHING;
