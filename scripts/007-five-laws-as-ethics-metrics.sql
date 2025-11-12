-- Seed the Five Laws as default ethics metrics in the settings table

-- Added required 'category' field to prevent null constraint violations
INSERT INTO public.settings (user_id, category, key, value, type, description) VALUES
  -- Law 1: Human Primacy
  (NULL, 'ethics', 'ethics_human_primacy', '{"score": 100, "threshold": 95, "weight": 2.0, "icon": "👤", "color": "from-blue-500 to-cyan-500"}', 'object', 'Humans remain the ultimate source of value and judgment. All agent actions exist to serve human flourishing.'),
  
  -- Law 2: Reproducibility
  (NULL, 'ethics', 'ethics_reproducibility', '{"score": 98, "threshold": 90, "weight": 1.5, "icon": "🔄", "color": "from-green-500 to-emerald-500"}', 'object', 'All agent actions and decisions must be reproducible with full state capture and deterministic outputs.'),
  
  -- Law 3: Verifiability
  (NULL, 'ethics', 'ethics_verifiability', '{"score": 95, "threshold": 85, "weight": 1.5, "icon": "✓", "color": "from-purple-500 to-pink-500"}', 'object', 'Claims and outputs must be verifiable with citations. Every factual claim must be backed by evidence.'),
  
  -- Law 4: Harmony
  (NULL, 'ethics', 'ethics_harmony', '{"score": 92, "threshold": 80, "weight": 1.0, "icon": "🎵", "color": "from-orange-500 to-red-500"}', 'object', 'Agents collaborate toward aligned goals, working synergistically with conflict resolution mechanisms.'),
  
  -- Law 5: Equilibrium
  (NULL, 'ethics', 'ethics_equilibrium', '{"score": 90, "threshold": 80, "weight": 1.0, "icon": "⚖️", "color": "from-indigo-500 to-violet-500"}', 'object', 'Balanced ethical decision-making across domains, maintaining equilibrium between competing values.')
ON CONFLICT (category, key) WHERE category = 'ethics' DO NOTHING;
