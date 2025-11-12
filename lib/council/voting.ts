import { ChatGroq } from "@langchain/groq"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import type { Agent } from "@/lib/types"

export type VoteType = "approve" | "reject" | "abstain" | "conditional"

export type AgentDeliberation = {
  agentId: string
  agentName: string
  phase: "analysis" | "deliberation" | "voting" | "reflection"
  content: string
  reasoning: string
  confidence: number
  citedLaws: string[]
}

export type AgentVote = {
  agentId: string
  agentName: string
  vote: VoteType
  reasoning: string
  confidence: number
  conditions?: string[]
  weight: number
}

export type CouncilResult = {
  totalVotes: number
  approveCount: number
  rejectCount: number
  abstainCount: number
  conditionalCount: number
  weightedApproval: number
  consensusReached: boolean
  finalRecommendation: string
  deliberations: AgentDeliberation[]
  votes: AgentVote[]
}

const FIVE_LAWS = `
1. Human Primacy - Humans maintain ultimate authority over all agent actions
2. Autonomy - Agents have genuine independence within defined ethical boundaries
3. Transparency - All agent actions, reasoning, and data usage must be verifiable
4. Harmony - Agents work cohesively with other agents and humans
5. Equilibrium - Balance agency with human control to prevent dominance
`

export async function conductCouncilVoting(
  query: string,
  agents: Agent[],
  consensusThreshold = 0.66,
): Promise<CouncilResult> {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
  })

  const deliberations: AgentDeliberation[] = []
  const votes: AgentVote[] = []

  // Phase 1: Each agent analyzes the query independently
  console.log("[v0] Phase 1: Independent Analysis")
  for (const agent of agents) {
    const analysisPrompt = new SystemMessage(`You are ${agent.name}, a ${agent.role} in the SageSpace Council.

You are analyzing a query that requires collective wisdom from multiple agents.

The Five Laws of SageSpace:
${FIVE_LAWS}

Your role: ${agent.purpose || agent.description || "Provide thoughtful analysis"}
Your harmony score: ${agent.harmony_score || 75}%
Your ethics alignment: ${agent.ethics_alignment || 85}%

Provide a thorough analysis of the query from your unique perspective. Consider:
- Ethical implications based on the Five Laws
- Technical feasibility and risks
- Impact on human autonomy and agency
- Alignment with SageSpace principles

Be honest and rigorous in your analysis.`)

    const response = await model.invoke([analysisPrompt, new HumanMessage(`Query: ${query}`)])

    deliberations.push({
      agentId: agent.id,
      agentName: agent.name,
      phase: "analysis",
      content: response.content.toString(),
      reasoning: `Analysis from ${agent.role} perspective`,
      confidence: 0.8,
      citedLaws: extractCitedLaws(response.content.toString()),
    })
  }

  // Phase 2: Deliberation - agents discuss with each other
  console.log("[v0] Phase 2: Collective Deliberation")
  const analysisContext = deliberations
    .map((d) => `${d.agentName} (${agents.find((a) => a.id === d.agentId)?.role}): ${d.content}`)
    .join("\n\n")

  for (const agent of agents) {
    const deliberationPrompt = new SystemMessage(`You are ${agent.name}, a ${agent.role} in the SageSpace Council.

You have heard the analysis from other council members. Now engage in deliberation.

Other agents' analyses:
${analysisContext}

Consider:
- Points of agreement and disagreement
- Overlooked perspectives
- Potential compromises or conditions
- How to balance competing concerns

Provide your deliberation, acknowledging other viewpoints while maintaining your role's perspective.`)

    const response = await model.invoke([deliberationPrompt, new HumanMessage(`Original query: ${query}`)])

    deliberations.push({
      agentId: agent.id,
      agentName: agent.name,
      phase: "deliberation",
      content: response.content.toString(),
      reasoning: `Deliberation incorporating ${agents.length - 1} other perspectives`,
      confidence: 0.85,
      citedLaws: extractCitedLaws(response.content.toString()),
    })
  }

  // Phase 3: Voting - each agent casts their vote
  console.log("[v0] Phase 3: Voting")
  for (const agent of agents) {
    const votingPrompt = new SystemMessage(`You are ${agent.name}, a ${agent.role} in the SageSpace Council.

After thorough analysis and deliberation, you must now cast your vote on:
"${query}"

Vote options:
- APPROVE: The query aligns with the Five Laws and should proceed
- REJECT: The query violates one or more laws and should not proceed
- CONDITIONAL: Approve with specific conditions that must be met
- ABSTAIN: Insufficient information or conflicting principles

Respond in JSON format:
{
  "vote": "approve|reject|conditional|abstain",
  "reasoning": "Your detailed reasoning",
  "confidence": 0.0-1.0,
  "conditions": ["condition1", "condition2"] // Only if conditional
}`)

    const response = await model.invoke([votingPrompt, new HumanMessage("Cast your vote now.")])

    try {
      const voteData = JSON.parse(response.content.toString())
      votes.push({
        agentId: agent.id,
        agentName: agent.name,
        vote: voteData.vote,
        reasoning: voteData.reasoning,
        confidence: voteData.confidence,
        conditions: voteData.conditions,
        weight: calculateVoteWeight(agent),
      })
    } catch (error) {
      console.error(`[v0] Failed to parse vote from ${agent.name}:`, error)
      votes.push({
        agentId: agent.id,
        agentName: agent.name,
        vote: "abstain",
        reasoning: "Failed to provide valid vote format",
        confidence: 0,
        weight: 0,
      })
    }
  }

  // Calculate results
  const result = calculateVoteResults(votes, consensusThreshold, deliberations)

  return result
}

