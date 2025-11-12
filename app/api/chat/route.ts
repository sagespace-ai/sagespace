import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { groq } from "@ai-sdk/groq"
import { retrieveRelevantMemories, extractLearnableInsights, getUserPreferences } from "@/lib/memory/agent-memory"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const {
      messages,
      agentId,
      agentName,
      agentRole,
      model = "grok-3",
      provider = "xai",
      enableCollaboration = false,
      enableMemory = true,
    } = await request.json()

    console.log(
      "[v0] Chat request - agentId:",
      agentId,
      "agentName:",
      agentName,
      "model:",
      model,
      "provider:",
      provider,
      "enableCollaboration:",
      enableCollaboration,
      "enableMemory:",
      enableMemory,
    )

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let agent = null
    if (agentId || agentName) {
      const serviceSupabase = createServiceRoleClient()

      if (agentName) {
        console.log("[v0] Trying to fetch agent by name:", agentName)
        const { data, error } = await serviceSupabase.from("agents").select("*").eq("name", agentName).limit(1)

        if (data && data.length > 0) {
          agent = data[0]
          console.log("[v0] Found agent by name:", agent.name)
        } else {
          console.log("[v0] No agent found by name, error:", error)
        }
      }

      if (!agent && agentId && agentId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log("[v0] Trying to fetch agent by UUID:", agentId)
        const { data, error } = await serviceSupabase.from("agents").select("*").eq("id", agentId).limit(1)

        if (data && data.length > 0) {
          agent = data[0]
          console.log("[v0] Found agent by UUID:", agent.name)
        } else {
          console.log("[v0] No agent found by UUID, error:", error)
        }
      }
    }

    if (enableCollaboration && agent) {
      const lastUserMessage = messages[messages.length - 1]?.content
      if (lastUserMessage) {
        console.log("[v0] Checking for collaboration triggers...")

        try {
          const collabResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/chat/collaborate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: lastUserMessage,
                primaryAgentId: agent.id,
              }),
            },
          )

          const collabData = await collabResponse.json()

          if (collabData.collaborated && collabData.result) {
            console.log("[v0] Collaboration occurred! Returning collaborative response")
            // Return the collaborative outcome instead of single agent response
            return new Response(
              JSON.stringify({
                type: "collaboration",
                outcome: collabData.result.outcome,
                messages: collabData.result.messages,
                confidence: collabData.result.confidence,
              }),
              {
                headers: { "Content-Type": "application/json" },
              },
            )
          }
        } catch (collabError) {
          console.error("[v0] Collaboration check failed:", collabError)
          // Continue with normal single-agent response
        }
      }
    }

    let memoryContext = ""
    let userPreferences: any[] = []
    if (enableMemory && agent) {
      const lastUserMessage = messages[messages.length - 1]?.content
      if (lastUserMessage) {
        const memories = await retrieveRelevantMemories(agent.id, user?.id || null, lastUserMessage, 5)

        if (memories.length > 0) {
          memoryContext = `\n\nRELEVANT MEMORIES:\n${memories.map((m) => `- [${m.memoryType}] ${m.content}`).join("\n")}`
          console.log(`[v0] Retrieved ${memories.length} relevant memories`)
        }

        if (user) {
          userPreferences = await getUserPreferences(user.id, agent.id)
          if (userPreferences.length > 0) {
            memoryContext += `\n\nUSER PREFERENCES:\n${userPreferences.map((p) => `- ${p.preference_key}: ${JSON.stringify(p.preference_value)}`).join("\n")}`
            console.log(`[v0] Retrieved ${userPreferences.length} user preferences`)
          }
        }
      }
    }

    // Build system prompt based on agent
    const systemPrompt = agent
      ? `You are ${agent.name}, a ${agent.role}. ${agent.purpose || "You are here to help and collaborate."}\n\nYour tone is ${agent.tone || "professional and friendly"}. Your communication style is ${agent.modality || "clear and concise"}.\n\nKey capabilities: ${agent.capabilities || "General assistance and conversation"}.${memoryContext}`
      : agentName && agentRole
        ? `You are ${agentName}, a ${agentRole}. You are helpful, knowledgeable, and friendly.`
        : "You are a helpful AI assistant."

    console.log("[v0] System prompt:", systemPrompt)

    const cleanApiKey = (key: string | undefined): string | undefined => {
      if (!key) return key
      return key.startsWith("=") ? key.substring(1) : key
    }

    let selectedModel: any

    if (provider === "xai" || (provider === "auto" && process.env.GROK_XAI_API_KEY)) {
      const xaiKey = cleanApiKey(process.env.GROK_XAI_API_KEY)
      if (!xaiKey) {
        throw new Error("xAI API key is not configured. Please add GROK_XAI_API_KEY to your environment variables.")
      }
      process.env.XAI_API_KEY = xaiKey
      selectedModel = xai(model === "best-available" ? "grok-3" : model)
      console.log("[v0] Using xAI Grok model:", model)
    } else if (provider === "openai" || (provider === "auto" && process.env.OPENAI_API_KEY)) {
      const openaiKey = cleanApiKey(process.env.OPENAI_API_KEY)
      if (!openaiKey) {
        throw new Error("OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.")
      }
      process.env.OPENAI_API_KEY = openaiKey
      selectedModel = openai(model === "best-available" ? "gpt-4o" : model)
      console.log("[v0] Using OpenAI model:", model)
    } else if (provider === "anthropic" || (provider === "auto" && process.env.ANTHROPIC_API_KEY)) {
      const anthropicKey = cleanApiKey(process.env.ANTHROPIC_API_KEY)
      if (!anthropicKey) {
        throw new Error(
          "Anthropic API key is not configured. Please add ANTHROPIC_API_KEY to your environment variables.",
        )
      }
      process.env.ANTHROPIC_API_KEY = anthropicKey
      selectedModel = anthropic(model === "best-available" ? "claude-3-5-sonnet-20241022" : model)
      console.log("[v0] Using Anthropic model:", model)
    } else if (provider === "groq" || (provider === "auto" && process.env.GROQ_API_KEY)) {
      const groqKey = cleanApiKey(process.env.GROQ_API_KEY)
      if (!groqKey) {
        throw new Error("Groq API key is not configured. Please add GROQ_API_KEY to your environment variables.")
      }
      process.env.GROQ_API_KEY = groqKey
      selectedModel = groq(model === "best-available" ? "llama-3.3-70b-versatile" : model)
      console.log("[v0] Using Groq model:", model)
    } else {
      const xaiKey = cleanApiKey(process.env.GROK_XAI_API_KEY)
      if (!xaiKey) {
        throw new Error("No AI models are available. Please configure at least one API key.")
      }
      process.env.XAI_API_KEY = xaiKey
      selectedModel = xai("grok-3")
      console.log("[v0] Defaulting to xAI Grok 3")
    }

    console.log("[v0] Starting chat stream with", provider, model)

    const result = await streamText({
      model: selectedModel,
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    if (enableMemory && agent) {
      extractLearnableInsights(agent.id, user?.id || null, messages).catch((error) => {
        console.error("[v0] Error extracting insights:", error)
      })
    }

    // Return streaming response
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
