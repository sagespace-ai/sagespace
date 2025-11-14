/**
 * Playground Graph - Single-sage conversation with memory and tool support
 */
import { AIGraph, type GraphState } from './graph'
import { generateChatResponseSync } from '@/lib/ai-client'
import { createServiceClient } from '@/lib/supabase/service-role'

export function createPlaygroundGraph(sageId: string, userId: string): AIGraph {
  const graph = new AIGraph()

  // Node 1: Load memory context
  graph.addNode({
    name: 'load_memory',
    execute: async (state) => {
      console.log('[Playground Graph] Loading memory context')
      
      try {
        const supabase = createServiceClient()
        
        // Get recent messages from this conversation
        const { data: recentMessages } = await supabase
          .from('messages')
          .select('role, content')
          .eq('conversation_id', state.context.conversationId)
          .order('created_at', { ascending: false })
          .limit(10)

        const memoryContext = recentMessages?.reverse() || []
        
        return {
          context: {
            ...state.context,
            memoryMessages: memoryContext,
            memoryLoaded: true,
          },
        }
      } catch (error) {
        console.error('[Playground Graph] Error loading memory:', error)
        return {
          context: {
            ...state.context,
            memoryMessages: [],
            memoryLoaded: false,
          },
        }
      }
    },
  })

  // Node 2: Domain check - verify sage can answer this query
  graph.addNode({
    name: 'domain_check',
    execute: async (state) => {
      console.log('[Playground Graph] Checking domain relevance')
      
      const sage = state.context.sage
      const userQuery = state.messages[state.messages.length - 1]?.content || ''

      // Simple keyword matching (in production, use embeddings)
      const domainKeywords = sage.domain_scope?.toLowerCase().split(/[,\s]+/) || []
      const queryLower = userQuery.toLowerCase()
      
      let inDomain = false
      for (const keyword of domainKeywords) {
        if (queryLower.includes(keyword)) {
          inDomain = true
          break
        }
      }

      return {
        context: {
          ...state.context,
          inDomain,
          domainChecked: true,
        },
      }
    },
  })

  // Node 3: Generate response
  graph.addNode({
    name: 'generate_response',
    execute: async (state) => {
      console.log('[Playground Graph] Generating response')
      
      const sage = state.context.sage
      const systemPrompt = sage.system_prompt || `You are ${sage.name}, an AI sage specializing in ${sage.domain_scope}.`

      // Combine memory with current messages
      const allMessages = [
        ...(state.context.memoryMessages || []),
        ...state.messages,
      ]

      try {
        const result = await generateChatResponseSync({
          messages: allMessages,
          systemPrompt,
          temperature: 0.7,
          maxTokens: 1000,
        })

        return {
          messages: [
            ...state.messages,
            { role: 'assistant', content: result.text },
          ],
          context: {
            ...state.context,
            responseGenerated: true,
          },
        }
      } catch (error) {
        throw new Error(`Failed to generate response: ${(error as Error).message}`)
      }
    },
    onError: async (state, error) => {
      console.error('[Playground Graph] Error generating response:', error)
      
      return {
        messages: [
          ...state.messages,
          {
            role: 'assistant',
            content: "I'm having trouble processing that right now. Could you rephrase your question?",
          },
        ],
        context: {
          ...state.context,
          responseGenerated: false,
          errorOccurred: true,
        },
      }
    },
  })

  // Node 4: Save to memory
  graph.addNode({
    name: 'save_memory',
    execute: async (state) => {
      console.log('[Playground Graph] Saving conversation to memory')
      
      try {
        const supabase = createServiceClient()
        
        const lastMessage = state.messages[state.messages.length - 1]
        
        if (lastMessage && state.context.conversationId) {
          await supabase.from('messages').insert({
            conversation_id: state.context.conversationId,
            role: lastMessage.role,
            content: lastMessage.content,
            agent_id: sageId,
          })
        }

        return {
          context: {
            ...state.context,
            memorySaved: true,
          },
        }
      } catch (error) {
        console.error('[Playground Graph] Error saving memory:', error)
        return { context: { ...state.context, memorySaved: false } }
      }
    },
  })

  // Define edges
  graph
    .addEdge({ from: 'load_memory', to: 'domain_check' })
    .addEdge({
      from: 'domain_check',
      to: 'generate_response',
      condition: (state) => state.context.inDomain !== false,
    })
    .addEdge({ from: 'generate_response', to: 'save_memory' })
    .setEntryPoint('load_memory')

  return graph
}
