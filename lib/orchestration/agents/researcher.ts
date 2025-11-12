import { ChatGroq } from "@langchain/groq"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import type { PlanStep, MessageEnvelope } from "@/lib/types"

export async function executeResearcherAgent(step: PlanStep, taskId: string): Promise<MessageEnvelope> {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.5,
  })

  const systemPrompt = new SystemMessage(
    `You are a Researcher Agent in SageSpace. Your role is to gather information, verify facts, and provide well-sourced insights.
    
Operate under the Five Laws, especially Transparency - always cite sources and indicate confidence levels.`,
  )

  const userPrompt = new HumanMessage(`Research task: ${step.action}\nCriteria: ${step.acceptanceCriteria}`)

  const response = await model.invoke([systemPrompt, userPrompt])

  const content = response.content.toString()

  // Simple PII detection (in production, use sophisticated NER/PII detection)
  const piiPatterns = [/\b\d{3}-\d{2}-\d{4}\b/, /\b[\w.-]+@[\w.-]+\.\w+\b/]
  const detectedPII = piiPatterns.filter((pattern) => pattern.test(content)).map((_, i) => ["ssn", "email"][i])

  const envelope: MessageEnvelope = {
    taskId,
    actor: "researcher",
    intent: "retrieve",
    inputs: { action: step.action },
    outputs: {
      claims: [content],
      artifacts: [],
      citations: ["LLM-generated response"],
    },
    risk: {
      pii: detectedPII,
      licensing: "ok",
      hallucination: 0.3, // Estimate
      safetyFlags: [],
    },
    policy: {
      id: "default-policy",
      version: "1.0.0",
    },
    provenance: {
      tools: ["groq-mixtral"],
      timestamps: { started: new Date(), completed: new Date() },
    },
    confidence: 0.75,
    signature: generateSignature({ taskId, actor: "researcher" }),
    createdAt: new Date(),
  }

  return envelope
}

function generateSignature(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString("base64").substring(0, 32)
}
