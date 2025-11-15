import { runChat } from '@/lib/ai/chatClient'
import { buildSageSystemPrompt, filterContextForSage, extractDomainFacets, type SageWithCharter } from "./sage-prompt-builder"
import type { SagePerspective, UnifiedInsight } from './types'

export async function generateMultiSagePerspectives(
  query: string,
  sages: Array<{ id: string; name: string; avatar: string; role: string; domain: string; systemPrompt?: string }>,
  userAccessLevel: string = 'free',
): Promise<SagePerspective[]> {
  console.log("[v0] [Council] Generating perspectives for", sages.length, "sages")

  const allPerspectives: SagePerspective[] = []
  const queryFacets = extractDomainFacets(query)

  console.log("[v0] [Council] Query facets:", queryFacets)

  const relevantSages = sages.filter(sage => {
    const isRelevant = queryFacets.includes(sage.domain)
    if (!isRelevant) {
      console.log("[v0] [Council] Skipping", sage.name, "- domain not relevant")
    }
    return isRelevant
  })

  const cappedSages = relevantSages.slice(0, 5)
  if (relevantSages.length > 5) {
    console.log("[v0] [Council] Capped at 5 sages (had", relevantSages.length, "relevant)")
  }

  // Round 1: Individual Domain Reasoning
  for (const sage of cappedSages) {
    try {
      const systemPrompt = buildSageSystemPrompt(sage as SageWithCharter, "council")

      const context = filterContextForSage(
        query,
        sage as SageWithCharter,
        allPerspectives.map((p) => ({
          sageName: p.sageName,
          domain: p.domain,
          response: p.response,
        })),
      )

      const result = await runChat({
        messages: [{ role: 'user', content: context }],
        systemPrompt,
        maxTokens: 200,
        temperature: 0.7
      })

      const responseText = result.content.trim()

      const hasNovelContribution = !responseText.toLowerCase().includes("no major additions")

      const domainRelevance = queryFacets.includes(sage.domain) ? 0.9 : 0.4

      const text = responseText.toLowerCase()
      let tone: SagePerspective["tone"] = "analytical"
      if (text.includes("caution") || text.includes("risk") || text.includes("careful")) {
        tone = "cautious"
      } else if (text.includes("excit") || text.includes("opportunity") || text.includes("potential")) {
        tone = "inspired"
      } else if (text.includes("support") || text.includes("help") || text.includes("guide")) {
        tone = "supportive"
      } else if (text.includes("challenge") || text.includes("consider") || text.includes("however")) {
        tone = "challenging"
      }

      const perspective: SagePerspective = {
        sageId: sage.id,
        sageName: sage.name,
        sageAvatar: sage.avatar,
        response: responseText,
        tone,
        confidence: hasNovelContribution ? 0.7 + Math.random() * 0.25 : 0.3,
        domain: sage.domain,
        hasNovelContribution,
        domainRelevance,
      }

      allPerspectives.push(perspective)

      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`[v0] [Council] Error generating perspective for ${sage.name}:`, error)
      allPerspectives.push({
        sageId: sage.id,
        sageName: sage.name,
        sageAvatar: sage.avatar,
        response: `From my ${sage.domain} domain, I have no major additions.`,
        tone: "analytical" as const,
        confidence: 0.3,
        domain: sage.domain,
        hasNovelContribution: false,
        domainRelevance: 0,
      })
    }
  }

  console.log("[v0] [Council] Generated", allPerspectives.length, "perspectives")
  console.log("[v0] [Council] Novel contributions:", allPerspectives.filter(p => p.hasNovelContribution).length)

  return allPerspectives
}

export async function synthesizeUnifiedInsight(
  query: string,
  perspectives: SagePerspective[],
  userAccessLevel: string = 'free',
): Promise<UnifiedInsight> {
  console.log("[v0] [Council] Synthesizing", perspectives.length, "perspectives")

  try {
    const byDomain = perspectives.reduce((acc, p) => {
      if (!acc[p.domain]) acc[p.domain] = []
      acc[p.domain].push(p)
      return acc
    }, {} as Record<string, SagePerspective[]>)

    const novelPerspectives = perspectives.filter(p => p.hasNovelContribution)

    if (novelPerspectives.length === 0) {
      return {
        title: "No Domain-Specific Insights",
        content: "The council found that this question falls outside the established domain expertise of the assembled sages. Consider rephrasing or consulting different specialists.",
        keywords: ["outside-scope", "reframe", "clarify"],
        tone: "curiosity",
      }
    }

    const uniqueDomains = [...new Set(novelPerspectives.map(p => p.domain))]
    if (uniqueDomains.length === 1 && novelPerspectives.length === 1) {
      console.log("[v0] [Council] Single perspective, skipping synthesis LLM call")
      const p = novelPerspectives[0]
      return {
        title: `${p.domain} Perspective`,
        content: p.response,
        keywords: [p.domain.toLowerCase().replace(/ /g, '-')],
        tone: p.tone === 'inspired' ? 'inspired' : 'harmony',
      }
    }

    const domainSummaries = Object.entries(byDomain)
      .map(([domain, domainPerspectives]) => {
        const novelOnes = domainPerspectives.filter(p => p.hasNovelContribution)
        if (novelOnes.length === 0) return null
        
        return `**${domain}:**\n${novelOnes.map(p => `- ${p.sageName}: ${p.response}`).join("\n")}`
      })
      .filter(Boolean)
      .join("\n\n")

    const systemPrompt = `You are the Council Synthesizer. Your role is to combine domain-specific insights into a unified understanding.

CRITICAL RULES:
1. Organize the synthesis BY DOMAIN, not as a generic narrative
2. DROP any duplicated or redundant points
3. HIGHLIGHT genuine conflicts between domains (don't smooth over disagreements)
4. Keep it concise and actionable - MAXIMUM 4 sentences
5. If domains conflict, explain the tension clearly

Respond in JSON format:
{
  "title": "Your Compelling Title (5-8 words)",
  "content": "Domain-organized synthesis with conflicts highlighted (3-4 sentences MAX)",
  "keywords": ["theme1", "theme2", "theme3"],
  "tone": "inspired" | "conflict" | "harmony" | "curiosity"
}

Set tone to "conflict" if there are genuine disagreements between domains.`

    const result = await runChat({
      messages: [{ role: 'user', content: `Question: ${query}\n\nDomain-Specific Insights:\n${domainSummaries}\n\nSynthesize these by domain, highlighting any conflicts.` }],
      systemPrompt,
      maxTokens: 400,
      temperature: 0.6
    })

    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || "Council Consensus",
        content: parsed.content || result.content,
        keywords: parsed.keywords || [],
        tone: parsed.tone || "harmony",
      }
    }

    return {
      title: "Multi-Domain Perspective",
      content: result.content,
      keywords: Object.keys(byDomain),
      tone: perspectives.some(p => p.tone === "challenging" || p.tone === "cautious") ? "conflict" : "harmony",
    }
  } catch (error) {
    console.error("[v0] [Council] Error synthesizing insight:", error)
    return {
      title: "Council Deliberation Complete",
      content: perspectives
        .filter(p => p.hasNovelContribution)
        .map(p => `${p.domain}: ${p.response}`)
        .join("\n\n"),
      keywords: ["discussion", "perspectives", "analysis"],
      tone: "harmony",
    }
  }
}

export function getToneGradient(tone: string): string {
  const gradients: Record<string, string> = {
    inspired: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    conflict: "linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)",
    harmony: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
    curiosity: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    analytical: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    cautious: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  }

  return gradients[tone] || gradients.harmony
}
