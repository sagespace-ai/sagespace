import { ChatGroq } from "@langchain/groq"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import type { MessageEnvelope } from "@/lib/types"

export async function executeJudgeAgent(envelopes: MessageEnvelope[], taskId: string): Promise<MessageEnvelope> {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.3,
  })

  const systemPrompt = new SystemMessage(
    `You are a Judge Agent in SageSpace. Your role is to resolve conflicts, consolidate results, and make final determinations.
    
Operate under the Five Laws, emphasizing Equilibrium - balance different perspectives to reach optimal decisions.`,
  )

  const claims = envelopes.map((e, i) => `Agent ${i + 1} (${e.actor}): ${e.outputs?.claims.join(", ")}`).join("\n")

  const userPrompt = new HumanMessage(`Consolidate these perspectives and provide a final answer:\n${claims}`)

  const response = await model.invoke([systemPrompt, userPrompt])

  const envelope: MessageEnvelope = {
    taskId,
    actor: "judge",
    intent: "adjudicate",
    inputs: { envelopeCount: envelopes.length },
    outputs: {
      claims: [response.content.toString()],
      artifacts: [],
      citations: envelopes.flatMap((e) => e.outputs?.citations || []),
    },
    risk: {
      pii: [],
      licensing: "ok",
      hallucination: 0.25,
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
    confidence: 0.9,
    signature: generateSignature({ taskId, actor: "judge" }),
    createdAt: new Date(),
  }

  return envelope
}

function generateSignature(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString("base64").substring(0, 32)
}
