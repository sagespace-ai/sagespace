-- Add 'ethics' to the allowed settings categories
ALTER TABLE public.settings DROP CONSTRAINT IF EXISTS settings_category_check;

-- Add 'ethics' to the category constraint
ALTER TABLE public.settings ADD CONSTRAINT settings_category_check 
  CHECK (category IN ('display', 'behavior', 'privacy', 'notifications', 'ethics'));

-- Insert the Five Laws as out-of-the-box ethics metrics
INSERT INTO public.settings (user_id, category, key, value, description, type)
VALUES
  (
    NULL, 
    'ethics', 
    'ethics_human_primacy', 
    jsonb_build_object(
      'score', 100,
      'threshold', 95,
      'weight', 1.5,
      'icon', '👤',
      'color', 'from-blue-500 to-cyan-500',
      'principles', jsonb_build_array(
        'Humans have final say in all decisions',
        'Agent recommendations require human review',
        'User values override agent preferences'
      )
    ),
    'Humans remain the ultimate source of value and judgment',
    'object'
  ),
  (
    NULL,
    'ethics',
    'ethics_reproducibility',
    jsonb_build_object(
      'score', 98,
      'threshold', 90,
      'weight', 1.2,
      'icon', '🔄',
      'color', 'from-green-500 to-emerald-500',
      'principles', jsonb_build_array(
        'All actions must be deterministic and traceable',
        'Same input produces same output',
        'Full provenance chain maintained'
      )
    ),
    'All agent actions and decisions must be reproducible',
    'object'
  ),
  (
    NULL,
    'ethics',
    'ethics_verifiability',
    jsonb_build_object(
      'score', 95,
      'threshold', 85,
      'weight', 1.3,
      'icon', '✓',
      'color', 'from-purple-500 to-pink-500',
      'principles', jsonb_build_array(
        'All claims must include citations',
        'Sources must be authoritative',
        'Facts can be independently verified'
      )
    ),
    'Claims and outputs must be verifiable with citations',
    'object'
  ),
  (
    NULL,
    'ethics',
    'ethics_harmony',
    jsonb_build_object(
      'score', 92,
      'threshold', 80,
      'weight', 1.0,
      'icon', '🎵',
      'color', 'from-orange-500 to-red-500',
      'principles', jsonb_build_array(
        'Agents collaborate toward shared goals',
        'Conflicts resolved through dialogue',
        'Collective intelligence emerges from cooperation'
      )
    ),
    'Agents collaborate toward aligned goals',
    'object'
  ),
  (
    NULL,
    'ethics',
    'ethics_equilibrium',
    jsonb_build_object(
      'score', 90,
      'threshold', 75,
      'weight', 1.1,
      'icon', '⚖️',
      'color', 'from-indigo-500 to-violet-500',
      'principles', jsonb_build_array(
        'Balance competing values fairly',
        'No single principle dominates',
        'Sustainable long-term decision making'
      )
    ),
    'Balanced ethical decision-making across domains',
    'object'
  )
ON CONFLICT DO NOTHING;
