import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Elegant Radiating Golden Firework Starburst
 * Matches the reference image with multi-tier golden rays, sparkling star tips, and ambient gold dust.
 * Pure SVG, zero external dependencies, pointer-events: none.
 */
export default function GoldenFirework({
  size = 240,
  className = '',
  opacity = 0.75,
  animated = true,
  ariaLabel = 'Festive Golden Firework Burst',
}) {
  if (!DIWALI_CONFIG.enabled || (DIWALI_CONFIG.showHeroParticles !== undefined && !DIWALI_CONFIG.showHeroParticles)) {
    return null
  }

  // Radiating rays along 24 angle directions
  const rays = [
    { angle: 0, length: 90, width: 1.4, star: true },
    { angle: 15, length: 65, width: 1.0, star: false },
    { angle: 30, length: 82, width: 1.3, star: true },
    { angle: 45, length: 95, width: 1.5, star: true },
    { angle: 60, length: 70, width: 1.1, star: false },
    { angle: 75, length: 85, width: 1.3, star: true },
    { angle: 90, length: 92, width: 1.5, star: true },
    { angle: 105, length: 68, width: 1.0, star: false },
    { angle: 120, length: 84, width: 1.3, star: true },
    { angle: 135, length: 96, width: 1.5, star: true },
    { angle: 150, length: 72, width: 1.1, star: false },
    { angle: 165, length: 86, width: 1.3, star: true },
    { angle: 180, length: 90, width: 1.4, star: true },
    { angle: 195, length: 66, width: 1.0, star: false },
    { angle: 210, length: 80, width: 1.3, star: true },
    { angle: 225, length: 94, width: 1.5, star: true },
    { angle: 240, length: 70, width: 1.1, star: false },
    { angle: 255, length: 85, width: 1.3, star: true },
    { angle: 270, length: 92, width: 1.5, star: true },
    { angle: 285, length: 68, width: 1.0, star: false },
    { angle: 300, length: 82, width: 1.3, star: true },
    { angle: 315, length: 95, width: 1.5, star: true },
    { angle: 330, length: 72, width: 1.1, star: false },
    { angle: 345, length: 86, width: 1.3, star: true },
  ]

  // Outer scattered golden spark dots
  const sparkDots = [
    { r: 76, a: 8, s: 1.6 },
    { r: 88, a: 22, s: 2.2 },
    { r: 60, a: 38, s: 1.4 },
    { r: 92, a: 52, s: 2.4 },
    { r: 74, a: 68, s: 1.8 },
    { r: 98, a: 82, s: 2.0 },
    { r: 64, a: 98, s: 1.5 },
    { r: 85, a: 112, s: 2.2 },
    { r: 95, a: 128, s: 1.9 },
    { r: 68, a: 142, s: 1.6 },
    { r: 90, a: 158, s: 2.5 },
    { r: 75, a: 172, s: 1.8 },
    { r: 96, a: 188, s: 2.0 },
    { r: 62, a: 202, s: 1.4 },
    { r: 86, a: 218, s: 2.3 },
    { r: 94, a: 232, s: 1.7 },
    { r: 70, a: 248, s: 2.1 },
    { r: 92, a: 262, s: 2.5 },
    { r: 66, a: 278, s: 1.5 },
    { r: 88, a: 292, s: 2.2 },
    { r: 97, a: 308, s: 1.9 },
    { r: 72, a: 322, s: 1.7 },
    { r: 91, a: 338, s: 2.4 },
    { r: 65, a: 352, s: 1.5 },
  ]

  return (
    <div
      className={`pointer-events-none select-none ${animated ? 'animate-firework-shimmer' : ''} ${className}`}
      style={{ width: size, height: size, opacity }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Radial gold firework core glow */}
          <radialGradient id="fw-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#FFF9C4" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#FDE047" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Ray linear gradient from bright white-gold to golden amber */}
          <linearGradient id="fw-ray-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#FFF176" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#FBBF24" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
          </linearGradient>

          <filter id="fw-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Diffuse Ambient Center Bloom */}
        <circle cx="100" cy="100" r="42" fill="url(#fw-core-glow)" filter="url(#fw-blur)" />

        {/* Radiating Rays */}
        {rays.map((ray, i) => {
          const rad = (ray.angle * Math.PI) / 180
          const x2 = 100 + ray.length * Math.cos(rad)
          const y2 = 100 + ray.length * Math.sin(rad)
          return (
            <g key={`ray-${i}`}>
              <line
                x1="100"
                y1="100"
                x2={x2}
                y2={y2}
                stroke="url(#fw-ray-grad)"
                strokeWidth={ray.width}
                strokeLinecap="round"
              />
              {ray.star && (
                <circle cx={x2} cy={y2} r={ray.width * 1.3} fill="#FFF9C4" opacity="0.9" />
              )}
            </g>
          )
        })}

        {/* Scattered Spark Dots */}
        {sparkDots.map((dot, i) => {
          const rad = (dot.a * Math.PI) / 180
          const cx = 100 + dot.r * Math.cos(rad)
          const cy = 100 + dot.r * Math.sin(rad)
          return (
            <circle
              key={`dot-${i}`}
              cx={cx}
              cy={cy}
              r={dot.s}
              fill="#FDE047"
              opacity="0.8"
            />
          )
        })}

        {/* Core Starburst Flash */}
        <polygon
          points="100,88 103,97 112,100 103,103 100,112 97,103 88,100 97,97"
          fill="#FFFFFF"
          opacity="0.95"
        />
        <circle cx="100" cy="100" r="3.2" fill="#FFFFFF" />
      </svg>
    </div>
  )
}
