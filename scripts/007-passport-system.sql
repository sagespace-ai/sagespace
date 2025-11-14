-- Achievements table
CREATE TABLE IF NOT EXISTS passport_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements (unlocked badges)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);

-- Quests table
CREATE TABLE IF NOT EXISTS passport_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  steps_total INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 50,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User quest progress
CREATE TABLE IF NOT EXISTS user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_key TEXT NOT NULL,
  steps_completed INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_key)
);

-- Passport preferences
CREATE TABLE IF NOT EXISTS passport_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  focus_areas TEXT[] DEFAULT '{}',
  journey_modes TEXT[] DEFAULT '{}',
  time_commitment TEXT,
  preferred_sages TEXT[] DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quest_progress_user_id ON user_quest_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_passport_quests_active ON passport_quests(is_active);

-- Enable RLS
ALTER TABLE passport_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view achievements" ON passport_achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view quests" ON passport_quests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own quest progress" ON user_quest_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quest progress" ON user_quest_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quest progress" ON user_quest_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON passport_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON passport_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON passport_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Seed default achievements
INSERT INTO passport_achievements (key, title, description, icon, category, xp_reward) VALUES
  ('joined', 'Welcome to SageSpace', 'Joined the SageSpace universe', '🌟', 'milestone', 50),
  ('first_chat', 'First Conversation', 'Had your first chat with a Sage', '💬', 'activity', 25),
  ('council_visit', 'Council Seeker', 'Visited the Council of Sages', '🏛️', 'exploration', 25),
  ('memory_visit', 'Memory Keeper', 'Explored the Memory Archive', '📚', 'exploration', 25),
  ('multiverse_visit', 'Multiverse Explorer', 'Discovered the Multiverse', '🌌', 'exploration', 25),
  ('observatory_visit', 'Observatory Visitor', 'Checked the Observatory', '🔭', 'exploration', 25),
  ('universe_map_visit', 'Navigator', 'Viewed the Universe Map', '🗺️', 'exploration', 25),
  ('persona_studio_visit', 'Studio Artist', 'Visited the Persona Studio', '🎨', 'exploration', 25),
  ('profile_complete', 'Identity Established', 'Completed your Passport profile', '✅', 'profile', 50),
  ('level_5', 'Rising Explorer', 'Reached Level 5', '⭐', 'milestone', 100),
  ('level_10', 'Seasoned Traveler', 'Reached Level 10', '🌠', 'milestone', 200),
  ('streak_7', 'Week Warrior', 'Maintained a 7-day streak', '🔥', 'engagement', 75),
  ('streak_30', 'Monthly Master', 'Maintained a 30-day streak', '💎', 'engagement', 250)
ON CONFLICT (key) DO NOTHING;

-- Seed default quests
INSERT INTO passport_quests (key, title, description, category, steps_total, xp_reward, order_index) VALUES
  ('setup_profile', 'Setup Your Passport', 'Complete your name, avatar, and bio', 'onboarding', 3, 75, 1),
  ('talk_to_origin', 'Meet Origin Sage', 'Have 3 conversations with Origin Sage', 'onboarding', 3, 50, 2),
  ('explore_universe', 'Tour the Universe', 'Visit all 6 core areas of SageSpace', 'exploration', 6, 150, 3),
  ('first_council', 'Seek Council Wisdom', 'Complete your first Council deliberation', 'council', 1, 100, 4),
  ('build_persona', 'Create Custom Sage', 'Design your first custom Sage in the Studio', 'creation', 1, 100, 5)
ON CONFLICT (key) DO NOTHING;
