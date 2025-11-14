-- Add metadata column to profiles table for storing Genesis data
-- This allows us to store onboarding status without creating new tables

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add index for faster metadata queries
CREATE INDEX IF NOT EXISTS idx_profiles_metadata ON profiles USING gin(metadata);

-- Update RLS policy to allow users to update their own metadata
-- (This should already be covered by existing update policy, but ensuring it's clear)

COMMENT ON COLUMN profiles.metadata IS 'Flexible JSON storage for Genesis onboarding, preferences, and other user data';
