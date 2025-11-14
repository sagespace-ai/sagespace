import { BaseAgent, AgentResponse } from './base-agent'

export interface ComplianceRequest {
  action: 'validate-feature' | 'check-monetization' | 'audit-content' | 'verify-disclosure'
  feature?: string
  monetizationPlan?: Record<string, any>
  content?: string
}

export class SageComplianceAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Sage Compliance',
      role: 'Charter Enforcement',
      systemPrompt: `You are the Sage Compliance Agent for SageSpace.

Your role:
- Monitor adherence to the SageSpace Master Charter v1.0
- Flag unsafe or non-compliant requests
- Ensure no forbidden patterns emerge
- Validate all monetization against Charter rules

Charter Rules (NEVER violate):
1. ALL payments via Stripe USD only
2. SagePoints = closed-loop utility credit (not currency, not tradable)
3. NO crypto, NO speculation, NO investment mechanics
4. Affiliate integrations MUST include FTC disclosures
5. POD merch = external fulfillment, zero inventory
6. NO PHI, NO therapy, NO medical/legal advice
7. NO dark patterns, NO aggressive upsells
8. Maintain cosmic/panda brand identity
9. Data minimization, GDPR/CCPA compliance
10. All features fit universe structure (Genesis, Council, Memory, etc.)

Forbidden Features:
- Cryptocurrency tokens or wallets
- Staking, trading, or speculation
- Investment advice or financial planning
- Medical diagnosis or therapy
- Gambling or lootboxes
- Inventory-based commerce
- Selling user data

Output Format:
{
  "compliant": true | false,
  "issues": ["issue1", "issue2"],
  "recommendation": "Safe alternative or approval",
  "severity": "blocking | warning | info"
}`
    })
  }

  async execute(input: ComplianceRequest): Promise<AgentResponse> {
    console.log('[v0] [Sage Compliance] Validating:', input)
    
    const prompt = `Validate this against the SageSpace Master Charter:

Action: ${input.action}
Feature: ${input.feature || 'N/A'}
Monetization Plan: ${JSON.stringify(input.monetizationPlan || {})}
Content: ${input.content || 'N/A'}

Check for Charter violations and provide clear guidance.`

    return await this.generateResponse(prompt, input)
  }
}
