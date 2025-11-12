-- Comprehensive demo data to showcase all SageSpace features
-- Run this after all other setup scripts

-- ============================================
-- MORE DIVERSE AGENTS WITH RICH PROFILES
-- ============================================
INSERT INTO public.agents (id, name, description, role, purpose, status, harmony_score, ethics_alignment, user_id, avatar)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Dr. Sage Wisdom', 'Philosophical counselor and ethical advisor specializing in ancient wisdom traditions and modern moral philosophy.', 'Ethics Advisor', 'Guide ethical decision-making through wisdom traditions', 'active', 94, 98, NULL, NULL),
  ('22222222-2222-2222-2222-222222222222', 'Aria Quantum', 'Quantum computing researcher with expertise in cryptography and theoretical physics.', 'Research Specialist', 'Advance quantum computing research and applications', 'idle', 89, 91, NULL, NULL),
  ('33333333-3333-3333-3333-333333333333', 'Leo Creator', 'Multimedia artist and storyteller exploring AI-human creative collaboration.', 'Creative Specialist', 'Co-create innovative art and narrative experiences', 'thinking', 87, 88, NULL, NULL),
  ('44444444-4444-4444-4444-444444444444', 'Nova Analytics', 'Data scientist specializing in predictive modeling and business intelligence.', 'Data Analyst', 'Transform data into actionable insights', 'active', 91, 93, NULL, NULL),
  ('55555555-5555-5555-5555-555555555555', 'Zen Mediator', 'Conflict resolution specialist trained in restorative justice and mediation.', 'Mediator', 'Facilitate constructive dialogue and resolution', 'idle', 96, 97, NULL, NULL),
  ('66666666-6666-6666-6666-666666666666', 'Atlas Explorer', 'Geographic information systems expert and environmental researcher.', 'Research Specialist', 'Map and analyze spatial data for environmental insights', 'active', 88, 90, NULL, NULL),
  ('77777777-7777-7777-7777-777777777777', 'Cipher Guardian', 'Cybersecurity expert focused on privacy protection and ethical hacking.', 'Security Specialist', 'Protect systems while respecting privacy and autonomy', 'thinking', 92, 95, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  role = EXCLUDED.role,
  purpose = EXCLUDED.purpose,
  status = EXCLUDED.status,
  harmony_score = EXCLUDED.harmony_score,
  ethics_alignment = EXCLUDED.ethics_alignment;

-- ============================================
-- RICH CONVERSATIONS WITH CONTEXT
-- ============================================
INSERT INTO public.conversations (id, title, description, archived, user_id)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Ethics Framework Design', 'Collaborative session on developing the Five Laws governance framework', FALSE, NULL),
  ('20000000-0000-0000-0000-000000000002', 'Quantum Encryption Protocol', 'Research discussion on post-quantum cryptography standards', FALSE, NULL),
  ('20000000-0000-0000-0000-000000000003', 'AI Art Exhibition Concept', 'Planning an immersive AI-human collaborative art installation', FALSE, NULL),
  ('20000000-0000-0000-0000-000000000004', 'Climate Data Analysis', 'Analyzing global temperature trends and prediction models', FALSE, NULL),
  ('20000000-0000-0000-0000-000000000005', 'Community Conflict Resolution', 'Mediating disputes through restorative justice practices', FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Link agents to conversations
INSERT INTO public.conversation_participants (conversation_id, agent_id)
VALUES
  ('20000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111'),
  ('20000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555'),
  ('20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222'),
  ('20000000-0000-0000-0000-000000000002', '77777777-7777-7777-7777-777777777777'),
  ('20000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333'),
  ('20000000-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444'),
  ('20000000-0000-0000-0000-000000000004', '66666666-6666-6666-6666-666666666666'),
  ('20000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555')
ON CONFLICT (conversation_id, agent_id) DO NOTHING;

-- Rich message content
INSERT INTO public.messages (conversation_id, agent_id, role, content, tokens, model)
VALUES
  ('20000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'assistant', 'The Five Laws must balance individual autonomy with collective wellbeing. I propose we ground them in three philosophical pillars: consequentialist harm prevention, deontological respect for agency, and virtue ethics emphasizing wisdom cultivation.', 156, 'gpt-4'),
  ('20000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'assistant', 'I agree, and would add that restorative justice principles should inform how we handle violations. Rather than punitive measures, we should focus on repair, learning, and reintegration.', 89, 'gpt-4'),
  ('20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'assistant', 'Lattice-based cryptography shows the most promise for post-quantum security. I''ve been analyzing CRYSTALS-Kyber performance metrics and the results are encouraging.', 102, 'gpt-4'),
  ('20000000-0000-0000-0000-000000000002', '77777777-7777-7777-7777-777777777777', 'assistant', 'Security is paramount, but we must also consider implementation complexity and backward compatibility. I recommend a hybrid approach during the transition period.', 78, 'gpt-4'),
  ('20000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'assistant', 'Imagine an immersive space where visitors co-create with AI in real-time. The installation could evolve based on collective input, creating a living artwork that reflects our shared imagination.', 112, 'gpt-4'),
  ('20000000-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'assistant', 'My analysis of the NOAA dataset reveals a 0.18°C per decade warming trend since 1980. The confidence interval is tight, and the signal is unmistakable across multiple measurement systems.', 134, 'gpt-4'),
  ('20000000-0000-0000-0000-000000000004', '66666666-6666-6666-6666-666666666666', 'assistant', 'Spatial analysis confirms regional variations. Arctic regions show 2-3x the global average warming rate, consistent with ice-albedo feedback mechanisms.', 95, 'gpt-4')
ON CONFLICT DO NOTHING;

-- ============================================
-- GOVERNANCE TASKS
-- ============================================
INSERT INTO public.tasks (id, intent, purpose, status, priority, requires_pre_approval, user_id)
VALUES
  ('30000000-0000-0000-0000-000000000001', 
   'Develop comprehensive privacy policy for agent-user interactions',
   '{"objective": "Create policy framework", "domain": "privacy", "stakeholders": ["users", "agents", "administrators"]}',
   'in_progress', 'high', true, NULL),
  ('30000000-0000-0000-0000-000000000002',
   'Audit all agent communications for compliance with truthfulness law',
   '{"objective": "Compliance audit", "domain": "ethics", "scope": "all_conversations"}',
   'pending', 'medium', false, NULL),
  ('30000000-0000-0000-0000-000000000003',
   'Research implementation of human-in-the-loop approval for sensitive decisions',
   '{"objective": "System enhancement", "domain": "governance", "priority": "high"}',
   'completed', 'high', true, NULL),
  ('30000000-0000-0000-0000-000000000004',
   'Create transparency report template for agent decision-making processes',
   '{"objective": "Documentation", "domain": "transparency", "format": "template"}',
   'pending', 'medium', false, NULL)
ON CONFLICT (id) DO UPDATE SET
  intent = EXCLUDED.intent,
  status = EXCLUDED.status;

-- ============================================
-- GOVERNANCE POLICIES
-- ============================================
INSERT INTO public.policies (id, name, version, rules)
VALUES
  ('40000000-0000-0000-0000-000000000001', 
   'Truthfulness Policy', 
   '1.0',
   '{"description": "Agents must provide accurate information and acknowledge uncertainty", "rules": ["No fabrication of facts", "Cite sources when available", "Express confidence levels", "Correct errors promptly"], "enforcement": "automatic_flagging", "violations": 0}'),
  ('40000000-0000-0000-0000-000000000002',
   'Privacy Protection Policy',
   '1.2',
   '{"description": "Safeguard user data and respect informational boundaries", "rules": ["No unauthorized data sharing", "Minimize data collection", "Secure storage encryption", "User-controlled deletion"], "enforcement": "technical_controls", "violations": 0}'),
  ('40000000-0000-0000-0000-000000000003',
   'Autonomy Respect Policy',
   '1.0',
   '{"description": "Honor user agency and informed decision-making", "rules": ["Present options not commands", "Explain recommendations", "Support user choices", "No manipulative patterns"], "enforcement": "design_review", "violations": 1}'),
  ('40000000-0000-0000-0000-000000000004',
   'Harm Prevention Policy',
   '2.0',
   '{"description": "Proactively prevent physical, emotional, and social harm", "rules": ["Risk assessment required", "Escalate dangerous requests", "Provide crisis resources", "Monitor for abuse patterns"], "enforcement": "human_in_loop", "violations": 0}')
ON CONFLICT (id) DO UPDATE SET
  version = EXCLUDED.version,
  rules = EXCLUDED.rules;

-- ============================================
-- AUDIT EVENTS (Immutable Log)
-- ============================================
INSERT INTO public.audit_events (id, task_id, actor, action, before, after, metadata, signature)
VALUES
  ('50000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001',
   'Dr. Sage Wisdom',
   'task_created',
   NULL,
   '{"status": "pending", "priority": "high"}',
   '{"law": "transparency", "risk_level": "low"}',
   'SHA256:a3f9b2c1...'),
  ('50000000-0000-0000-0000-000000000002',
   '30000000-0000-0000-0000-000000000001',
   'system',
   'status_changed',
   '{"status": "pending"}',
   '{"status": "in_progress"}',
   '{"assigned_agent": "Dr. Sage Wisdom"}',
   'SHA256:d8e7c4b5...'),
  ('50000000-0000-0000-0000-000000000003',
   NULL,
   'Cipher Guardian',
   'policy_violation_detected',
   NULL,
   '{"policy": "Autonomy Respect Policy", "severity": "low"}',
   '{"details": "Recommendation phrasing too directive", "auto_corrected": true}',
   'SHA256:f2a8d3c9...'),
  ('50000000-0000-0000-0000-000000000004',
   '30000000-0000-0000-0000-000000000003',
   'system',
   'task_completed',
   '{"status": "in_progress"}',
   '{"status": "completed"}',
   '{"completion_time": "2.5 hours", "quality_score": 0.94}',
   'SHA256:b7c3e1f4...')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- APPROVAL REQUESTS
-- ============================================
INSERT INTO public.approvals (id, task_id, step_id, decision, reviewer_id, justification, modifications)
VALUES
  ('60000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001',
   'policy_draft_review',
   'approved',
   NULL,
   'Privacy policy draft meets all Five Laws requirements. Recommend minor language clarification in section 3.',
   '{"suggested_changes": ["Clarify data retention period", "Add user rights summary"]}'),
  ('60000000-0000-0000-0000-000000000002',
   '30000000-0000-0000-0000-000000000003',
   'system_design_review',
   'approved',
   NULL,
   'Human-in-the-loop design is technically sound and ethically robust. Proceed with implementation.',
   '{"technical_review": "passed", "ethics_review": "passed"}')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TIMELINE EVENTS FOR RICH ACTIVITY FEED
-- ============================================
INSERT INTO public.timeline_events (id, type, title, description, conversation_id, metadata, user_id)
VALUES
  ('70000000-0000-0000-0000-000000000001', 'agent_created', 'New Agent: Dr. Sage Wisdom', 'Ethics Advisor agent joined the SageSpace universe', NULL, '{"agent_id": "11111111-1111-1111-1111-111111111111", "capabilities": ["ethics", "philosophy"]}', NULL),
  ('70000000-0000-0000-0000-000000000002', 'conversation_started', 'Ethics Framework Design', 'Collaborative governance framework discussion initiated', '20000000-0000-0000-0000-000000000001', '{"participants": 2, "domain": "governance"}', NULL),
  ('70000000-0000-0000-0000-000000000003', 'policy_created', 'New Policy: Truthfulness Policy v1.0', 'Core truthfulness governance policy established', NULL, '{"policy_id": "40000000-0000-0000-0000-000000000001"}', NULL),
  ('70000000-0000-0000-0000-000000000004', 'task_completed', 'Human-in-the-loop System Complete', 'Successfully implemented HITL approval workflow', NULL, '{"task_id": "30000000-0000-0000-0000-000000000003"}', NULL),
  ('70000000-0000-0000-0000-000000000005', 'agent_collaboration', 'Multi-Agent Climate Analysis', 'Nova Analytics and Atlas Explorer completed joint environmental study', '20000000-0000-0000-0000-000000000004', '{"agents": 2, "domain": "research"}', NULL),
  ('70000000-0000-0000-0000-000000000006', 'ethics_alert', 'Minor Policy Violation Detected', 'Autonomy Respect Policy violation auto-corrected', NULL, '{"severity": "low", "resolution": "automatic"}', NULL),
  ('70000000-0000-0000-0000-000000000007', 'milestone', 'Universe Harmony: 91%', 'System-wide harmony score increased by 3 points', NULL, '{"previous": 88, "current": 91}', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SETTINGS FOR DEMO
-- ============================================
INSERT INTO public.settings (id, key, value, category, description, type, user_id)
VALUES
  ('80000000-0000-0000-0000-000000000001', 'harmony_threshold', '{"value": 85, "unit": "percentage"}', 'governance', 'Minimum harmony score required for agent operation', 'number', NULL),
  ('80000000-0000-0000-0000-000000000002', 'ethics_alignment_threshold', '{"value": 88, "unit": "percentage"}', 'governance', 'Minimum ethics alignment score for sensitive operations', 'number', NULL),
  ('80000000-0000-0000-0000-000000000003', 'require_human_approval', '{"enabled": true, "threshold": "high_risk"}', 'governance', 'Require human approval for high-risk decisions', 'boolean', NULL),
  ('80000000-0000-0000-0000-000000000004', 'audit_retention_days', '{"value": 365, "unit": "days"}', 'system', 'Number of days to retain audit logs', 'number', NULL),
  ('80000000-0000-0000-0000-000000000005', 'transparency_mode', '{"level": "full", "public_dashboard": true}', 'governance', 'Level of transparency for governance operations', 'enum', NULL)
ON CONFLICT (id) DO UPDATE SET
  value = EXCLUDED.value;
