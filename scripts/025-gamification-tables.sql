-- Gamification System Tables for SageSpace
-- Supports quests, skill trees, badges, streaks, and sage training

-- Quest definitions table
CREATE TABLE IF NOT EXISTS quest_definitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  required_level INTEGER DEFAULT 1,
  prerequisites TEXT[] DEFAULT '{}',
  steps JSONB NOT NULL,
  rewards JSONB NOT NULL,
  is_repeatable BOOLEAN DEFAULT FALSE,
  cooldown_hours INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User quest progress tracking
CREATE TABLE IF NOT EXISTS user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quest_id TEXT NOT NULL REFERENCES quest_definitions(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, failed
  steps_completed JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_progress_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  cooldown_until TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, quest_id, started_at)
);

-- Sage skill trees
CREATE TABLE IF NOT EXISTS sage_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sage_id TEXT NOT NULL,
  skill_category TEXT NOT NULL, -- domain, communication, reasoning, creativity, integration, multimodal
  skill_name TEXT NOT NULL,
  skill_description TEXT,
  level INTEGER DEFAULT 0,
  max_level INTEGER DEFAULT 10,
  prerequisites TEXT[] DEFAULT '{}',
  unlock_requirements JSONB,
  benefits JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sage_id, skill_name)
);

-- User sage skill progress
CREATE TABLE IF NOT EXISTS user_sage_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sage_id TEXT NOT NULL,
  skill_id UUID NOT NULL REFERENCES sage_skills(id),
  current_level INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  xp_required INTEGER DEFAULT 100,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_trained_at TIMESTAMP WITH TIME ZONE,
  training_sessions INTEGER DEFAULT 0,
  UNIQUE(user_id, sage_id, skill_id)
);

-- Badges and achievements
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL, -- quest, skill, milestone, special
  rarity TEXT NOT NULL DEFAULT 'common', -- common, rare, epic, legendary
  unlock_criteria JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id TEXT NOT NULL REFERENCES badges(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  showcase BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, badge_id)
);

-- Daily/Weekly/Seasonal challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL, -- daily, weekly, seasonal
  requirements JSONB NOT NULL,
  rewards JSONB NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User challenge progress
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  progress JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rewards_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, challenge_id)
);

-- Sage training sessions
CREATE TABLE IF NOT EXISTS sage_training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sage_id TEXT NOT NULL,
  session_type TEXT NOT NULL, -- feedback, document, practice, rating
  training_data JSONB NOT NULL,
  skill_improvements JSONB,
  xp_earned INTEGER DEFAULT 0,
  session_quality NUMERIC(3,2), -- 0.00 to 1.00
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE quest_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE sage_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sage_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE sage_training_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Quest definitions - public read
CREATE POLICY "Anyone can view active quests"
  ON quest_definitions FOR SELECT
  USING (is_active = TRUE);

-- User quest progress - users see own
CREATE POLICY "Users can view own quest progress"
  ON user_quest_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quest progress"
  ON user_quest_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quest progress"
  ON user_quest_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Sage skills - public read
CREATE POLICY "Anyone can view sage skills"
  ON sage_skills FOR SELECT
  USING (TRUE);

-- User sage skills - users see own
CREATE POLICY "Users can view own sage skills"
  ON user_sage_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sage skills"
  ON user_sage_skills FOR ALL
  USING (auth.uid() = user_id);

-- Badges - public read
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (TRUE);

-- User badges - users see own
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Challenges - public read
CREATE POLICY "Anyone can view active challenges"
  ON challenges FOR SELECT
  USING (is_active = TRUE);

-- User challenges - users see own
CREATE POLICY "Users can view own challenge progress"
  ON user_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own challenges"
  ON user_challenges FOR ALL
  USING (auth.uid() = user_id);

-- Training sessions - users see own
CREATE POLICY "Users can view own training sessions"
  ON sage_training_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training sessions"
  ON sage_training_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert initial quest definitions
INSERT INTO quest_definitions (id, title, description, category, difficulty, xp_reward, required_level, steps, rewards)
VALUES 
  ('first-chat', 'First Contact', 'Have your first conversation with a Sage', 'exploration', 'beginner', 100, 1,
   '[{"id":"chat-once","title":"Start a conversation","description":"Send a message to any Sage","completed":false,"requiredAction":{"type":"chat","count":1}}]',
   '[{"type":"xp","value":100,"name":"100 XP"},{"type":"badge","value":"first-contact","name":"First Contact Badge"}]'),
  
  ('council-summon', 'Summon the Council', 'Convene a Council deliberation', 'collaboration', 'beginner', 200, 2,
   '[{"id":"start-council","title":"Initiate Council Session","description":"Ask a complex question","completed":false,"requiredAction":{"type":"council","count":1}}]',
   '[{"type":"xp","value":200,"name":"200 XP"},{"type":"badge","value":"council-caller","name":"Council Caller Badge"}]');

-- Insert initial badges
INSERT INTO badges (id, name, description, category, rarity)
VALUES
  ('first-contact', 'First Contact', 'Had your first conversation with a Sage', 'quest', 'common'),
  ('council-caller', 'Council Caller', 'Summoned the Council for the first time', 'quest', 'common'),
  ('sage-trainer', 'Sage Trainer', 'Trained a Sage 10 times', 'skill', 'rare'),
  ('sage-master', 'Sage Master', 'Achieved mastery with a Sage', 'skill', 'legendary');
