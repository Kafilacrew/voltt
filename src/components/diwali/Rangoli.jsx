import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Traditional Heritage Rangoli (Mandala) Watermark Motif
 * Symmetrical sacred geometric art in fine gold lines.
 * Designed to sit in outer corners as a delicate festive accent with zero layout obstruction.
 */
export default function Rangoli({
  size = 280,
  className = '',
  opacity = 0.22,
  ariaLabel = 'Festive Rangoli Pattern',
}) {
  if (!DIWALI_CONFIG.enabled || (DIWALI_CONFIG.showRangoli !== undefined && !DIWALI_CONFIG.showRangoli)) {
    return null
  }

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
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
          <linearGradient id="rangoli-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#D9A441" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="rangoli-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Center Bindu & Inner Rings */}
        <circle cx="100" cy="100" r="4" fill="url(#rangoli-gold)" />
        <circle cx="100" cy="100" r="10" stroke="url(#rangoli-gold)" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="100" cy="100" r="18" stroke="url(#rangoli-gold)" strokeWidth="1.2" />

        {/* Inner 8-Petal Lotus Bloom */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={`inner-petal-${i}`} transform={`rotate(${angle} 100 100)`}>
            <path
              d="M100,82 C94,74 92,64 100,52 C108,64 106,74 100,82 Z"
              stroke="url(#rangoli-gold)"
              strokeWidth="1.2"
              fill="url(#rangoli-fill)"
            />
            <circle cx="100" cy="52" r="2" fill="url(#rangoli-gold)" />
            <line x1="100" y1="82" x2="100" y2="60" stroke="url(#rangoli-gold)" strokeWidth="0.8" />
          </g>
        ))}

        {/* Middle Concentric Orbit Ring with Dots */}
        <circle cx="100" cy="100" r="48" stroke="url(#rangoli-gold)" strokeWidth="1" />
        <circle cx="100" cy="100" r="54" stroke="url(#rangoli-gold)" strokeWidth="0.8" strokeDasharray="3 3" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const cx = 100 + 51 * Math.cos(rad)
          const cy = 100 + 51 * Math.sin(rad)
          return <circle key={`dot-${i}`} cx={cx} cy={cy} r="1.5" fill="url(#rangoli-gold)" />
        })}

        {/* Outer 8 Broad Decorative Petals */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
          <g key={`outer-petal-${i}`} transform={`rotate(${angle} 100 100)`}>
            <path
              d="M100,46 C85,32 86,16 100,2 C114,16 115,32 100,46 Z"
              stroke="url(#rangoli-gold)"
              strokeWidth="1.4"
              fill="url(#rangoli-fill)"
            />
            {/* Inner vein */}
            <path d="M100,46 Q92,26 100,10" stroke="url(#rangoli-gold)" strokeWidth="0.8" />
            <path d="M100,46 Q108,26 100,10" stroke="url(#rangoli-gold)" strokeWidth="0.8" />
            <circle cx="100" cy="2" r="2.8" fill="url(#rangoli-gold)" />
          </g>
        ))}

        {/* Outer Star Tips & Scalloped Halo */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={`star-tip-${i}`} transform={`rotate(${angle} 100 100)`}>
            <path
              d="M100,46 L95,30 L100,16 L105,30 Z"
              stroke="url(#rangoli-gold)"
              strokeWidth="1"
            />
            <circle cx="100" cy="16" r="2" fill="url(#rangoli-gold)" />
          </g>
        ))}

        {/* Outer Perimeter Ring */}
        <circle cx="100" cy="100" r="95" stroke="url(#rangoli-gold)" strokeWidth="1" strokeDasharray="4 2" />
      </svg>
    </div>
  )
}
