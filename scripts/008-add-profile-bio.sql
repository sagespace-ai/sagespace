-- Add bio column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio text;

-- Add comment
COMMENT ON COLUMN profiles.bio IS 'User biography or description of areas of focus';
