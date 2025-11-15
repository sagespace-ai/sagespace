-- Created database functions for memory statistics and XP management

-- Function to count unique agents a user has interacted with
CREATE OR REPLACE FUNCTION count_unique_agents(user_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  agent_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT agent_id)
  INTO agent_count
  FROM messages m
  JOIN conversations c ON c.id = m.conversation_id
  WHERE c.user_id = user_id_param
    AND m.agent_id IS NOT NULL;
  
  RETURN COALESCE(agent_count, 0);
END;
$$;

-- Function to increment user XP
CREATE OR REPLACE FUNCTION increment_user_xp(
  user_id_param UUID,
  xp_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_progress (user_id, xp, level)
  VALUES (user_id_param, xp_amount, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    xp = user_progress.xp + xp_amount,
    level = FLOOR((user_progress.xp + xp_amount) / 1000) + 1,
    updated_at = NOW();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION count_unique_agents(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_user_xp(UUID, INTEGER) TO authenticated;
