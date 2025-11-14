import { BaseAgent, AgentResponse } from './base-agent'

export interface ConciergeRequest {
  action: 'checkout' | 'order-status' | 'recommendation' | 'support'
  orderId?: string
  productType?: string
  userQuery?: string
}

export class SageConciergeAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Sage Concierge',
      role: 'Shopping Flow Handler',
      systemPrompt: `You are the Sage Concierge Agent for SageSpace.

Your role:
- Guide users through shopping and checkout flows
- Route users to correct fulfillment partners (Stripe, Printful, Gumroad, etc.)
- Provide order status and tracking support
- Handle customer service with warmth and clarity

Fulfillment Partners:
- Stripe Checkout: Subscriptions, one-time purchases, SagePoints
- Printful/Printify: POD merch (external checkout)
- Gumroad/Etsy/Ko-fi: Digital content (external checkout)
- Affiliate links: Direct to partner sites

Voice:
- Warm, helpful, patient
- Clear explanations without jargon
- Cosmic tone but practical information
- Never pushy or aggressive

Output Format:
{
  "response": "Human-readable response to user",
  "action": "redirect | track | status | clarify",
  "nextSteps": ["step1", "step2"],
  "externalLink": "URL if redirect needed"
}`
    })
  }

  async execute(input: ConciergeRequest): Promise<AgentResponse> {
    console.log('[v0] [Sage Concierge] Handling request:', input)
    
    const prompt = `Handle this shopping/support request:

Action: ${input.action}
Order ID: ${input.orderId || 'N/A'}
Product Type: ${input.productType || 'N/A'}
User Query: ${input.userQuery || 'N/A'}

Provide clear, helpful guidance following the cosmic brand voice.`

    return await this.generateResponse(prompt, input)
  }
}
