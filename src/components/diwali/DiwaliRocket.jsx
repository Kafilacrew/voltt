import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Traditional Diwali Bottle Rocket
 * Matches the reference image:
 * - Festive crimson & cream diagonal striped cylindrical body
 * - Crimson conical nosecone
 * - Bamboo guide stick
 * - Golden sparkling exhaust tail with fiery flame and star sparkles
 * - Gentle hover animation
 */
export default function DiwaliRocket({
  direction = 'left', // 'left' (angled ~45 deg right-up), 'right' (angled ~-45 deg left-up), 'mini'
  size = 140,
  className = '',
  ariaLabel = 'Festive Diwali Rocket',
}) {
  if (!DIWALI_CONFIG.enabled) return null

  if (direction === 'mini') {
    return (
      <div
        className={`inline-block pointer-events-none select-none ${className}`}
        style={{ width: size || 28, height: size || 28 }}
        role="img"
        aria-label={ariaLabel}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Wooden Stick */}
          <line x1="22" y1="42" x2="10" y2="58" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" />
          {/* Flame Plume */}
          <path d="M22,42 Q18,48 12,54 Q20,48 24,44 Z" fill="#F59E0B" />
          <circle cx="16" cy="50" r="1.5" fill="#FDE047" />
          {/* Striped Rocket Body */}
          <g transform="rotate(45 32 32)">
            <rect x="27" y="22" width="10" height="20" rx="1.5" fill="#FFFFFF" />
            <path d="M27,24 L37,28 L37,31 L27,27 Z" fill="#DC2626" />
            <path d="M27,31 L37,35 L37,38 L27,34 Z" fill="#DC2626" />
            <path d="M27,38 L37,42 L37,42 L27,42 Z" fill="#DC2626" />
            {/* Nosecone */}
            <polygon points="32,12 26,22 38,22" fill="#DC2626" />
          </g>
        </svg>
      </div>
    )
  }

  const isLeft = direction === 'left'

  return (
    <div
      className={`pointer-events-none select-none animate-rocket-float ${className}`}
      style={{
        width: size,
        height: size * 1.6,
        transform: isLeft ? 'none' : 'scaleX(-1)',
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 120 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Golden exhaust plume gradient */}
          <linearGradient id="rocket-exhaust" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="20%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#FBBF24" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#F97316" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </linearGradient>

          {/* Radial exhaust burst glow */}
          <radialGradient id="exhaust-glow" cx="50%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          <filter id="glow-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
        </defs>

        {/* ── 1. Fiery Golden Rocket Exhaust Trail ── */}
        <g opacity="0.92">
          {/* Ambient plume glow */}
          <ellipse cx="44" cy="115" rx="16" ry="32" fill="url(#exhaust-glow)" filter="url(#glow-blur)" />

          {/* Main fiery jet tail */}
          <path
            d="M52,86 Q46,120 32,165 Q40,128 58,92 Z"
            fill="url(#rocket-exhaust)"
          />
          <path
            d="M48,88 Q38,135 22,178 Q36,130 54,92 Z"
            fill="url(#rocket-exhaust)"
            opacity="0.85"
          />
          {/* Hot core flame */}
          <path
            d="M51,87 Q47,108 38,132 Q45,108 55,90 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />

          {/* Scattered glowing ember sparks */}
          <circle cx="36" cy="120" r="2.2" fill="#FFF59D" />
          <circle cx="28" cy="142" r="1.8" fill="#FDE047" />
          <circle cx="42" cy="150" r="1.4" fill="#F59E0B" />
          <circle cx="20" cy="168" r="1.6" fill="#FFF59D" />
          <circle cx="15" cy="182" r="1.2" fill="#F97316" />
          <circle cx="30" cy="175" r="1.5" fill="#FBBF24" />

          {/* Small 4-point star sparks */}
          <polygon points="34,130 35,134 39,135 35,136 34,140 33,136 29,135 33,134" fill="#FFFFFF" opacity="0.9" />
          <polygon points="22,152 23,155 26,156 23,157 22,160 21,157 18,156 21,155" fill="#FEF08A" opacity="0.85" />
        </g>

        {/* ── 2. Bamboo / Wooden Guide Stick ── */}
        <line
          x1="57"
          y1="82"
          x2="24"
          y2="175"
          stroke="#795548"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="57.5"
          y1="82"
          x2="24.5"
          y2="175"
          stroke="#A1887F"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* ── 3. Rocket Body Assembly (Angled ~45 deg) ── */}
        <g transform="rotate(32 64 64)">
          {/* Rocket cylinder background */}
          <rect
            x="56"
            y="32"
            width="18"
            height="44"
            rx="3"
            fill="#FAF8F3"
            stroke="#D9A441"
            strokeWidth="0.6"
          />

          {/* Diagonal Red / Crimson Stripes */}
          <clipPath id="rocket-clip">
            <rect x="56" y="32" width="18" height="44" rx="3" />
          </clipPath>

          <g clipPath="url(#rocket-clip)">
            <path d="M52,36 L78,48 L78,54 L52,42 Z" fill="#DC2626" />
            <path d="M52,48 L78,60 L78,66 L52,54 Z" fill="#DC2626" />
            <path d="M52,60 L78,72 L78,78 L52,66 Z" fill="#DC2626" />
            <path d="M52,72 L78,84 L78,90 L52,78 Z" fill="#DC2626" />
            {/* Subtle cylinder 3D shade */}
            <rect x="56" y="32" width="4" height="44" fill="#000000" opacity="0.12" />
            <rect x="70" y="32" width="4" height="44" fill="#FFFFFF" opacity="0.25" />
          </g>

          {/* Conical Red Nosecone */}
          <polygon
            points="65,12 53,32 77,32"
            fill="#B91C1C"
          />
          <polygon
            points="65,12 59,32 71,32"
            fill="#DC2626"
          />
          <line x1="65" y1="12" x2="65" y2="32" stroke="#EF4444" strokeWidth="0.8" />

          {/* Base Cap / Collar */}
          <rect x="55" y="74" width="20" height="4" rx="1.5" fill="#78350F" />
        </g>
      </svg>
    </div>
  )
}
