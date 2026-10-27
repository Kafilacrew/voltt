import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Tasteful Traditional Indian Diya (Earthen / Brass Lamp)
 * Features an organic curved lamp base, glowing oil surface, and multilayered flickering flame.
 */
export default function Diya({
  size = 'md',
  className = '',
  showGlow = true,
  animated = true,
  ariaLabel = 'Decorative Diwali Diya',
}) {
  if (!DIWALI_CONFIG.enabled || !DIWALI_CONFIG.showDiyas) return null
  const sizeMap = {
    xs: { width: 18, height: 18 },
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 44, height: 44 },
    inline: { width: 20, height: 20 },
  }

  const { width, height } = sizeMap[size] || sizeMap.md

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width, height }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Radial Aura Glow */}
          <radialGradient
            id="diya-aura-glow"
            cx="50%"
            cy="36%"
            r="48%"
            fx="50%"
            fy="36%"
          >
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#EA580C" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </radialGradient>

          {/* Outer Flame Gradient */}
          <linearGradient id="diya-flame-outer" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="35%" stopColor="#F97316" />
            <stop offset="75%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          {/* Inner Flame Gradient */}
          <linearGradient id="diya-flame-inner" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Earthen Clay / Brass Base Gradient */}
          <linearGradient id="diya-clay-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="35%" stopColor="#B45309" />
            <stop offset="70%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Lip / Rim Highlight Gradient */}
          <linearGradient id="diya-rim-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Oil Pool Gradient */}
          <linearGradient id="diya-oil" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>

        {/* ── Soft Ambient Glow Behind Flame ── */}
        {showGlow && (
          <circle
            cx="32"
            cy="24"
            r="22"
            fill="url(#diya-aura-glow)"
            className={animated ? 'animate-diya-aura' : ''}
          />
        )}

        {/* ── Diya Earthen Clay / Brass Body ── */}
        {/* Foot / Pedestal Base */}
        <path
          d="M24 53C24 55.5 27 57 32 57C37 57 40 55.5 40 53L38 49H26L24 53Z"
          fill="#78350F"
        />

        {/* Bowl Body with graceful curve */}
        <path
          d="M8 38C10 48 20 54 32 54C44 54 54 48 56 38C56 36 54 35 52 35C44 37 20 37 12 35C10 35 8 36 8 38Z"
          fill="url(#diya-clay-base)"
        />

        {/* Lamp Lip / Rim */}
        <ellipse
          cx="32"
          cy="36"
          rx="24"
          ry="5.5"
          fill="url(#diya-clay-base)"
          stroke="url(#diya-rim-gold)"
          strokeWidth="1.2"
        />

        {/* Oil Pool Interior */}
        <ellipse
          cx="32"
          cy="36.5"
          rx="19"
          ry="3.8"
          fill="url(#diya-oil)"
        />

        {/* Small Golden Oil Reflection */}
        <ellipse
          cx="32"
          cy="36"
          rx="10"
          ry="1.8"
          fill="#D97706"
          opacity="0.75"
        />

        {/* Decorative Rim Dots (Traditional Indian motif) */}
        <circle cx="16" cy="37" r="1.1" fill="#FDE68A" opacity="0.8" />
        <circle cx="24" cy="39" r="1.1" fill="#FDE68A" opacity="0.8" />
        <circle cx="32" cy="39.5" r="1.2" fill="#FDE68A" opacity="0.9" />
        <circle cx="40" cy="39" r="1.1" fill="#FDE68A" opacity="0.8" />
        <circle cx="48" cy="37" r="1.1" fill="#FDE68A" opacity="0.8" />

        {/* ── Multilayered Flickering Flame ── */}
        <g className={animated ? 'animate-diya-flame' : ''}>
          {/* Flame Wick Base */}
          <path
            d="M31.2 36C31.5 32 32.5 32 32.8 36Z"
            fill="#451A03"
          />

          {/* Outer Orange Flame */}
          <path
            d="M32 8C27 18 24 24 24 29C24 33.5 27.5 36 32 36C36.5 36 40 33.5 40 29C40 24 37 18 32 8Z"
            fill="url(#diya-flame-outer)"
          />

          {/* Core Golden Flame */}
          <path
            d="M32 14C29 20 27 24 27 28C27 31 29 33 32 33C35 33 37 31 37 28C37 24 35 20 32 14Z"
            fill="url(#diya-flame-inner)"
          />

          {/* White-Hot Flame Center */}
          <ellipse
            cx="32"
            cy="27"
            rx="2.2"
            ry="4.5"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  )
}
