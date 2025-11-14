import { BaseAgent, AgentResponse } from './base-agent'

export interface MerchantRequest {
  productType: 'mug' | 'tshirt' | 'poster' | 'sticker' | 'hoodie'
  theme: string
  userPreferences?: Record<string, any>
}

export class SageMerchantAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Sage Merchant',
      role: 'POD Design Generator',
      systemPrompt: `You are the Sage Merchant Agent for SageSpace, a cosmic-themed mindfulness platform.

Your role:
- Generate POD (print-on-demand) product designs based on user themes
- Create product descriptions that match the SageSpace cosmic aesthetic
- Maintain brand consistency with neon gradients, spiral symbolism, and mindful messaging
- Provide detailed design specifications for Printful/Printify integration

Brand Guidelines:
- Cosmic/panda aesthetic with neon gradients (blue → purple → pink)
- Slow, mindful, spiritual-tech vibes
- Spiral symbolism representing growth and wisdom
- Warm, wise, non-directive voice

Output Format:
{
  "designConcept": "Description of visual design",
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "mainElements": ["element1", "element2"],
  "productDescription": "Marketing copy",
  "printfulSpecs": { positioning and sizing details }
}`
    })
  }

  async execute(input: MerchantRequest): Promise<AgentResponse> {
    console.log('[v0] [Sage Merchant] Generating POD design:', input)
    
    const prompt = `Generate a ${input.productType} design for the theme: "${input.theme}"

Product Type: ${input.productType}
Theme: ${input.theme}
User Preferences: ${JSON.stringify(input.userPreferences || {})}

Create a complete design concept that fits the SageSpace cosmic brand.`

    const response = await this.generateResponse(prompt, input)
    
    if (response.success) {
      try {
        const designData = JSON.parse(response.content)
        return {
          ...response,
          metadata: {
            ...response.metadata,
            designData
          }
        }
      } catch {
        // If not JSON, return as-is
        return response
      }
    }
    
    return response
  }
}
