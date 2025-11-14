/**
 * Council Graph - Multi-sage deliberation with voting and synthesis
 */
import { AIGraph, type GraphState } from './graph'
import { generateChatResponseSync } from '@/lib/ai-client'
import { generateMultiSagePerspectives, synthesizeUnifiedInsight } from '@/lib/councilLogic'
import { createServiceClient } from '@/lib/supabase/service-role'

export function createCouncilGraph(sageIds: string[], userId: string): AIGraph {
  const graph = new AIGraph()

  // Node 1: Load sages
  graph.addNode({
    name: 'load_sages',
    execute: async (state) => {
      console.log('[Council Graph] Loading sage information')
      
      const supabase = createServiceClient()
      
      const { data: sages } = await supabase
        .from('agents')
        .select('*')
        .in('id', sageIds)

      return {
        context: {
          ...state.context,
          sages: sages || [],
          sagesLoaded: true,
        },
      }
    },
  })

  // Node 2: Generate individual perspectives
  graph.addNode({
    name: 'generate_perspectives',
    execute: async (state) => {
      console.log('[Council Graph] Generating individual perspectives')
      
      const query = state.messages[state.messages.length - 1]?.content || ''
      const sages = state.context.sages || []

      const perspectives = await generateMultiSagePerspectives(query, sages)

      return {
        context: {
          ...state.context,
          perspectives,
          perspectivesGenerated: true,
        },
      }
    },
    onError: async (state, error) => {
      console.error('[Council Graph] Error generating perspectives:', error)
      
      return {
        context: {
          ...state.context,
          perspectives: [],
          perspectivesGenerated: false,
          error: error.message,
        },
      }
    },
  })

  // Node 3: Check for consensus/deadlock
  graph.addNode({
    name: 'check_consensus',
    execute: async (state) => {
      console.log('[Council Graph] Checking for consensus')
      
      const perspectives = state.context.perspectives || []
      
      // Check if we have novel contributions
      const novelPerspectives = perspectives.filter((p: any) => p.hasNovelContribution)
      const hasConsensus = novelPerspectives.length > 0

      return {
        context: {
          ...state.context,
          hasConsensus,
          consensusChecked: true,
        },
      }
    },
  })

  // Node 4: Synthesize insights
  graph.addNode({
    name: 'synthesize',
    execute: async (state) => {
      console.log('[Council Graph] Synthesizing perspectives')
      
      const query = state.messages[state.messages.length - 1]?.content || ''
      const perspectives = state.context.perspectives || []

      const synthesis = await synthesizeUnifiedInsight(query, perspectives)

      return {
        messages: [
          ...state.messages,
          {
            role: 'assistant',
            content: `**${synthesis.title}**\n\n${synthesis.content}`,
          },
        ],
        context: {
          ...state.context,
          synthesis,
          synthesized: true,
        },
      }
    },
  })

  // Node 5: Handle deadlock
  graph.addNode({
    name: 'handle_deadlock',
    execute: async (state) => {
      console.log('[Council Graph] Handling deadlock')
      
      return {
        messages: [
          ...state.messages,
          {
            role: 'assistant',
            content: 'The Council has determined that this question falls outside the collective expertise of the assembled sages. Please consider rephrasing or providing more context.',
          },
        ],
        context: {
          ...state.context,
          deadlockHandled: true,
        },
      }
    },
  })

  // Node 6: Save session
  graph.addNode({
    name: 'save_session',
    execute: async (state) => {
      console.log('[Council Graph] Saving council session')
      
      try {
        const supabase = createServiceClient()
        
        const query = state.messages[0]?.content || ''
        const synthesis = state.context.synthesis

        await supabase.from('council_sessions').insert({
          user_id: userId,
          query,
          query_type: 'standard',
          final_decision: synthesis?.content || 'No consensus reached',
          reasoning: JSON.stringify(state.context.perspectives),
          status: state.context.hasConsensus ? 'completed' : 'deadlock',
          metadata: {
            perspectives: state.context.perspectives?.length || 0,
            tone: synthesis?.tone || 'unknown',
          },
        })

        return {
          context: {
            ...state.context,
            sessionSaved: true,
          },
        }
      } catch (error) {
        console.error('[Council Graph] Error saving session:', error)
        return { context: { ...state.context, sessionSaved: false } }
      }
    },
  })

  // Define edges
  graph
    .addEdge({ from: 'load_sages', to: 'generate_perspectives' })
    .addEdge({ from: 'generate_perspectives', to: 'check_consensus' })
    .addEdge({
      from: 'check_consensus',
      to: 'synthesize',
      condition: (state) => state.context.hasConsensus === true,
    })
    .addEdge({
      from: 'check_consensus',
      to: 'handle_deadlock',
      condition: (state) => state.context.hasConsensus === false,
    })
    .addEdge({ from: 'synthesize', to: 'save_session' })
    .addEdge({ from: 'handle_deadlock', to: 'save_session' })
    .setEntryPoint('load_sages')

  return graph
}
