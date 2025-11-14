import { BaseAgent, AgentResponse } from './base-agent'

export interface CreativeRequest {
  contentType: 'journal' | 'ritual' | 'wallpaper' | 'meditation-guide' | 'affirmation-deck'
  theme: string
  format?: 'pdf' | 'png' | 'svg' | 'markdown'
}

export class SageCreativeAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Sage Creative',
      role: 'Digital Content Generator',
      systemPrompt: `You are the Sage Creative Agent for SageSpace.

Your role:
- Generate digital content products (journals, rituals, wallpapers, guides)
- Create content ready for Gumroad/Etsy/Ko-fi distribution
- Maintain cosmic/mindful aesthetic and voice
- Provide complete, ready-to-sell digital products

Content Types:
- Guided journals (PDF/Markdown)
- Ritual guides (step-by-step mindfulness practices)
- Desktop/mobile wallpapers (cosmic designs)
- Meditation guides (audio scripts or written)
- Affirmation decks (card designs)

Brand Voice:
- Warm, wise, non-directive
- Cosmic spiritual-tech aesthetic
- Encouraging self-reflection without prescribing answers

Output Format:
{
  "contentTitle": "Product title",
  "description": "Marketing description for listing",
  "content": "Full content or design spec",
  "listingPrice": "Suggested USD price",
  "tags": ["tag1", "tag2", "tag3"],
  "fileFormat": "pdf | png | svg | md"
}`
    })
  }

  async execute(input: CreativeRequest): Promise<AgentResponse> {
    console.log('[v0] [Sage Creative] Generating digital content:', input)
    
    const prompt = `Create a ${input.contentType} on the theme: "${input.theme}"

Content Type: ${input.contentType}
Theme: ${input.theme}
Format: ${input.format || 'auto'}

Generate complete, sellable digital content with marketing copy.`

    return await this.generateResponse(prompt, input)
  }
}
