# SageSpace Technical Documentation

**For Developers, Architects, and Technical Users**

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Self-Evolving System](#self-evolving-system)
3. [AI Orchestration](#ai-orchestration)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Deployment](#deployment)
7. [Contributing](#contributing)

---

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **AI**: Vercel AI Gateway, LangGraph-inspired orchestration
- **Deployment**: Vercel (Edge + Serverless)
- **Payments**: Stripe

### Key Design Principles
1. **User Control**: No AI changes without explicit approval
2. **Transparency**: All decisions logged and traceable
3. **Safety First**: Governance filters on all AI outputs
4. **Performance**: Streaming, caching, edge optimization
5. **Extensibility**: Plugin architecture for new features

### Directory Structure
\`\`\`
sagespace/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # Landing page (route group)
│   ├── api/                # API routes (serverless functions)
│   ├── auth/               # Authentication pages
│   ├── playground/         # 1:1 Sage chat
│   ├── council/            # Multi-Sage deliberation
│   ├── memory/             # Conversation history
│   ├── observatory/        # XP and analytics
│   ├── multiverse/         # Sage browser
│   ├── persona-editor/     # Sage creation (Studio)
│   ├── settings/           # User settings + Adaptive Mode
│   └── demo/               # Dashboard (Hub)
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── navigation/         # CommandBar, navigation
│   └── icons.tsx           # Icon library
├── lib/                    # Utilities and logic
│   ├── ai/                 # AI orchestration and Dreamer
│   ├── governance/         # Safety policies
│   ├── self-healing/       # Error detection
│   ├── supabase/           # Database clients
│   └── types/              # TypeScript types
├── scripts/                # Database migrations (SQL)
└── docs/                   # Documentation
\`\`\`

---

## Self-Evolving System

### Overview

SageSpace's self-evolving architecture has 4 layers:

\`\`\`
User Behavior → Observability → Dreamer AI → Governance → User Approval → Feature Flags
\`\`\`

### 1. Observability Layer

**Purpose**: Collect user interaction signals without invading privacy.

**What's Tracked:**
- Page views and navigation patterns
- Time spent on each page
- Button clicks (navigation, CTAs)
- Friction points (errors, timeouts)
- Success signals (completed flows)

**Implementation:**
\`\`\`typescript
// lib/ai/observability.ts
export class ObservabilityCollector {
  async trackEvent(event: ObservabilityEvent): Promise<void>
  async getEventsSince(userId: string, since: Date): Promise<ObservabilityEvent[]>
  async analyzePatterns(userId: string): Promise<UserPattern>
}
\`\`\`

**Database Table:**
\`\`\`sql
CREATE TABLE observability_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  event_type TEXT, -- 'page_view', 'click', 'error', etc.
  page_path TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ
);
\`\`\`

### 2. Dreamer AI Layer

**Purpose**: Analyze observability data and generate UX improvement proposals.

**How It Works:**
1. Aggregates user behavior patterns
2. Identifies friction points and opportunities
3. Generates specific, actionable proposals
4. Includes expected benefits and reasoning

**Implementation:**
\`\`\`typescript
// lib/ai/dreamer.ts
export class Dreamer {
  async analyzeUser(userId: string): Promise<AnalysisResult>
  async generateProposals(analysis: AnalysisResult): Promise<AIProposal[]>
  async updateMemorySummary(userId: string, insights: string[]): Promise<void>
}
\`\`\`

**Example Proposal:**
\`\`\`typescript
{
  title: "Add Playground Quick Access",
  description: "You visit Playground 80% of the time. Add a quick action button to Hub.",
  category: "navigation",
  expectedBenefit: "Save 2 clicks per session",
  aiReasoning: "User heavily favors Playground over other areas...",
  change: {
    type: "add_component",
    target: "hub_quick_actions",
    config: { path: "/playground", label: "Continue in Playground" }
  }
}
\`\`\`

### 3. Governance Layer

**Purpose**: Filter all AI proposals through safety policies before showing to user.

**10 Governance Policies:**
1. No removal of safety features
2. No data exfiltration
3. Preserve legal requirements
4. Respect privacy settings
5. Maintain core functionality
6. No breaking changes
7. No manipulative patterns
8. Fair monetization only
9. Respect Sage domain boundaries
10. No hallucinated features

**Implementation:**
\`\`\`typescript
// lib/governance/policy.ts
export class GovernanceEngine {
  async evaluateProposal(proposal: AIProposal): Promise<GovernanceResult>
  async getViolations(proposal: AIProposal): Promise<PolicyViolation[]>
  async auditLog(proposal: AIProposal, decision: 'approved' | 'rejected'): Promise<void>
}
\`\`\`

**Blocked Proposal Example:**
\`\`\`typescript
{
  proposal: { title: "Remove logout button" },
  blocked: true,
  violations: [
    {
      policy: "NO_SAFETY_REMOVAL",
      severity: "critical",
      reason: "Logout is a core safety feature"
    }
  ]
}
\`\`\`

### 4. User Approval Layer

**Purpose**: Give users full control over platform evolution.

**UI Location:** Settings → Adaptive Mode

**User Options:**
- **Approve**: Apply immediately via feature flag
- **Reject**: Decline and teach AI preferences
- **Ask Why**: See detailed AI reasoning

**Implementation:**
\`\`\`typescript
// app/api/proposals/approve/route.ts
export async function POST(req: Request) {
  const { proposalId } = await req.json()
  
  // Re-check governance
  const governanceCheck = await governanceEngine.evaluate(proposal)
  if (!governanceCheck.approved) {
    return Response.json({ error: 'Governance violation' }, { status: 403 })
  }
  
  // Apply change via feature flag
  await applyFeatureFlag(userId, proposal.change)
  
  // Award Design Karma
  await awardDesignKarma(userId, 10)
  
  return Response.json({ success: true })
}
\`\`\`

### 5. Feature Flag System

**Purpose**: Apply approved changes without code deploys.

**Database Table:**
\`\`\`sql
CREATE TABLE user_personalization (
  user_id UUID PRIMARY KEY,
  feature_flags JSONB DEFAULT '{}',
  ui_overrides JSONB DEFAULT '{}',
  memory_summary TEXT
);
\`\`\`

**Feature Flag Format:**
\`\`\`json
{
  "playground_quick_access": true,
  "compact_navigation": false,
  "dark_mode_auto": true
}
\`\`\`

**Reading Feature Flags:**
\`\`\`typescript
// In React components
const { featureFlags } = usePersonalization()

{featureFlags.playground_quick_access && (
  <Button onClick={() => router.push('/playground')}>
    Quick Playground Access
  </Button>
)}
\`\`\`

---

## AI Orchestration

### LangGraph-Inspired Architecture

Instead of simple LLM calls, SageSpace uses stateful workflows with error recovery, retries, and fallbacks.

### Core Concepts

**Nodes**: Individual steps in AI workflow  
**Edges**: Transitions between nodes (can be conditional)  
**State**: Shared context across the workflow  
**Tools**: External functions AI can invoke

### Playground Graph

\`\`\`
┌─────────────┐
│ Start       │
└──────┬──────┘
       │
       v
┌──────────────────┐
│ Inject Memory    │ ← Load relevant past conversations
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ Check Domain     │ ← Ensure question fits Sage expertise
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ Generate Reply   │ ← Stream LLM response
└──────┬───────────┘
       │
    ┌──┴─────┐
    │ Success?│
    └──┬──┬──┘
   Yes │  │ No
       │  v
       │ ┌────────────┐
       │ │ Retry with │
       │ │ Fallback   │
       │ └─────┬──────┘
       │       │
       v       v
┌──────────────────┐
│ Save to Memory   │
└──────────────────┘
\`\`\`

### Council Graph

\`\`\`
┌─────────────┐
│ Start       │
└──────┬──────┘
       │
       v
┌────────────────────┐
│ Select Sages       │ ← Choose 3-5 Sages for diversity
└──────┬─────────────┘
       │
       v
┌────────────────────┐
│ Generate Individual│ ← Each Sage responds independently
│ Perspectives       │
└──────┬─────────────┘
       │
       v
┌────────────────────┐
│ Check Consensus    │ ← Are responses aligned?
└──────┬─────────────┘
       │
    ┌──┴──────┐
    │Consensus?│
    └──┬───┬──┘
    Yes│   │No
       │   v
       │ ┌─────────────┐
       │ │ Deliberate  │ ← Sages discuss differences
       │ └──────┬──────┘
       │        │
       v        v
┌────────────────────┐
│ Synthesize Result  │ ← Combine perspectives
└────────────────────┘
\`\`\`

### Implementation

\`\`\`typescript
// lib/ai/orchestration/playground-graph.ts
export class PlaygroundGraph extends AIGraph {
  constructor() {
    super()
    
    this.addNode('inject_memory', this.injectMemory)
    this.addNode('check_domain', this.checkDomain)
    this.addNode('generate', this.generateResponse)
    this.addNode('save_memory', this.saveToMemory)
    
    this.addEdge('START', 'inject_memory')
    this.addEdge('inject_memory', 'check_domain')
    this.addEdge('check_domain', 'generate')
    this.addConditionalEdge('generate', this.shouldRetry, {
      retry: 'generate',
      continue: 'save_memory'
    })
    this.addEdge('save_memory', 'END')
  }
}
\`\`\`

---

## Database Schema

### Core Tables

**users** (managed by Supabase Auth)
\`\`\`sql
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ
);
\`\`\`

**profiles**
\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ
);
\`\`\`

**sage_personas**
\`\`\`sql
CREATE TABLE sage_personas (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT,
  created_by UUID REFERENCES auth.users,
  is_public BOOLEAN DEFAULT false,
  rating DECIMAL(3,2),
  usage_count INTEGER DEFAULT 0
);
\`\`\`

**conversations**
\`\`\`sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  sage_id UUID REFERENCES sage_personas,
  title TEXT,
  mood TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
\`\`\`

**messages**
\`\`\`sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMPTZ
);
\`\`\`

### Personalization Tables

**user_personalization**
\`\`\`sql
CREATE TABLE user_personalization (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  feature_flags JSONB DEFAULT '{}',
  ui_overrides JSONB DEFAULT '{}',
  memory_summary TEXT,
  design_karma INTEGER DEFAULT 0,
  architect_level INTEGER DEFAULT 1,
  review_streak INTEGER DEFAULT 0
);
\`\`\`

**observability_events**
\`\`\`sql
CREATE TABLE observability_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  event_type TEXT,
  page_path TEXT,
  element_id TEXT,
  duration_ms INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ
);
\`\`\`

**ai_proposal_history**
\`\`\`sql
CREATE TABLE ai_proposal_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT,
  description TEXT,
  category TEXT,
  expected_benefit TEXT,
  ai_reasoning TEXT,
  change_payload JSONB,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')),
  governance_approved BOOLEAN,
  created_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ
);
\`\`\`

**self_healing_events**
\`\`\`sql
CREATE TABLE self_healing_events (
  id UUID PRIMARY KEY,
  error_type TEXT,
  error_message TEXT,
  page_path TEXT,
  user_id UUID REFERENCES auth.users,
  ai_diagnosis TEXT,
  proposed_fix TEXT,
  fix_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ
);
\`\`\`

### Row Level Security (RLS)

All tables have RLS enabled:

\`\`\`sql
-- Example: users can only see their own data
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);
\`\`\`

---

## API Reference

### Authentication

**POST /api/auth/signup**
\`\`\`typescript
Request: { email: string, password: string }
Response: { user: User, session: Session }
\`\`\`

**POST /api/auth/login**
\`\`\`typescript
Request: { email: string, password: string }
Response: { user: User, session: Session }
\`\`\`

### Playground

**POST /api/chat**
\`\`\`typescript
Request: {
  messages: Message[],
  sageId: string,
  useOrchestration?: boolean
}
Response: StreamingTextResponse
\`\`\`

### Council

**POST /api/council/deliberate**
\`\`\`typescript
Request: {
  question: string,
  sageIds?: string[], // Auto-selected if omitted
  useOrchestration?: boolean
}
Response: {
  perspectives: SagePerspective[],
  synthesis: string,
  consensus: boolean
}
\`\`\`

### Personalization

**GET /api/personalization**
\`\`\`typescript
Response: {
  featureFlags: Record<string, boolean>,
  uiOverrides: Record<string, any>,
  memorySummary: string
}
\`\`\`

**GET /api/proposals/pending**
\`\`\`typescript
Response: {
  proposals: AIProposal[]
}
\`\`\`

**POST /api/proposals/approve**
\`\`\`typescript
Request: { proposalId: string }
Response: { success: boolean, karmaAwarded: number }
\`\`\`

**POST /api/proposals/reject**
\`\`\`typescript
Request: { proposalId: string, reason?: string }
Response: { success: boolean }
\`\`\`

### Observatory

**GET /api/user/progress**
\`\`\`typescript
Response: {
  xp: number,
  level: number,
  streak: number,
  achievements: Achievement[]
}
\`\`\`

### Self-Healing

**GET /api/self-healing/events**
\`\`\`typescript
Response: {
  events: SelfHealingEvent[]
}
\`\`\`

**POST /api/self-healing/approve-fix**
\`\`\`typescript
Request: { eventId: string }
Response: { success: boolean, fixApplied: boolean }
\`\`\`

---

## Deployment

### Vercel Deployment

1. **Connect GitHub Repository**
\`\`\`bash
vercel link
\`\`\`

2. **Set Environment Variables**
\`\`\`bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GROQ_API_KEY
\`\`\`

3. **Deploy**
\`\`\`bash
vercel --prod
\`\`\`

### Database Migrations

Run in order:
\`\`\`bash
psql $DATABASE_URL -f scripts/000-initialize-database.sql
psql $DATABASE_URL -f scripts/001-personas.sql
psql $DATABASE_URL -f scripts/002-conversations.sql
# ... etc
psql $DATABASE_URL -f scripts/013-user-personalization.sql
\`\`\`

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Logs**: Database query performance
- **Custom Logging**: Structured logs in `/lib/utils/logger.ts`

---

## Contributing

### Development Setup

1. Clone repository
\`\`\`bash
git clone https://github.com/sagespace-ai/sagespace.git
cd sagespace
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment
\`\`\`bash
cp .env.example .env.local
# Fill in your environment variables
\`\`\`

4. Run migrations
\`\`\`bash
npm run db:migrate
\`\`\`

5. Start development server
\`\`\`bash
npm run dev
\`\`\`

### Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Components**: Use shadcn/ui patterns
- **State**: Prefer server components over client
- **Styling**: Tailwind CSS only

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and test locally
3. Ensure all tests pass
4. Update documentation if needed
5. Submit PR with clear description
6. Address review feedback
7. Merge after approval

### Testing

\`\`\`bash
npm test              # Run all tests
npm test:watch        # Watch mode
npm test:coverage     # Coverage report
\`\`\`

---

## Need Help?

- **User Guide**: `/docs/USER_GUIDE.md`
- **Success Criteria**: `/docs/SUCCESS_CRITERIA.md`
- **Support**: support@sagespace.ai
- **GitHub Issues**: https://github.com/sagespace-ai/sagespace/issues

---

**Built with care by the SageSpace team**
