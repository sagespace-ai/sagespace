import { generateText } from 'ai'

export interface AgentConfig {
  name: string
  role: string
  systemPrompt: string
  model?: string
  temperature?: number
}

export interface AgentResponse {
  success: boolean
  content: string
  reasoning?: string
  error?: string
  metadata?: Record<string, any>
}

export abstract class BaseAgent {
  protected config: AgentConfig
  
  constructor(config: AgentConfig) {
    this.config = {
      model: 'groq/llama-3.3-70b-versatile',
      temperature: 0.7,
      ...config
    }
  }

  protected async generateResponse(
    prompt: string,
    context?: Record<string, any>
  ): Promise<AgentResponse> {
    try {
      const { text } = await generateText({
        model: this.config.model!,
        temperature: this.config.temperature,
        system: this.config.systemPrompt,
        prompt: `${prompt}\n\nContext: ${JSON.stringify(context || {})}`
      })

      return {
        success: true,
        content: text,
        metadata: context
      }
    } catch (error) {
      console.error(`[${this.config.name}] Error:`, error)
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  abstract execute(input: any): Promise<AgentResponse>
}
