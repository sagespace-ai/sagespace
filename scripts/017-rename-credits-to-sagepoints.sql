-- Charter compliance: Rename credits to sage_points across all tables
-- This aligns with Master Charter requirement that SagePoints be the closed-loop in-app utility credit

-- Rename credits column in user_subscriptions
ALTER TABLE user_subscriptions 
RENAME COLUMN credits TO sage_points;

-- Rename credits column in user_progress
ALTER TABLE user_progress 
RENAME COLUMN credits TO sage_points;

-- Update quest rewards column name
ALTER TABLE quests 
RENAME COLUMN reward_credits TO reward_sage_points;

-- Update purchases table to use 'sagepoints' type
UPDATE purchases 
SET purchase_type = 'sagepoints' 
WHERE purchase_type = 'credits';

-- Update column comments
COMMENT ON COLUMN user_subscriptions.sage_points IS 'SagePoints - closed-loop in-app utility credit for premium Council sessions per Charter';
COMMENT ON COLUMN user_progress.sage_points IS 'User SagePoints balance for premium features';
COMMENT ON COLUMN quests.reward_sage_points IS 'SagePoints awarded upon quest completion';

-- Add check constraint to ensure purchase_type uses correct terminology
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_purchase_type_check;
ALTER TABLE purchases ADD CONSTRAINT purchases_purchase_type_check 
CHECK (purchase_type IN ('plan', 'sagepoints', 'marketplace'));
