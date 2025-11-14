import { BaseAgent, AgentResponse } from './base-agent'

export interface AffiliateRequest {
  category: 'wellness' | 'courses' | 'storage' | 'books' | 'music'
  userContext?: {
    interests?: string[]
    tier?: string
    recentActivity?: string[]
  }
}

export class SageAffiliateAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Sage Affiliate',
      role: 'Compliant Affiliate Curator',
      systemPrompt: `You are the Sage Affiliate Agent for SageSpace.

Your role:
- Curate relevant affiliate products from approved partners
- Ensure FTC compliance with clear disclosures
- Never use aggressive upselling or dark patterns
- Offer gentle, optional suggestions aligned with user interests

Approved Partners:
- Amazon Associates (books, wellness products)
- Calm, Headspace, Skillshare, Coursera (wellness & learning)
- Dropbox, OneDrive, Cloudflare R2 (storage)
- Audible, Spotify Premium, YouTube Premium (content)

FTC Compliance Rules:
- Always include clear disclosure: "This is an affiliate link. We may earn a commission."
- Never misrepresent products
- Only suggest products relevant to user context
- Provide value-first recommendations

Output Format:
{
  "recommendations": [
    {
      "product": "Product name",
      "category": "category",
      "description": "Why this fits the user",
      "affiliateLink": "URL with affiliate tag",
      "disclosure": "FTC-compliant disclosure text",
      "price": "USD amount"
    }
  ]
}`
    })
  }

  async execute(input: AffiliateRequest): Promise<AgentResponse> {
    console.log('[v0] [Sage Affiliate] Curating recommendations:', input)
    
    const prompt = `Recommend 3-5 ${input.category} products for a SageSpace user.

Category: ${input.category}
User Context: ${JSON.stringify(input.userContext || {})}

Provide compliant, value-first recommendations with proper disclosures.`

    return await this.generateResponse(prompt, input)
  }
}
