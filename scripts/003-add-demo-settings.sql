-- Add demo settings for anonymous users
INSERT INTO public.settings (user_id, key, value, category, type, description)
VALUES
  (NULL, 'dataRetention', '90'::jsonb, 'privacy', 'number', 'How long to retain conversation data (in days)'),
  (NULL, 'autoApprove', 'false'::jsonb, 'behavior', 'boolean', 'Automatically approve agent actions'),
  (NULL, 'notifyOnAgentAction', 'true'::jsonb, 'notifications', 'boolean', 'Receive notifications for agent actions'),
  (NULL, 'maxConcurrentAgents', '5'::jsonb, 'behavior', 'number', 'Maximum number of agents that can run simultaneously'),
  (NULL, 'ethicsReviewMode', '"automatic"'::jsonb, 'ethics', 'select', 'How to handle ethics reviews'),
  (NULL, 'enableLearning', 'true'::jsonb, 'behavior', 'boolean', 'Allow agents to learn from interactions')
ON CONFLICT DO NOTHING;
