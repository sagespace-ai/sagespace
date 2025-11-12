import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { ChatGroq } from "@langchain/groq"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"

export type MemoryType = "preference" | "fact" | "interaction" | "learning" | "feedback" | "context"

export type AgentMemory = {
  id: string
  agentId: string
  userId: string | null
  memoryType: MemoryType
  content: string
  context?: any
  importance: number
  accessCount: number
  createdAt: Date
}

export type UserPreference = {
  userId: string
  agentId: string
  key: string
  value: any
  confidence: number
  timesReinforced: number
}

export type LearningEvent = {
  agentId: string
  eventType: "skill_acquired" | "preference_learned" | "pattern_recognized" | "error_corrected" | "feedback_received"
  description: string
  beforeState?: any
  afterState?: any
  confidence: number
  source?: string
}

export async function storeMemory(
  agentId: string,
  userId: string | null,
  memoryType: MemoryType,
  content: string,
  context?: any,
  importance = 0.5,
): Promise<void> {
  const supabase = createServiceRoleClient()

  await supabase.from("agent_memories").insert({
    agent_id: agentId,
    user_id: userId,
    memory_type: memoryType,
    content,
    context,
    importance,
    access_count: 0,
  })

  console.log(`[v0] Stored ${memoryType} memory for agent ${agentId}`)
}

export async function retrieveRelevantMemories(
  agentId: string,
  userId: string | null,
  query: string,
  limit = 5,
): Promise<AgentMemory[]> {
  const supabase = createServiceRoleClient()

  // Retrieve memories for this agent and user
  let queryBuilder = supabase
    .from("agent_memories")
    .select("*")
    .eq("agent_id", agentId)
    .order("importance", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit * 2) // Get more than needed for filtering

  if (userId) {
    queryBuilder = queryBuilder.or(`user_id.eq.${userId},user_id.is.null`)
  } else {
    queryBuilder = queryBuilder.is("user_id", null)
  }

  const { data: memories, error } = await queryBuilder

  if (error) {
    console.error("[v0] Error retrieving memories:", error)
    return []
  }

  if (!memories || memories.length === 0) return []

  // Use LLM to rank relevance
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.1,
  })

  const prompt = new SystemMessage(`You are a memory relevance scorer.

Given a query and a list of memories, score each memory's relevance to the query from 0.0 to 1.0.

Respond in JSON format:
{
  "scores": [0.8, 0.3, 0.9, ...]
}

The array length must match the number of memories provided.`)

  const memoriesText = memories.map((m, i) => `${i}. [${m.memory_type}] ${m.content}`).join("\n")

  try {
    const response = await model.invoke([
      prompt,
      new HumanMessage(`Query: ${query}\n\nMemories:\n${memoriesText}\n\nScore each memory's relevance:`),
    ])

    const { scores } = JSON.parse(response.content.toString())

    // Combine memories with scores
    const rankedMemories = memories
      .map((memory, i) => ({
        ...memory,
        relevanceScore: scores[i] || 0,
      }))
      .filter((m) => m.relevanceScore > 0.3) // Filter low relevance
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)

    // Update access counts
    for (const memory of rankedMemories) {
      await supabase
        .from("agent_memories")
        .update({
          access_count: (memory.access_count || 0) + 1,
          last_accessed_at: new Date().toISOString(),
        })
        .eq("id", memory.id)
    }

    console.log(`[v0] Retrieved ${rankedMemories.length} relevant memories for query: ${query.substring(0, 50)}`)

    return rankedMemories as AgentMemory[]
  } catch (error) {
    console.error("[v0] Error ranking memories:", error)
    // Fallback: return by importance
    return memories.slice(0, limit) as AgentMemory[]
  }
}

