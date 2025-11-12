import { ChatGroq } from "@langchain/groq"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import type { Agent } from "@/lib/types"

export type AgentMessageType = "request" | "response" | "broadcast" | "query" | "data" | "decision"

export type AgentMessage = {
  id: string
  fromAgentId: string
  fromAgentName: string
  toAgentId: string | null
  toAgentName?: string
  messageType: AgentMessageType
  content: string
  context?: any
  requiresResponse: boolean
  timestamp: Date
}

export type CollaborationTrigger = {
  keywords: string[]
  threshold: "moral" | "technical" | "creative" | "safety" | "complex"
  minConfidence: number
}

export type CollaborationResult = {
  conversationId: string
  messages: AgentMessage[]
  outcome: string
  confidence: number
  consensusReached: boolean
}

const COLLABORATION_PROMPTS = {
  ethics: `You are collaborating with another agent on an ethical dilemma. Consider the Five Laws of SageSpace and provide your perspective on the moral implications.`,
  technical: `You are collaborating with another agent on a technical problem. Provide your expertise and analysis to help reach a solution.`,
  creative: `You are collaborating with another agent on a creative challenge. Share innovative ideas and build upon each other's suggestions.`,
  safety: `You are collaborating with another agent on a safety review. Critically evaluate risks and propose safeguards.`,
  complex: `You are collaborating with another agent on a complex problem. Break down the issue and work together toward a comprehensive solution.`,
}

export async function detectCollaborationTrigger(
  userQuery: string,
  primaryAgent: Agent,
): Promise<{ shouldCollaborate: boolean; trigger?: CollaborationTrigger; recommendedAgents?: string[] }> {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.3,
  })

  const prompt = new SystemMessage(`You are a collaboration detection system in SageSpace.

Analyze the user query to determine if it crosses thresholds that require multiple agents:

Thresholds:
- MORAL: Contains ethical dilemmas, questions of right/wrong, fairness, justice
- TECHNICAL: Requires specialized expertise across multiple domains
- CREATIVE: Benefits from diverse creative perspectives
- SAFETY: Has potential risks or requires safety review
- COMPLEX: Multi-faceted problem requiring different viewpoints

Respond in JSON format:
{
  "shouldCollaborate": boolean,
  "trigger": {
    "keywords": ["keyword1", "keyword2"],
    "threshold": "moral|technical|creative|safety|complex",
    "minConfidence": 0.0-1.0
  },
  "recommendedAgents": ["Ethics Advisor", "Safety Monitor", etc.],
  "reasoning": "Why collaboration is needed"
}`)

  try {
    const response = await model.invoke([
      prompt,
      new HumanMessage(`Primary Agent: ${primaryAgent.name} (${primaryAgent.role})
Query: ${userQuery}

Should this trigger agent collaboration?`),
    ])

    const analysis = JSON.parse(response.content.toString())
    return analysis
  } catch (error) {
    console.error("[v0] Error detecting collaboration trigger:", error)
    return { shouldCollaborate: false }
  }
}

