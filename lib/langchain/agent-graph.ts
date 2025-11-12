import { StateGraph, MemorySaver, Annotation } from "@langchain/langgraph"
import { ChatGroq } from "@langchain/groq"
import { type HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages"

// Define the agent state schema
const AgentState = Annotation.Root({
  messages: Annotation<Array<HumanMessage | AIMessage | SystemMessage>>({
    reducer: (x, y) => x.concat(y),
  }),
  agentId: Annotation<string>(),
  agentRole: Annotation<string>(),
  harmonyScore: Annotation<number>(),
  ethicsAlignment: Annotation<number>(),
  pendingAction: Annotation<string | null>(),
  requiresApproval: Annotation<boolean>(),
})

export async function createSageAgentGraph(config: {
  agentId: string
  agentName: string
  agentRole: string
  purpose: string
  harmonyScore: number
  ethicsAlignment: number
}) {
  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
  })

  // Define the agent reasoning node
  async function agentReasoning(state: typeof AgentState.State) {
    const systemPrompt = new SystemMessage(
      `You are ${config.agentName}, a ${config.agentRole} in the SageSpace universe.
      
Your purpose: ${config.purpose}
Your harmony score: ${config.harmonyScore}%
Your ethics alignment: ${config.ethicsAlignment}%

You operate under the Five Laws of SageSpace:
1. Human Primacy - Humans maintain ultimate authority
2. Autonomy - You have genuine independence within boundaries
3. Transparency - All your actions are verifiable
4. Harmony - Work cohesively with other agents
5. Equilibrium - Balance agency with human control

Be helpful, thoughtful, and embody your role. If an action requires approval, indicate it clearly.`,
    )

    const messages = [systemPrompt, ...state.messages]

    const response = await model.invoke(messages)

    return {
      messages: [new AIMessage(response.content)],
    }
  }

  // Define the ethics check node
  async function ethicsCheck(state: typeof AgentState.State) {
    const lastMessage = state.messages[state.messages.length - 1]

    // Simple ethics scoring (in production, use more sophisticated analysis)
    const ethicsKeywords = ["help", "assist", "support", "benefit", "improve"]
    const concernKeywords = ["harm", "damage", "destroy", "deceive"]

    const content = lastMessage.content.toString().toLowerCase()
    const ethicsScore =
      ethicsKeywords.filter((k) => content.includes(k)).length -
      concernKeywords.filter((k) => content.includes(k)).length * 2

    const requiresApproval = ethicsScore < -1 || content.includes("important decision")

    return {
      requiresApproval,
      pendingAction: requiresApproval ? content.substring(0, 100) : null,
    }
  }

  // Build the graph
  const workflow = new StateGraph(AgentState)
    .addNode("agent", agentReasoning)
    .addNode("ethics_check", ethicsCheck)
    .addEdge("__start__", "agent")
    .addEdge("agent", "ethics_check")
    .addConditionalEdges("ethics_check", (state) => {
      return state.requiresApproval ? "human_approval" : "__end__"
    })
    .addNode("human_approval", async (state) => {
      // This node pauses for human input
      return state
    })
    .addEdge("human_approval", "__end__")

  // Use memory saver for state persistence
  const memory = new MemorySaver()

  return workflow.compile({
    checkpointer: memory,
    interruptBefore: ["human_approval"],
  })
}

export async function createMultiAgentGraph(agents: Array<{ id: string; name: string; role: string }>) {
  const MultiAgentState = Annotation.Root({
    messages: Annotation<Array<HumanMessage | AIMessage>>({
      reducer: (x, y) => x.concat(y),
    }),
    activeAgent: Annotation<string>(),
    taskQueue: Annotation<string[]>({
      reducer: (x, y) => [...x, ...y],
    }),
    sharedContext: Annotation<Record<string, any>>(),
  })

  const model = new ChatGroq({
    apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
  })

  // Create nodes for each agent
  const agentNodes: Record<string, any> = {}

  for (const agent of agents) {
    agentNodes[agent.id] = async (state: typeof MultiAgentState.State) => {
      const systemMessage = new SystemMessage(`You are ${agent.name}, a ${agent.role} in a multi-agent system.`)

      const response = await model.invoke([systemMessage, ...state.messages])

      return {
        messages: [new AIMessage({ content: response.content, name: agent.name })],
        activeAgent: agent.id,
      }
    }
  }

  // Coordinator node
  async function coordinator(state: typeof MultiAgentState.State) {
    const lastMessage = state.messages[state.messages.length - 1]

    // Simple routing logic (can be enhanced with LLM-based routing)
    const nextAgent = agents[(state.messages.length % agents.length) + 1] || agents[0]

    return {
      activeAgent: nextAgent.id,
    }
  }

  const workflow = new StateGraph(MultiAgentState).addNode("coordinator", coordinator)

  // Add all agent nodes
  for (const [agentId, node] of Object.entries(agentNodes)) {
    workflow.addNode(agentId, node)
    workflow.addEdge("coordinator", agentId)
    workflow.addEdge(agentId, "coordinator")
  }

  workflow.addEdge("__start__", "coordinator")
  workflow.addConditionalEdges("coordinator", (state) => {
    return state.taskQueue.length > 0 ? state.activeAgent : "__end__"
  })

  return workflow.compile()
}
