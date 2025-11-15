-- Seed a test user for development and testing
-- Note: This script should only be run in development environments
-- The test user credentials are: test@sagespace.ai / TestPassword123!

-- First, we need to insert into auth.users (this is handled by Supabase Auth)
-- For development, you can create this user via the Supabase dashboard or signup flow

-- Create test profile (assuming user already exists in auth.users)
-- This script will work after a user signs up with test@sagespace.ai

-- Insert test profile data
INSERT INTO profiles (id, email, full_name, avatar_url, bio, metadata)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@sagespace.ai',
  'Test User',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  'Welcome to SageSpace! This is a test account for exploring the platform.',
  jsonb_build_object(
    'role', 'tester',
    'created_via', 'seed_script'
  )
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  updated_at = NOW();

-- Create user progress for test user
INSERT INTO user_progress (
  user_id,
  xp,
  level,
  streak_days,
  longest_streak,
  last_active,
  companion_unlocked,
  onboarding_completed,
  unlocked_sages,
  sage_affinities,
  current_theme_id
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  1500,
  3,
  5,
  12,
  NOW(),
  true,
  true,
  ARRAY['architect', 'merchant', 'creative'],
  jsonb_build_object(
    'architect', 0.8,
    'merchant', 0.6,
    'creative', 0.9
  ),
  'cosmic-dark'
)
ON CONFLICT (user_id) DO UPDATE SET
  xp = EXCLUDED.xp,
  level = EXCLUDED.level,
  updated_at = NOW();

-- Create passport preferences
INSERT INTO passport_preferences (
  user_id,
  focus_areas,
  journey_modes,
  time_commitment,
  preferred_sages,
  onboarding_completed
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  ARRAY['AI Development', 'Business Strategy', 'Creative Design'],
  ARRAY['guided', 'collaborative'],
  '30-60 min/day',
  ARRAY['architect', 'creative'],
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  focus_areas = EXCLUDED.focus_areas,
  updated_at = NOW();

-- Create some timeline events for the test user
INSERT INTO timeline_events (user_id, type, title, description, metadata)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'conversation',
    'First Council Session',
    'Explored multi-agent collaboration with the Architect and Creative Sages',
    jsonb_build_object('mood', 'curious', 'sages', ARRAY['architect', 'creative'], 'xp_earned', 50)
  ),
  (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'achievement',
    'Unlocked Merchant Sage',
    'Successfully completed the Business Strategy quest',
    jsonb_build_object('achievement_id', 'unlock_merchant', 'xp_earned', 100)
  )
ON CONFLICT DO NOTHING;

-- Note: The actual auth.users entry must be created through Supabase Auth
-- You can create it by:
-- 1. Going to /auth/signup and creating an account with test@sagespace.ai
-- 2. Using the Supabase dashboard to create a user manually
-- 3. Running: supabase auth signup test@sagespace.ai TestPassword123!