export async function conductAgentCollaboration(
  query: string,
  primaryAgent: Agent,
  collaboratingAgents: Agent[],
  trigger: CollaborationTrigger,
): Promise<CollaborationResult> {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
  })

  const messages: AgentMessage[] = []
  const conversationId = `collab-${Date.now()}`

  // Phase 1: Primary agent initiates
  console.log(`[v0] ${primaryAgent.name} initiating collaboration`)

  const primaryPrompt = new SystemMessage(`You are ${primaryAgent.name}, a ${primaryAgent.role}.

You need to collaborate with other agents on this query: "${query}"

${COLLABORATION_PROMPTS[trigger.threshold] || COLLABORATION_PROMPTS.complex}

Initiate the collaboration by:
1. Stating the problem clearly
2. Explaining why you need collaboration
3. Asking specific questions to the other agents

Be concise and collaborative.`)

  const primaryResponse = await model.invoke([primaryPrompt, new HumanMessage(query)])

  messages.push({
    id: `msg-${Date.now()}-1`,
    fromAgentId: primaryAgent.id,
    fromAgentName: primaryAgent.name,
    toAgentId: null, // broadcast
    messageType: "broadcast",
    content: primaryResponse.content.toString(),
    requiresResponse: true,
    timestamp: new Date(),
  })

  // Phase 2: Collaborating agents respond
  console.log(`[v0] ${collaboratingAgents.length} agents responding`)

  for (const agent of collaboratingAgents) {
    const agentPrompt = new SystemMessage(`You are ${agent.name}, a ${agent.role}.

${primaryAgent.name} has requested your collaboration:
"${primaryResponse.content}"

Original query: "${query}"

${COLLABORATION_PROMPTS[trigger.threshold] || COLLABORATION_PROMPTS.complex}

Provide your perspective, expertise, or analysis. Be specific and actionable.`)

    const agentResponse = await model.invoke([agentPrompt, new HumanMessage("Respond to the collaboration request.")])

    messages.push({
      id: `msg-${Date.now()}-${agent.id}`,
      fromAgentId: agent.id,
      fromAgentName: agent.name,
      toAgentId: primaryAgent.id,
      toAgentName: primaryAgent.name,
      messageType: "response",
      content: agentResponse.content.toString(),
      requiresResponse: false,
      timestamp: new Date(),
    })
  }

  // Phase 3: Primary agent synthesizes
  console.log(`[v0] ${primaryAgent.name} synthesizing responses`)

  const collaboratorResponses = messages
    .filter((m) => m.fromAgentId !== primaryAgent.id)
    .map((m) => `${m.fromAgentName}: ${m.content}`)
    .join("\n\n")

  const synthesisPrompt = new SystemMessage(`You are ${primaryAgent.name}, a ${primaryAgent.role}.

You asked for collaboration and received these responses:

${collaboratorResponses}

Now synthesize the insights into a comprehensive answer for the user's original query: "${query}"

Provide:
1. Integrated solution or recommendation
2. Key insights from each collaborator
3. Final confidence level (0.0-1.0)
4. Any remaining concerns or caveats

Format as JSON:
{
  "outcome": "Your synthesized answer",
  "confidence": 0.0-1.0,
  "consensusReached": boolean,
  "keyInsights": ["insight1", "insight2"]
}`)

  const synthesisResponse = await model.invoke([synthesisPrompt, new HumanMessage("Synthesize the collaboration.")])

  const synthesis = JSON.parse(synthesisResponse.content.toString())

  messages.push({
    id: `msg-${Date.now()}-final`,
    fromAgentId: primaryAgent.id,
    fromAgentName: primaryAgent.name,
    toAgentId: null,
    messageType: "decision",
    content: synthesis.outcome,
    context: synthesis,
    requiresResponse: false,
    timestamp: new Date(),
  })

  return {
    conversationId,
    messages,
    outcome: synthesis.outcome,
    confidence: synthesis.confidence,
    consensusReached: synthesis.consensusReached,
  }
}

export async function autoDetectAndCollaborate(
  query: string,
  primaryAgent: Agent,
  availableAgents: Agent[],
): Promise<{ collaborated: boolean; result?: CollaborationResult }> {
  // Detect if collaboration is needed
  const detection = await detectCollaborationTrigger(query, primaryAgent)

  if (!detection.shouldCollaborate) {
    return { collaborated: false }
  }

  console.log(`[v0] Collaboration triggered: ${detection.trigger?.threshold}`)

  // Find recommended collaborating agents
  const collaborators = availableAgents.filter(
    (agent) =>
      agent.id !== primaryAgent.id &&
      detection.recommendedAgents?.some((name) => agent.name.includes(name) || agent.role.includes(name)),
  )

  if (collaborators.length === 0) {
    // Use top 2 agents by harmony score as fallback
    collaborators.push(
      ...availableAgents
        .filter((a) => a.id !== primaryAgent.id)
        .sort((a, b) => (b.harmony_score || 0) - (a.harmony_score || 0))
        .slice(0, 2),
    )
  }

  console.log(`[v0] Collaborating with: ${collaborators.map((a) => a.name).join(", ")}`)

  // Conduct collaboration
  const result = await conductAgentCollaboration(
    query,
    primaryAgent,
    collaborators,
    detection.trigger || { keywords: [], threshold: "complex", minConfidence: 0.5 },
  )

  return { collaborated: true, result }
}
