import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Enhanced Festive Fairy Lights Strand
 * Suspended across the top header with prominent, warm incandescent micro-bulbs.
 * Features:
 * - Visible multi-layer radial filament glow halos
 * - Brass socket collars and catenary wire strand
 * - Gentle brightness breathing cycles
 * - Zero layout shift, pure SVG & CSS, pointer-events: none
 */
export default function FairyLights({ className = '' }) {
  if (!DIWALI_CONFIG.enabled || !DIWALI_CONFIG.showFairyLights) return null

  // 18 calibrated bulb positions across 1200px coordinate space along hanging catenary swags
  const bulbs = [
    { x: 30, y: 16, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-1', size: 1 },
    { x: 95, y: 24, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2', size: 1.1 },
    { x: 165, y: 28, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3', size: 1.05 },
    { x: 235, y: 22, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-1', size: 1 },
    { x: 305, y: 14, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-2', size: 0.95 },
    { x: 375, y: 24, color: '#FF6F00', glow: '#FFA000', anim: 'fairy-bulb-3', size: 1.1 },
    { x: 445, y: 29, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-1', size: 1.05 },
    { x: 515, y: 22, color: '#FF8A65', glow: '#FFAB91', anim: 'fairy-bulb-2', size: 1 },
    { x: 585, y: 14, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-3', size: 0.95 },
    { x: 655, y: 24, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-1', size: 1.1 },
    { x: 725, y: 29, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2', size: 1.05 },
    { x: 795, y: 21, color: '#FF6F00', glow: '#FFA000', anim: 'fairy-bulb-3', size: 1 },
    { x: 865, y: 14, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-1', size: 0.95 },
    { x: 935, y: 24, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-2', size: 1.1 },
    { x: 1005, y: 29, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3', size: 1.05 },
    { x: 1075, y: 22, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-1', size: 1 },
    { x: 1140, y: 16, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-2', size: 0.95 },
    { x: 1180, y: 12, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-3', size: 0.9 },
  ]

  return (
    <div
      className={`w-full overflow-hidden pointer-events-none select-none relative z-30 ${className}`}
      aria-hidden="true"
    >
      {/* Soft ambient warm light wash directly under the light string */}
      <div className="absolute inset-x-0 top-0 h-4 sm:h-5 bg-gradient-to-b from-[#FFA000]/12 via-[#FFD54F]/06 to-transparent pointer-events-none" />

      <svg
        viewBox="0 0 1200 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-7 sm:h-9 md:h-11 block overflow-visible"
      >
        <defs>
          {/* Wire gradient (rich bronze-gold metallic twisted cord) */}
          <linearGradient id="fairy-wire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#451A03" stopOpacity="0.6" />
            <stop offset="20%" stopColor="#D97706" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#78350F" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#D97706" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#78350F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#451A03" stopOpacity="0.6" />
          </linearGradient>

          {/* Broad, warm ambient diffusion filter */}
          <filter id="fairy-broad-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" />
          </filter>

          {/* Intense filament core glow filter */}
          <filter id="fairy-core-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" />
          </filter>
        </defs>

        {/* ── Catenary Swagged Wire Strand (4 Deep Natural Hanging Arcs) ── */}
        <path
          d="M0,8 Q150,33 290,11 Q430,34 570,11 Q710,34 850,11 Q1010,33 1200,8"
          stroke="url(#fairy-wire-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Glowing Incandescent Bulbs with Multi-layer Halos ── */}
        {bulbs.map((bulb, idx) => (
          <g key={idx} className={bulb.anim}>
            {/* Outer Broad Ambient Halo */}
            <circle
              cx={bulb.x}
              cy={bulb.y + 6}
              r={13 * bulb.size}
              fill={bulb.glow}
              opacity="0.4"
              filter="url(#fairy-broad-glow)"
            />

            {/* Inner Intense Radiant Aura */}
            <circle
              cx={bulb.x}
              cy={bulb.y + 6}
              r={6.5 * bulb.size}
              fill={bulb.color}
              opacity="0.75"
              filter="url(#fairy-core-glow)"
            />

            {/* Small Brass Socket Collar */}
            <rect
              x={bulb.x - 2.2}
              y={bulb.y - 4}
              width="4.4"
              height="5"
              rx="1.2"
              fill="#5B2902"
              stroke="#D97706"
              strokeWidth="0.5"
            />

            {/* Teardrop Glass Bulb Body */}
            <path
              d={`M${bulb.x - 3.4 * bulb.size},${bulb.y + 1} C${bulb.x - 5 * bulb.size},${bulb.y + 5.5} ${bulb.x - 3.8 * bulb.size},${bulb.y + 10} ${bulb.x},${bulb.y + 12 * bulb.size} C${bulb.x + 3.8 * bulb.size},${bulb.y + 10} ${bulb.x + 5 * bulb.size},${bulb.y + 5.5} ${bulb.x + 3.4 * bulb.size},${bulb.y + 1} Z`}
              fill={bulb.color}
              opacity="0.95"
            />

            {/* Glass Specular Highlight Curve */}
            <path
              d={`M${bulb.x - 2.2 * bulb.size},${bulb.y + 3} Q${bulb.x - 3 * bulb.size},${bulb.y + 6} ${bulb.x - 1.2 * bulb.size},${bulb.y + 9}`}
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Bright Incandescent Hot Core Spark */}
            <circle
              cx={bulb.x}
              cy={bulb.y + 5.5}
              r={1.6 * bulb.size}
              fill="#FFFFFF"
              opacity="0.98"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
