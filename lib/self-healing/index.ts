/**
 * Self-Healing System
 * Entry point for all self-healing functionality
 */

export { SelfHealingDetector, SelfHealingMonitor, type SystemIssue } from './detector'
export { SelfHealingAutoFix } from './auto-fix'

// Re-export for convenience
import { SelfHealingDetector, SelfHealingMonitor } from './detector'
import { SelfHealingAutoFix } from './auto-fix'

export const SelfHealing = {
  Detector: SelfHealingDetector,
  Monitor: SelfHealingMonitor,
  AutoFix: SelfHealingAutoFix,
}
