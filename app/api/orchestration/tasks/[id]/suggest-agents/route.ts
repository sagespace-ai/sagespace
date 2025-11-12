import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { type NextRequest, NextResponse } from "next/server"
import { ChatGroq } from "@langchain/groq"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceRoleClient()

    // Fetch task
    const { data: task, error: taskError } = await supabase.from("tasks").select("*").eq("id", params.id).single()

    if (taskError) throw taskError

    // Fetch all available agents
    const { data: agents, error: agentsError } = await supabase.from("agents").select("*")

    if (agentsError) throw agentsError

    // Use LLM to suggest best agents
    const model = new ChatGroq({
      apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
      model: "mixtral-8x7b-32768",
      temperature: 0.2,
    })

    const systemPrompt = new SystemMessage(`You are an agent assignment system in SageSpace.
Analyze the task and available agents to recommend the best agents for the job.

Return JSON with this structure:
{
  "recommendations": [
    {
      "agentId": "uuid",
      "agentName": "name",
      "role": "role",
      "reasoning": "why this agent is suitable",
      "confidenceScore": 0.0-1.0
    }
  ]
}

Consider:
- Agent roles and expertise
- Task requirements and complexity
- Harmony score for collaboration
- Ethics alignment for governance`)

    const userPrompt = new HumanMessage(`Task Intent: ${task.intent}
Task Priority: ${task.priority}
Requires Pre-Approval: ${task.requires_pre_approval}

Available Agents:
${agents.map((a) => `- ${a.name} (${a.role}): ${a.description || a.purpose}`).join("\n")}`)

    const response = await model.invoke([systemPrompt, userPrompt])
    const suggestions = JSON.parse(response.content.toString())

    return NextResponse.json(suggestions)
  } catch (error: any) {
    console.error("[v0] Error suggesting agents:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
