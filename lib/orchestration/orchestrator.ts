import type { Plan, PlanStep, MessageEnvelope, AuditEvent } from "@/lib/types"
import { executeResearcherAgent } from "./agents/researcher"
import { executeCreatorAgent } from "./agents/creator"
import { executeCriticAgent } from "./agents/critic"
import { executeSafetyAgent } from "./agents/safety"
import { v4 as uuidv4 } from "uuid"

export type OrchestrationResult = {
  success: boolean
  outputs: any[]
  auditTrail: AuditEvent[]
  requiresHumanReview: boolean
  reviewReason?: string
}

export async function orchestratePlan(plan: Plan): Promise<OrchestrationResult> {
  const auditTrail: AuditEvent[] = []
  const outputs: any[] = []
  let requiresHumanReview = false
  let reviewReason: string | undefined

  // Log plan execution start
  auditTrail.push(createAuditEvent(plan.taskId, "orchestrator", "plan_started", null, { planId: plan.id }))

  // Build dependency graph
  const stepMap = new Map(plan.steps.map((step) => [step.id, step]))
  const completedSteps = new Set<string>()

  // Execute steps respecting dependencies
  while (completedSteps.size < plan.steps.length) {
    const readySteps = plan.steps.filter(
      (step) => !completedSteps.has(step.id) && step.dependencies.every((depId) => completedSteps.has(depId)),
    )

    if (readySteps.length === 0) {
      throw new Error("Circular dependency or unsatisfiable plan")
    }

    // Execute ready steps in parallel
    const results = await Promise.allSettled(readySteps.map((step) => executeStep(step, plan.taskId, auditTrail)))

    results.forEach((result, index) => {
      const step = readySteps[index]
      completedSteps.add(step.id)

      if (result.status === "fulfilled") {
        outputs.push(result.value.output)

        // Check if human review is needed
        if (result.value.envelope.risk.hallucination > 0.7 || result.value.envelope.risk.safetyFlags.length > 0) {
          requiresHumanReview = true
          reviewReason = `High risk detected: ${result.value.envelope.risk.safetyFlags.join(", ")}`
        }
      } else {
        auditTrail.push(createAuditEvent(plan.taskId, "orchestrator", "step_failed", step, { error: result.reason }))
      }
    })
  }

  // Final safety check
  const safetyCheck = await executeSafetyAgent({
    taskId: plan.taskId,
    outputs,
    auditTrail,
  })

  if (!safetyCheck.passed) {
    requiresHumanReview = true
    reviewReason = safetyCheck.reason
  }

  auditTrail.push(
    createAuditEvent(plan.taskId, "orchestrator", "plan_completed", null, { outputCount: outputs.length }),
  )

  return {
    success: true,
    outputs,
    auditTrail,
    requiresHumanReview,
    reviewReason,
  }
}

async function executeStep(
  step: PlanStep,
  taskId: string,
  auditTrail: AuditEvent[],
): Promise<{ output: any; envelope: MessageEnvelope }> {
  const before = { step: step.action, status: "pending" }

  let envelope: MessageEnvelope
  let output: any

  // Route to appropriate agent based on role
  switch (step.agentRole) {
    case "researcher":
      envelope = await executeResearcherAgent(step, taskId)
      output = envelope.outputs
      break
    case "creator":
      envelope = await executeCreatorAgent(step, taskId)
      output = envelope.outputs
      break
    case "critic":
      envelope = await executeCriticAgent(step, taskId)
      output = envelope.outputs
      break
    default:
      throw new Error(`Unknown agent role: ${step.agentRole}`)
  }

  const after = { step: step.action, status: "completed", confidence: envelope.confidence }

  auditTrail.push(createAuditEvent(taskId, step.agentRole, "step_executed", before, after))

  return { output, envelope }
}

function createAuditEvent(taskId: string, actor: string, action: string, before: any, after: any): AuditEvent {
  return {
    id: uuidv4(),
    taskId,
    timestamp: new Date(),
    actor,
    action,
    before,
    after,
    signature: generateSignature({ taskId, actor, action, timestamp: new Date() }),
  }
}

function generateSignature(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString("base64").substring(0, 32)
}
