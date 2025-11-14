// Cosmic particle system for enhanced visual depth
// Pure CSS/Canvas implementation for v0 compatibility

export interface Particle {
  x: number
  y: number
  z: number
  size: number
  speed: number
  color: string
  opacity: number
}

export class CosmicParticleSystem {
  private particles: Particle[] = []
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private animationId: number | null = null

  constructor(particleCount: number = 100) {
    this.initParticles(particleCount)
  }

  private initParticles(count: number) {
    const colors = ['#60A5FA', '#A78BFA', '#EC4899', '#F59E0B']
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
        z: Math.random() * 1000,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3
      })
    }
  }

  mount(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.resize()
    this.animate()
  }

  unmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  private resize() {
    if (!this.canvas) return
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  private animate = () => {
    if (!this.canvas || !this.ctx) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Update and draw particles
    this.particles.forEach(particle => {
      // Move particle
      particle.z -= particle.speed
      if (particle.z <= 0) {
        particle.z = 1000
        particle.x = Math.random() * this.canvas!.width
        particle.y = Math.random() * this.canvas!.height
      }

      // Calculate 3D projection
      const scale = 1000 / (1000 + particle.z)
      const x2d = particle.x * scale + this.canvas!.width / 2 * (1 - scale)
      const y2d = particle.y * scale + this.canvas!.height / 2 * (1 - scale)
      const size = particle.size * scale

      // Draw particle with glow
      this.ctx!.fillStyle = particle.color
      this.ctx!.globalAlpha = particle.opacity * scale
      this.ctx!.beginPath()
      this.ctx!.arc(x2d, y2d, size, 0, Math.PI * 2)
      this.ctx!.fill()

      // Add glow effect
      this.ctx!.shadowBlur = 10
      this.ctx!.shadowColor = particle.color
    })

    this.ctx.globalAlpha = 1
    this.ctx.shadowBlur = 0

    this.animationId = requestAnimationFrame(this.animate)
  }
}