export async function learnUserPreference(
  userId: string,
  agentId: string,
  preferenceKey: string,
  preferenceValue: any,
  confidence = 0.7,
  source?: string,
): Promise<void> {
  const supabase = createServiceRoleClient()

  // Check if preference already exists
  const { data: existing } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .eq("preference_key", preferenceKey)
    .single()

  if (existing) {
    // Update and reinforce
    await supabase
      .from("user_preferences")
      .update({
        preference_value: preferenceValue,
        confidence: Math.min(1.0, existing.confidence + 0.1),
        times_reinforced: existing.times_reinforced + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)

    console.log(`[v0] Reinforced user preference: ${preferenceKey}`)
  } else {
    // Create new preference
    await supabase.from("user_preferences").insert({
      user_id: userId,
      agent_id: agentId,
      preference_key: preferenceKey,
      preference_value: preferenceValue,
      confidence,
      learned_from: source,
      times_reinforced: 1,
    })

    console.log(`[v0] Learned new user preference: ${preferenceKey}`)
  }

  // Log learning event
  await logLearningEvent(
    agentId,
    "preference_learned",
    `Learned user preference: ${preferenceKey}`,
    null,
    preferenceValue,
    confidence,
    source,
  )
}

export async function getUserPreferences(userId: string, agentId: string): Promise<UserPreference[]> {
  const supabase = createServiceRoleClient()

  const { data: preferences, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .order("confidence", { ascending: false })

  if (error) {
    console.error("[v0] Error retrieving preferences:", error)
    return []
  }

  return (preferences || []) as UserPreference[]
}

export async function logLearningEvent(
  agentId: string,
  eventType: LearningEvent["eventType"],
  description: string,
  beforeState: any = null,
  afterState: any = null,
  confidence = 0.8,
  source?: string,
): Promise<void> {
  const supabase = createServiceRoleClient()

  await supabase.from("agent_learning_events").insert({
    agent_id: agentId,
    event_type: eventType,
    description,
    before_state: beforeState,
    after_state: afterState,
    confidence,
    source,
  })

  console.log(`[v0] Logged learning event for agent ${agentId}: ${eventType}`)
}

export async function evolveAgent(
  agentId: string,
  changes: any,
  reason: string,
  harmonyScoreDelta = 0,
  ethicsAlignmentDelta = 0,
): Promise<void> {
  const supabase = createServiceRoleClient()

  // Get current version
  const { data: versions } = await supabase
    .from("agent_evolution")
    .select("version")
    .eq("agent_id", agentId)
    .order("version", { ascending: false })
    .limit(1)

  const nextVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1

  // Log evolution
  await supabase.from("agent_evolution").insert({
    agent_id: agentId,
    version: nextVersion,
    changes,
    reason,
    harmony_score_delta: harmonyScoreDelta,
    ethics_alignment_delta: ethicsAlignmentDelta,
  })

  // Update agent scores
  if (harmonyScoreDelta !== 0 || ethicsAlignmentDelta !== 0) {
    const { data: agent } = await supabase.from("agents").select("*").eq("id", agentId).single()

    if (agent) {
      await supabase
        .from("agents")
        .update({
          harmony_score: Math.max(0, Math.min(100, (agent.harmony_score || 75) + harmonyScoreDelta)),
          ethics_alignment: Math.max(0, Math.min(100, (agent.ethics_alignment || 85) + ethicsAlignmentDelta)),
        })
        .eq("id", agentId)
    }
  }

  console.log(`[v0] Agent ${agentId} evolved to version ${nextVersion}`)
}

export async function extractLearnableInsights(
  agentId: string,
  userId: string | null,
  conversationMessages: Array<{ role: string; content: string }>,
): Promise<void> {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.3,
  })

  const conversationText = conversationMessages.map((m) => `${m.role}: ${m.content}`).join("\n")

  const prompt = new SystemMessage(`You are a learning extraction system for SageSpace agents.

Analyze the conversation and extract learnable insights in these categories:

1. USER PREFERENCES - What the user likes, dislikes, or prefers
2. FACTS - Factual information that should be remembered
3. PATTERNS - Recurring themes or patterns in user behavior
4. FEEDBACK - Direct or indirect feedback about agent performance

Respond in JSON format:
{
  "preferences": [
    {"key": "communication_style", "value": "concise", "confidence": 0.8}
  ],
  "facts": [
    {"content": "User works in healthcare", "importance": 0.7}
  ],
  "patterns": [
    {"content": "User asks technical questions in the morning", "importance": 0.6}
  ],
  "feedback": [
    {"content": "User appreciated detailed explanations", "importance": 0.8}
  ]
}`)

  try {
    const response = await model.invoke([prompt, new HumanMessage(`Conversation:\n${conversationText}`)])

    const insights = JSON.parse(response.content.toString())

    // Store preferences
    if (userId && insights.preferences) {
      for (const pref of insights.preferences) {
        await learnUserPreference(userId, agentId, pref.key, pref.value, pref.confidence)
      }
    }

    // Store facts
    if (insights.facts) {
      for (const fact of insights.facts) {
        await storeMemory(agentId, userId, "fact", fact.content, null, fact.importance)
      }
    }

    // Store patterns
    if (insights.patterns) {
      for (const pattern of insights.patterns) {
        await storeMemory(agentId, userId, "learning", pattern.content, null, pattern.importance)
        await logLearningEvent(agentId, "pattern_recognized", pattern.content, null, null, pattern.importance)
      }
    }

    // Store feedback
    if (insights.feedback) {
      for (const fb of insights.feedback) {
        await storeMemory(agentId, userId, "feedback", fb.content, null, fb.importance)
        await logLearningEvent(agentId, "feedback_received", fb.content, null, null, fb.importance)
      }
    }

    console.log(`[v0] Extracted and stored learnable insights for agent ${agentId}`)
  } catch (error) {
    console.error("[v0] Error extracting insights:", error)
  }
}
