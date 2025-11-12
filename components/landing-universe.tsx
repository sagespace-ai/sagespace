"use client"

import { useEffect, useRef } from "react"

export function LandingUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle system
    const particles: Particle[] = []
    const particleCount = 150

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 0.5
        this.opacity = Math.random() * 0.5 + 0.2

        const colors = ["#00f0ff", "#7c5dff", "#ff006e"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Central cosmic core
    let coreGlow = 1
    let coreGlowDirection = 0.02

    // Animation loop
    const animate = () => {
      // Clear with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(3, 6, 16, 1)")
      gradient.addColorStop(0.5, "rgba(15, 20, 32, 0.8)")
      gradient.addColorStop(1, "rgba(3, 6, 16, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = "rgba(0, 240, 255, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.globalAlpha = (1 - distance / 150) * 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      // Draw central core with pulsing glow
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Core glow pulse
      coreGlow += coreGlowDirection
      if (coreGlow > 1.5 || coreGlow < 0.5) {
        coreGlowDirection *= -1
      }

      // Outer rings
      ctx.strokeStyle = `rgba(124, 93, 255, ${0.3 * coreGlow})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, 120 * coreGlow, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 * coreGlow})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(centerX, centerY, 180 * coreGlow, 0, Math.PI * 2)
      ctx.stroke()

      // Central point with glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40)
      glowGradient.addColorStop(0, `rgba(0, 240, 255, ${0.8 * coreGlow})`)
      glowGradient.addColorStop(0.5, `rgba(124, 93, 255, ${0.3 * coreGlow})`)
      glowGradient.addColorStop(1, "rgba(124, 93, 255, 0)")
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
      ctx.fill()

      // Core dot
      ctx.fillStyle = "#00f0ff"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
      ctx.fill()

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
}
