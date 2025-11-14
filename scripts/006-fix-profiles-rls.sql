-- Add INSERT policy for profiles table so users can create their own profile
CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
