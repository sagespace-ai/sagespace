/**
 * LangGraph-inspired orchestration for SageSpace
 * Implements stateful, multi-step AI workflows with error recovery
 */

export interface GraphState {
  messages: Array<{ role: string; content: string }>
  currentStep: string
  context: Record<string, any>
  errors: Array<{ step: string; error: string }>
  metadata: Record<string, any>
}

export interface GraphNode {
  name: string
  execute: (state: GraphState) => Promise<Partial<GraphState>>
  shouldExecute?: (state: GraphState) => boolean
  onError?: (state: GraphState, error: Error) => Promise<Partial<GraphState>>
}

export interface GraphEdge {
  from: string
  to: string
  condition?: (state: GraphState) => boolean
}

export class AIGraph {
  private nodes: Map<string, GraphNode> = new Map()
  private edges: GraphEdge[] = []
  private entryPoint: string = ''

  /**
   * Add a node to the graph
   */
  addNode(node: GraphNode): this {
    this.nodes.set(node.name, node)
    return this
  }

  /**
   * Add an edge between nodes
   */
  addEdge(edge: GraphEdge): this {
    this.edges.push(edge)
    return this
  }

  /**
   * Set the entry point of the graph
   */
  setEntryPoint(nodeName: string): this {
    this.entryPoint = nodeName
    return this
  }

  /**
   * Execute the graph with initial state
   */
  async execute(initialState: Partial<GraphState>): Promise<GraphState> {
    let state: GraphState = {
      messages: initialState.messages || [],
      currentStep: this.entryPoint,
      context: initialState.context || {},
      errors: [],
      metadata: initialState.metadata || {},
    }

    const visited = new Set<string>()
    const maxSteps = 20 // Prevent infinite loops

    for (let i = 0; i < maxSteps; i++) {
      const currentNode = this.nodes.get(state.currentStep)
      
      if (!currentNode) {
        console.log('[Graph] Reached terminal node:', state.currentStep)
        break
      }

      // Check if we should execute this node
      if (currentNode.shouldExecute && !currentNode.shouldExecute(state)) {
        console.log('[Graph] Skipping node:', currentNode.name)
        const nextStep = this.getNextNode(state)
        if (!nextStep) break
        state.currentStep = nextStep
        continue
      }

      console.log('[Graph] Executing node:', currentNode.name)
      visited.add(currentNode.name)

      try {
        // Execute the node
        const updates = await currentNode.execute(state)
        state = { ...state, ...updates }
        
        // Find next node
        const nextStep = this.getNextNode(state)
        if (!nextStep) {
          console.log('[Graph] No more nodes to execute')
          break
        }
        
        state.currentStep = nextStep
      } catch (error) {
        console.error('[Graph] Error in node:', currentNode.name, error)
        
        // Try error recovery
        if (currentNode.onError) {
          const errorUpdates = await currentNode.onError(state, error as Error)
          state = { ...state, ...errorUpdates }
          state.errors.push({
            step: currentNode.name,
            error: (error as Error).message,
          })
        } else {
          // No error handler, fail
          state.errors.push({
            step: currentNode.name,
            error: (error as Error).message,
          })
          break
        }
      }
    }

    return state
  }

  /**
   * Get the next node based on edges and conditions
   */
  private getNextNode(state: GraphState): string | null {
    for (const edge of this.edges) {
      if (edge.from === state.currentStep) {
        if (!edge.condition || edge.condition(state)) {
          return edge.to
        }
      }
    }
    return null
  }
}
