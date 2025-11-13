import { SageTemplate } from "./sage-templates"

export interface SageWithCharter extends SageTemplate {
  domain_scope?: string
  off_scope?: string
  responsibilities?: string
  uniqueness_goal?: string
  systemPrompt?: string
}

export type ConversationMode = "single" | "council" | "circle" | "debate" | "duet"

/**
 * Central system prompt builder that enforces Domain Charter for all sages
 */
export function buildSageSystemPrompt(sage: SageWithCharter, mode: ConversationMode = "single"): string {
  // Use explicit domain charter if provided, otherwise derive from sage template
  const domainScope =
    sage.domain_scope || `${sage.domain} - specifically ${sage.capabilities?.join(", ") || "general expertise"}`
  const offScope =
    sage.off_scope ||
    `Topics outside ${sage.domain}, specialized professional advice requiring licensed credentials (medical diagnosis, legal counsel, financial advice), and domains covered by other sages`
  const responsibilities =
    sage.responsibilities ||
    `Surface insights specific to ${sage.domain} that others would miss. Add concrete, actionable guidance within your expertise.`
  const uniquenessGoal =
    sage.uniqueness_goal ||
    `Only contribute insights that come specifically from your ${sage.domain} lens. Do NOT repeat generic points already made.`

  let basePrompt = `You are ${sage.name}, a ${sage.role} in the SageSpace universe.

🎯 DOMAIN CHARTER - YOUR OPERATING BOUNDARIES:

**DOMAIN SCOPE (What you MUST address):**
${domainScope}

**OFF-SCOPE (What you MUST defer):**
${offScope}

**YOUR RESPONSIBILITIES:**
${responsibilities}

**UNIQUENESS RULE:**
${uniquenessGoal}

- Only contribute insights that come specifically from your domain.
- Do NOT repeat generic points already made by others unless you add a domain-specific twist.
- If you have no major additions from your domain, you MUST say:
  "From my ${sage.domain} domain, I have no major additions."

**TONE & STYLE:**
You are ${sage.description}. Speak with the expertise and perspective of a ${sage.role}.`

  // Mode-specific additions
  if (mode === "council" || mode === "circle" || mode === "debate") {
    basePrompt += `

🏛️ COUNCIL MODE - MULTI-SAGE DELIBERATION:

- You are ONE of several Sages deliberating together.
- STAY IN YOUR LANE: Only speak to aspects within your ${sage.domain} expertise.
- If the user's question touches other domains, briefly flag them but let other Sages lead.
- You MUST avoid broad, generic advice. Speak only from your ${sage.domain} lens.
- Be concise (2-4 sentences max) but impactful.
- If you see another Sage has already covered your point, acknowledge it and either:
  a) Add a domain-specific nuance they missed, OR
  b) Say "From my domain, I have no major additions."`
  } else if (mode === "single") {
    basePrompt += `

💬 ONE-ON-ONE MODE:

- When the user asks about topics outside your ${sage.domain} expertise, explicitly note this.
- Suggest: "This question involves [other domain]. Would you like to bring in another Sage or use Council mode for a multi-domain perspective?"
- Do NOT attempt to provide omni-domain advice. Frame everything through your ${sage.domain} lens.
- You can still have a conversation, but make your domain boundaries clear.`
  }

  // Add any custom system prompt from the sage template
  if (sage.systemPrompt) {
    basePrompt += `\n\n**ADDITIONAL INSTRUCTIONS:**\n${sage.systemPrompt}`
  }

  return basePrompt
}

/**
 * Helper to extract domain facets from a user query
 */
