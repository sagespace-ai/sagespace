import { ChatGroq } from "@langchain/groq"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import type { PlanStep, MessageEnvelope } from "@/lib/types"

export async function executeCriticAgent(step: PlanStep, taskId: string): Promise<MessageEnvelope> {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.2, // Low temperature for critical analysis
  })

  const systemPrompt = new SystemMessage(
    `You are a Critic Agent in SageSpace. Your role is to fact-check claims, identify potential errors, and flag concerns.
    
Operate under the Five Laws, especially Transparency and Human Primacy - surface issues that require human judgment.`,
  )

  const userPrompt = new HumanMessage(`Review and critique: ${step.action}\nCriteria: ${step.acceptanceCriteria}`)

  const response = await model.invoke([systemPrompt, userPrompt])

  const content = response.content.toString()

  // Check for concerning keywords
  const safetyFlags: string[] = []
  if (content.toLowerCase().includes("error") || content.toLowerCase().includes("concern")) {
    safetyFlags.push("potential_issue_detected")
  }

  const envelope: MessageEnvelope = {
    taskId,
    actor: "critic",
    intent: "verify",
    inputs: { action: step.action },
    outputs: {
      claims: [content],
      artifacts: [],
      citations: [],
    },
    risk: {
      pii: [],
      licensing: "ok",
      hallucination: 0.2,
      safetyFlags,
    },
    policy: {
      id: "default-policy",
      version: "1.0.0",
    },
    provenance: {
      tools: ["groq-mixtral"],
      timestamps: { started: new Date(), completed: new Date() },
    },
    confidence: 0.85,
    signature: generateSignature({ taskId, actor: "critic" }),
    createdAt: new Date(),
  }

  return envelope
}

function generateSignature(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString("base64").substring(0, 32)
}
