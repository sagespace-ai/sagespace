import type { JourneyContext, JourneyStep, Purpose } from "./types/journey"

const JOURNEY_FLOW: Record<JourneyStep, JourneyStep | null> = {
  portal: "sage-select",
  "sage-select": "sage-chat",
  "sage-chat": "council",
  council: "memory",
  memory: "observatory",
  observatory: "multiverse",
  multiverse: null,
}

const STEP_ROUTES: Record<JourneyStep, string> = {
  portal: "/",
  "sage-select": "/sages",
  "sage-chat": "/playground",
  council: "/council",
  memory: "/memory",
  observatory: "/observatory",
  multiverse: "/multiverse",
}

export function getNextStep(context: JourneyContext): JourneyStep | null {
  return JOURNEY_FLOW[context.currentStep] || null
}

export function getNextRoute(context: JourneyContext): string {
  const nextStep = getNextStep(context)
  if (!nextStep) return "/multiverse"
  return STEP_ROUTES[nextStep]
}

export function createJourneyContext(purpose?: Purpose): JourneyContext {
  return {
    currentStep: "portal",
    purpose,
    activeSageIds: [],
    startedAt: new Date().toISOString(),
    completedSteps: [],
  }
}

export function updateJourneyStep(context: JourneyContext, newStep: JourneyStep): JourneyContext {
  return {
    ...context,
    currentStep: newStep,
    completedSteps: [...new Set([...context.completedSteps, newStep])],
  }
}

export function resolveStepUrl(context: JourneyContext): string {
  const { currentStep, activeSageIds, lastArtifactId } = context

  switch (currentStep) {
    case "sage-chat":
      return activeSageIds.length > 0 ? `/playground?sage=${activeSageIds[0]}` : "/playground"
    case "council":
      return activeSageIds.length >= 2 ? `/council?sages=${activeSageIds.join(",")}` : "/council"
    case "memory":
      return lastArtifactId ? `/memory?highlight=${lastArtifactId}` : "/memory"
    default:
      return STEP_ROUTES[currentStep]
  }
}
