/**
 * Map emotional tone to scene gradient
 * Client-safe utility - no server dependencies
 */
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