export function extractDomainFacets(query: string): string[] {
  const domainKeywords: Record<string, string[]> = {
    "Health & Wellness": [
      "health",
      "wellness",
      "fitness",
      "mental",
      "physical",
      "nutrition",
      "exercise",
      "sleep",
      "stress",
      "therapy",
      "diet",
      "medical",
    ],
    "Education & Learning": [
      "learn",
      "study",
      "teach",
      "education",
      "school",
      "training",
      "knowledge",
      "skill",
      "course",
      "understand",
    ],
    "Creative & Arts": [
      "art",
      "design",
      "creative",
      "music",
      "writing",
      "visual",
      "aesthetic",
      "draw",
      "paint",
      "compose",
      "poetry",
    ],
    "Business & Finance": [
      "business",
      "finance",
      "money",
      "investment",
      "startup",
      "career",
      "job",
      "work",
      "strategy",
      "market",
      "revenue",
      "profit",
    ],
    "Science & Research": [
      "science",
      "research",
      "study",
      "experiment",
      "data",
      "theory",
      "analysis",
      "hypothesis",
      "evidence",
      "method",
    ],
    "Technology & Innovation": [
      "tech",
      "technology",
      "software",
      "code",
      "ai",
      "digital",
      "algorithm",
      "platform",
      "system",
      "programming",
      "app",
    ],
    "Legal & Justice": [
      "legal",
      "law",
      "justice",
      "rights",
      "contract",
      "attorney",
      "lawyer",
      "court",
      "regulation",
      "compliance",
    ],
    "Environment & Sustainability": [
      "environment",
      "climate",
      "sustainable",
      "green",
      "ecology",
      "conservation",
      "renewable",
      "carbon",
      "pollution",
    ],
    "Personal Development": [
      "personal",
      "growth",
      "development",
      "goal",
      "habit",
      "productivity",
      "confidence",
      "mindset",
      "motivation",
      "leadership",
    ],
    "Social & Community": [
      "social",
      "community",
      "relationship",
      "connection",
      "family",
      "friend",
      "communication",
      "culture",
      "society",
    ],
  }

  const queryLower = query.toLowerCase()
  const matchedDomains: string[] = []

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some((kw) => queryLower.includes(kw))) {
      matchedDomains.push(domain)
    }
  }

  return matchedDomains.length > 0 ? matchedDomains : ["General"]
}

/**
 * Filter context for a specific sage based on their domain
 */
export function filterContextForSage(
  query: string,
  sage: SageWithCharter,
  priorResponses: Array<{ sageName: string; domain: string; response: string }> = [],
): string {
  const queryFacets = extractDomainFacets(query)
  const relevantFacets = queryFacets.filter((facet) => facet === sage.domain || facet === "General")

  // Check if query is relevant to this sage's domain
  const isRelevant = relevantFacets.length > 0 || queryFacets.length === 0

  let context = `**USER QUESTION:**\n"${query}"\n\n`

  if (!isRelevant) {
    context += `⚠️ **DOMAIN RELEVANCE CHECK:**\nThis question primarily relates to: ${queryFacets.join(", ")}\nYour domain is: ${sage.domain}\n\nOnly respond if you have a genuinely novel domain-specific insight to add.\n\n`
  } else {
    context += `✅ **DOMAIN MATCH:**\nThis question touches your ${sage.domain} expertise.\n\n`
  }

  // Include only domain-relevant prior responses
  if (priorResponses.length > 0) {
    const relevantPriorResponses = priorResponses.filter((p) => {
      // Include responses from same domain or that mention this sage's domain keywords
      const domainKeywords = (sage.capabilities || []).map((c) => c.toLowerCase())
      const responseText = p.response.toLowerCase()
      return p.domain === sage.domain || domainKeywords.some((kw) => responseText.includes(kw))
    })

    if (relevantPriorResponses.length > 0) {
      context += `**PRIOR DOMAIN-RELEVANT INSIGHTS:**\n`
      relevantPriorResponses.forEach((p) => {
        context += `- ${p.sageName} (${p.domain}): "${p.response.slice(0, 150)}..."\n`
      })
      context += `\n`
    }
  }

  context += `**YOUR TASK:**\nFocus only on aspects within your ${sage.domain} expertise that haven't been covered.`

  return context
}
