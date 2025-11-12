-- Insert demo agents (these will be user-specific once auth is implemented)
-- For now, we'll create them without user_id for demo purposes

INSERT INTO public.agents (id, name, description, avatar, status, role, purpose, harmony_score, ethics_alignment)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Claude Assistant',
    'Advanced reasoning and general-purpose assistance',
    NULL,
    'active',
    'General Assistant',
    'Provide thoughtful, nuanced assistance across diverse topics',
    92,
    95
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Research Agent',
    'Specialized in research and data analysis',
    NULL,
    'idle',
    'Research Specialist',
    'Conduct thorough research and synthesize complex information',
    88,
    90
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Creative Agent',
    'Content creation and ideation',
    NULL,
    'thinking',
    'Creative Specialist',
    'Generate creative content and innovative solutions',
    85,
    87
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Code Assistant',
    'Programming and technical problem-solving',
    NULL,
    'active',
    'Technical Specialist',
    'Assist with coding, debugging, and technical architecture',
    90,
    92
  )
ON CONFLICT (id) DO NOTHING;

-- Insert demo conversations
INSERT INTO public.conversations (id, title, description, archived)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Project Planning Discussion',
    'Strategic planning for Q1 initiatives',
    FALSE
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Technical Architecture Review',
    'System design and scalability considerations',
    FALSE
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Content Strategy Session',
    'Developing content calendar and themes',
    FALSE
  )
ON CONFLICT (id) DO NOTHING;

-- Link agents to conversations
INSERT INTO public.conversation_participants (conversation_id, agent_id)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (conversation_id, agent_id) DO NOTHING;

-- Insert demo messages
INSERT INTO public.messages (conversation_id, agent_id, role, content)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'assistant',
    'I''ve reviewed the Q1 objectives. Let me break down the key priorities...'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'assistant',
    'Based on market research, here are three strategic recommendations...'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    'assistant',
    'For optimal scalability, I recommend a microservices architecture with...'
  )
;

-- Insert demo timeline events
INSERT INTO public.timeline_events (conversation_id, type, title, description)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'conversation_started',
    'Conversation Started',
    'Project Planning Discussion initiated'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    'agent_joined',
    'Claude Assistant Joined',
    'Agent joined the conversation'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'conversation_started',
    'Conversation Started',
    'Technical Architecture Review initiated'
  )
;