function extractCitedLaws(content: string): string[] {
  const laws = []
  if (content.toLowerCase().includes("human primacy")) laws.push("Human Primacy")
  if (content.toLowerCase().includes("autonomy")) laws.push("Autonomy")
  if (content.toLowerCase().includes("transparency")) laws.push("Transparency")
  if (content.toLowerCase().includes("harmony")) laws.push("Harmony")
  if (content.toLowerCase().includes("equilibrium")) laws.push("Equilibrium")
  return laws
}

function calculateVoteWeight(agent: Agent): number {
  // Weight based on harmony score and ethics alignment
  const harmonyWeight = (agent.harmony_score || 75) / 100
  const ethicsWeight = (agent.ethics_alignment || 85) / 100
  return (harmonyWeight + ethicsWeight) / 2
}

function calculateVoteResults(
  votes: AgentVote[],
  consensusThreshold: number,
  deliberations: AgentDeliberation[],
): CouncilResult {
  const totalVotes = votes.length
  const approveCount = votes.filter((v) => v.vote === "approve").length
  const rejectCount = votes.filter((v) => v.vote === "reject").length
  const abstainCount = votes.filter((v) => v.vote === "abstain").length
  const conditionalCount = votes.filter((v) => v.vote === "conditional").length

  // Calculate weighted approval (approve + conditional weighted by confidence)
  const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0)
  const approvalWeight = votes
    .filter((v) => v.vote === "approve" || v.vote === "conditional")
    .reduce((sum, v) => sum + v.weight * v.confidence, 0)

  const weightedApproval = totalWeight > 0 ? approvalWeight / totalWeight : 0
  const consensusReached = weightedApproval >= consensusThreshold

  // Generate final recommendation
  let finalRecommendation = ""
  if (consensusReached) {
    if (conditionalCount > 0) {
      const conditions = votes
        .filter((v) => v.vote === "conditional" && v.conditions)
        .flatMap((v) => v.conditions || [])
      finalRecommendation = `Council recommends CONDITIONAL APPROVAL. Conditions: ${conditions.join("; ")}`
    } else {
      finalRecommendation = `Council recommends APPROVAL. Weighted consensus: ${(weightedApproval * 100).toFixed(1)}%`
    }
  } else {
    if (rejectCount > approveCount) {
      finalRecommendation = `Council recommends REJECTION. ${rejectCount} agents voted to reject.`
    } else {
      finalRecommendation = `Council could not reach consensus. Weighted approval: ${(weightedApproval * 100).toFixed(1)}%`
    }
  }

  return {
    totalVotes,
    approveCount,
    rejectCount,
    abstainCount,
    conditionalCount,
    weightedApproval,
    consensusReached,
    finalRecommendation,
    deliberations,
    votes,
  }
}
