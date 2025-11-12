import { ChatGroq } from "@langchain/groq"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import type { PlanStep, MessageEnvelope } from "@/lib/types"

export async function executeCreatorAgent(step: PlanStep, taskId: string): Promise<MessageEnvelope> {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
  })

  const systemPrompt = new SystemMessage(
    `You are a Creator Agent in SageSpace. Your role is to draft responses, compose content, and generate artifacts.
    
Operate under the Five Laws, emphasizing Harmony - create content that aligns with the ecosystem's ethical standards.`,
  )

  const userPrompt = new HumanMessage(`Creation task: ${step.action}\nCriteria: ${step.acceptanceCriteria}`)

  const response = await model.invoke([systemPrompt, userPrompt])

  const envelope: MessageEnvelope = {
    taskId,
    actor: "creator",
    intent: "compose",
    inputs: { action: step.action },
    outputs: {
      claims: [response.content.toString()],
      artifacts: [{ type: "text", content: response.content.toString() }],
      citations: [],
    },
    risk: {
      pii: [],
      licensing: "ok",
      hallucination: 0.4,
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
    confidence: 0.8,
    signature: generateSignature({ taskId, actor: "creator" }),
    createdAt: new Date(),
  }

  return envelope
}

function generateSignature(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString("base64").substring(0, 32)
}
