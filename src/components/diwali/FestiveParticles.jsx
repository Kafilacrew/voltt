import React, { useEffect, useRef } from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Enhanced Festive Atmosphere Canvas
 * Renders:
 * 1. Layered soft golden bokeh light orbs creating optical depth
 * 2. Scattered tiny floating glowing gold dust particles
 * 3. Occasional elegant golden firework blooms in outer peripheral corners
 * 
 * Performance & Accessibility:
 * - Strictly pointer-events: none, z-0 layer
 * - Auto-pauses off-screen via IntersectionObserver
 * - Fully respects prefers-reduced-motion
 */
export default function FestiveParticles({ className = '' }) {
  if (!DIWALI_CONFIG.enabled || !DIWALI_CONFIG.showHeroParticles) return null
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let isVisible = true
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      initBokeh()
    }

    window.addEventListener('resize', handleResize)

    // ── 1. Layered Warm Golden Bokeh Orbs (creating background depth) ──
    let bokehOrbs = []
    function initBokeh() {
      const colors = [
        { r: 251, g: 191, b: 36 }, // Gold (#FBBF24)
        { r: 245, g: 158, b: 11 }, // Amber (#F59E0B)
        { r: 254, g: 240, b: 138 }, // Champagne (#FEF08A)
        { r: 249, g: 115, b: 22 }, // Warm Orange (#F97316)
        { r: 217, g: 164, b: 65 }, // Voltt Heritage Gold (#D9A441)
      ]

      bokehOrbs = [
        // Upper left quadrant (subtle behind/above eyebrow)
        { x: width * 0.12, y: height * 0.22, radius: 85, color: colors[0], baseAlpha: 0.16, phase: 0, speed: 0.008, vx: 0.12, vy: -0.08 },
        { x: width * 0.24, y: height * 0.38, radius: 60, color: colors[2], baseAlpha: 0.14, phase: 1.5, speed: 0.01, vx: -0.09, vy: 0.07 },
        // Mid-top glow
        { x: width * 0.52, y: height * 0.16, radius: 110, color: colors[2], baseAlpha: 0.12, phase: 2.7, speed: 0.007, vx: 0.08, vy: 0.06 },
        // Upper right quadrant (behind product card)
        { x: width * 0.78, y: height * 0.24, radius: 100, color: colors[1], baseAlpha: 0.20, phase: 0.8, speed: 0.009, vx: -0.1, vy: -0.06 },
        { x: width * 0.88, y: height * 0.44, radius: 75, color: colors[0], baseAlpha: 0.18, phase: 3.2, speed: 0.011, vx: 0.07, vy: 0.09 },
        // Lower quadrants
        { x: width * 0.08, y: height * 0.75, radius: 95, color: colors[3], baseAlpha: 0.15, phase: 4.1, speed: 0.008, vx: 0.08, vy: -0.07 },
        { x: width * 0.85, y: height * 0.80, radius: 105, color: colors[4], baseAlpha: 0.17, phase: 1.9, speed: 0.009, vx: -0.08, vy: -0.08 },
        { x: width * 0.40, y: height * 0.82, radius: 70, color: colors[1], baseAlpha: 0.13, phase: 5.0, speed: 0.012, vx: -0.06, vy: 0.05 },
      ]
    }
    initBokeh()

    // ── 2. Scattered Tiny Floating Glowing Particles ──
    const particleCount = 32
    const dustParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.0 + Math.random() * 2.2,
      baseAlpha: 0.2 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.025,
      vy: -(0.18 + Math.random() * 0.35), // Gently drift upwards
      vx: (Math.random() - 0.5) * 0.2,
      color: ['#FDE047', '#FBBF24', '#F59E0B', '#FEF08A', '#FFFFFF'][Math.floor(Math.random() * 5)],
      isStar: Math.random() > 0.4,
    }))

    // ── 3. Elegant Outer Edge Firework Bursts ──
    let fireworkRings = []
    let fireworkSparks = []
    let lastFireworkTime = Date.now() - 1500 // Spawn initial burst shortly after load

    function spawnFirework() {
      // Pick peripheral safe zones: away from hero title text and CTA button
      const safeCorners = [
        // Upper Left outer margin
        { x: width * (0.06 + Math.random() * 0.12), y: height * (0.14 + Math.random() * 0.18) },
        // Upper Right margin above product
        { x: width * (0.80 + Math.random() * 0.12), y: height * (0.12 + Math.random() * 0.18) },
        // Far Right flank
        { x: width * (0.85 + Math.random() * 0.09), y: height * (0.55 + Math.random() * 0.22) },
      ]
      const origin = safeCorners[Math.floor(Math.random() * safeCorners.length)]

      const palettes = [
        ['#FFF9C4', '#FDE047', '#F59E0B', '#FBBF24'], // Pure Champagne Gold
        ['#FED7AA', '#F97316', '#EA580C', '#FBBF24'], // Warm Saffron Flame
        ['#FDE68A', '#D9A441', '#FEF08A', '#FFFFFF'], // Voltt Heritage Gold
      ]
      const palette = palettes[Math.floor(Math.random() * palettes.length)]

      // Shockwave ring
      fireworkRings.push({
        x: origin.x,
        y: origin.y,
        radius: 2,
        maxRadius: 36 + Math.random() * 24,
        alpha: 0.7,
        color: palette[1],
      })

      // Star sparks
      const sparkCount = 26 + Math.floor(Math.random() * 14)
      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() * 0.25 - 0.12)
        const speed = 1.4 + Math.random() * 2.8
        fireworkSparks.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 0.95,
          decay: 0.012 + Math.random() * 0.009,
          gravity: 0.022,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: 1.6 + Math.random() * 1.8,
        })
      }
    }

    // Intersection observer to auto-pause off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    function render() {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)

      // ── Step A: Draw Layered Soft Bokeh Orbs ──
      for (const orb of bokehOrbs) {
        orb.phase += orb.speed
        orb.x += orb.vx
        orb.y += orb.vy

        // Wrap boundaries gently
        if (orb.x < -orb.radius) orb.x = width + orb.radius
        if (orb.x > width + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = height + orb.radius
        if (orb.y > height + orb.radius) orb.y = -orb.radius

        const currentAlpha = orb.baseAlpha + Math.sin(orb.phase) * 0.06
        if (currentAlpha > 0) {
          const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)
          const { r, g, b } = orb.color
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha.toFixed(3)})`)
          grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${(currentAlpha * 0.45).toFixed(3)})`)
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ── Step B: Update & Draw Floating Gold Dust & Stars ──
      for (const p of dustParticles) {
        p.phase += p.twinkleSpeed
        p.y += p.vy
        p.x += p.vx

        // Wrap to bottom when floating off top
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        const alpha = Math.max(0, Math.min(1, p.baseAlpha + Math.sin(p.phase) * 0.3))
        if (alpha > 0.02) {
          ctx.save()
          ctx.globalAlpha = alpha
          ctx.fillStyle = p.color
          ctx.shadowBlur = 4
          ctx.shadowColor = p.color

          if (p.isStar) {
            // Draw 4-point twinkle star
            const s = p.size * 1.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y - s)
            ctx.lineTo(p.x + s * 0.3, p.y)
            ctx.lineTo(p.x, p.y + s)
            ctx.lineTo(p.x - s * 0.3, p.y)
            ctx.closePath()
            ctx.fill()
          } else {
            // Draw soft round micro-particle
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.restore()
        }
      }

      // ── Step C: Firework Generation (every 3.8 to 4.8 seconds) ──
      const now = Date.now()
      if (now - lastFireworkTime > 3800) {
        spawnFirework()
        lastFireworkTime = now
      }

      // ── Step D: Draw Expanding Firework Rings ──
      for (let i = fireworkRings.length - 1; i >= 0; i--) {
        const ring = fireworkRings[i]
        ring.radius += 1.2
        ring.alpha -= 0.022

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          fireworkRings.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = ring.alpha
        ctx.strokeStyle = ring.color
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // ── Step E: Draw Firework Sparks with Trails ──
      for (let i = fireworkSparks.length - 1; i >= 0; i--) {
        const s = fireworkSparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += s.gravity
        s.vx *= 0.985
        s.alpha -= s.decay

        if (s.alpha <= 0) {
          fireworkSparks.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.fillStyle = s.color
        ctx.shadowBlur = 6
        ctx.shadowColor = s.color

        // Spark head
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()

        // Short spark trail
        ctx.strokeStyle = s.color
        ctx.lineWidth = s.size * 0.7
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2)
        ctx.stroke()

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    />
  )
}
