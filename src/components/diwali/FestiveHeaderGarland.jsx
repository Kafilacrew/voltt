import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Responsive Festive Header Fairy Light Garland
 * Restores and polishes the warm Diwali atmosphere below the navy announcement bar:
 * - Truly curved catenary hanging swags (never a straight divider or partition line)
 * - Calibrated natural responsive layouts for Mobile (320px-425px), Tablet (640px-1023px), and Desktop (>=1024px)
 * - Thin bronze-gold twisted metallic wire
 * - Realistic incandescent teardrop bulbs with brass socket collars, glowing filaments, and soft halos
 * - Positioned safely behind interactive content with pointer-events: none and overflow-hidden
 */
export default function FestiveHeaderGarland({ className = '' }) {
  if (!DIWALI_CONFIG.enabled || !DIWALI_CONFIG.showFairyLights) return null

  // ── 1. MOBILE BULB CALIBRATION (11 bulbs across 3 deeply curved swags in 420px space) ──
  const mobileBulbs = [
    // Swag 1 (0 -> 140)
    { x: 35, yWire: 17, dropLen: 8, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-1' },
    { x: 70, yWire: 27, dropLen: 12, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-2' },
    { x: 105, yWire: 17, dropLen: 8, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-3' },

    // Swag 2 (140 -> 280)
    { x: 155, yWire: 11, dropLen: 6, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-1' },
    { x: 185, yWire: 22, dropLen: 9, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2' },
    { x: 210, yWire: 28, dropLen: 13, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3' },
    { x: 235, yWire: 22, dropLen: 9, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-1' },
    { x: 265, yWire: 11, dropLen: 6, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-2' },

    // Swag 3 (280 -> 420)
    { x: 315, yWire: 17, dropLen: 8, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-3' },
    { x: 350, yWire: 27, dropLen: 12, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-1' },
    { x: 385, yWire: 17, dropLen: 8, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2' },
  ]

  // ── 2. TABLET BULB CALIBRATION (16 bulbs across 4 sweeping swags in 768px space) ──
  const tabletBulbs = [
    // Swag 1 (0 -> 192)
    { x: 50, yWire: 22, dropLen: 12, color: '#FFCA28', glow: '#FFE082', anim: 'fairy-bulb-1' },
    { x: 96, yWire: 37, dropLen: 18, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-2' },
    { x: 145, yWire: 22, dropLen: 12, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-3' },

    // Swag 2 (192 -> 384)
    { x: 220, yWire: 17, dropLen: 9, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-1' },
    { x: 255, yWire: 30, dropLen: 14, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2' },
    { x: 288, yWire: 39, dropLen: 19, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3' },
    { x: 320, yWire: 30, dropLen: 14, color: '#FFF59D', glow: '#FFF9C4', anim: 'fairy-bulb-1' },
    { x: 355, yWire: 17, dropLen: 9, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-2' },

    // Swag 3 (384 -> 576)
    { x: 415, yWire: 17, dropLen: 9, color: '#FF6F00', glow: '#FFA000', anim: 'fairy-bulb-3' },
    { x: 450, yWire: 30, dropLen: 14, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-1' },
    { x: 480, yWire: 39, dropLen: 19, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-2' },
    { x: 512, yWire: 30, dropLen: 14, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-3' },
    { x: 545, yWire: 17, dropLen: 9, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-1' },

    // Swag 4 (576 -> 768)
    { x: 620, yWire: 22, dropLen: 12, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2' },
    { x: 672, yWire: 37, dropLen: 18, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3' },
    { x: 720, yWire: 22, dropLen: 12, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-1' },
  ]

  // ── 3. DESKTOP BULB CALIBRATION (24 bulbs across 6 deep swags in 1440px space) ──
  const desktopBulbs = [
    // Swag 1 (0 -> 240)
    { x: 60, yWire: 28, dropLen: 14, color: '#FFCA28', glow: '#FFE082', anim: 'fairy-bulb-1' },
    { x: 120, yWire: 51, dropLen: 22, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-2' },
    { x: 180, yWire: 28, dropLen: 14, color: '#FFF59D', glow: '#FFF9C4', anim: 'fairy-bulb-3' },

    // Swag 2 (240 -> 480)
    { x: 280, yWire: 22, dropLen: 12, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-1' },
    { x: 320, yWire: 40, dropLen: 18, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2' },
    { x: 360, yWire: 53, dropLen: 24, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3' },
    { x: 400, yWire: 40, dropLen: 18, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-1' },
    { x: 440, yWire: 22, dropLen: 12, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-2' },

    // Swag 3 (480 -> 720)
    { x: 520, yWire: 24, dropLen: 13, color: '#FF6F00', glow: '#FFA000', anim: 'fairy-bulb-3' },
    { x: 560, yWire: 42, dropLen: 19, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-1' },
    { x: 600, yWire: 55, dropLen: 25, color: '#FF8A65', glow: '#FFAB91', anim: 'fairy-bulb-2' },
    { x: 640, yWire: 42, dropLen: 19, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-3' },
    { x: 680, yWire: 24, dropLen: 13, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-1' },

    // Swag 4 (720 -> 960)
    { x: 760, yWire: 24, dropLen: 13, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2' },
    { x: 800, yWire: 42, dropLen: 19, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3' },
    { x: 840, yWire: 55, dropLen: 25, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-1' },
    { x: 880, yWire: 42, dropLen: 19, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-2' },
    { x: 920, yWire: 24, dropLen: 13, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-3' },

    // Swag 5 (960 -> 1200)
    { x: 1000, yWire: 22, dropLen: 12, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-1' },
    { x: 1040, yWire: 40, dropLen: 18, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-2' },
    { x: 1080, yWire: 53, dropLen: 24, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-3' },
    { x: 1120, yWire: 40, dropLen: 18, color: '#FFF59D', glow: '#FFF9C4', anim: 'fairy-bulb-1' },
    { x: 1160, yWire: 22, dropLen: 12, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-2' },

    // Swag 6 (1200 -> 1440)
    { x: 1260, yWire: 28, dropLen: 14, color: '#FF6F00', glow: '#FFA000', anim: 'fairy-bulb-3' },
    { x: 1320, yWire: 51, dropLen: 22, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-1' },
    { x: 1380, yWire: 28, dropLen: 14, color: '#FFCA28', glow: '#FFE082', anim: 'fairy-bulb-2' },
  ]

  // Reusable Bulb Renderer Function
  const renderBulb = (b, idx, scale = 1) => {
    const bulbY = b.yWire + b.dropLen
    const bulbR = 5 * scale
    const haloR = 12 * scale
    const coreR = 6 * scale

    return (
      <g key={`garland-bulb-${idx}`} className={b.anim}>
        {/* Vertical thin drop cord from catenary wire */}
        <line
          x1={b.x}
          y1={b.yWire}
          x2={b.x}
          y2={bulbY - 3}
          stroke="#78350F"
          strokeWidth={0.9 * scale}
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Outer Broad Ambient Glow Halo */}
        <circle
          cx={b.x}
          cy={bulbY + 4 * scale}
          r={haloR}
          fill={b.glow}
          opacity="0.36"
          filter="url(#garland-glow-soft)"
        />

        {/* Inner Intense Radiant Aura */}
        <circle
          cx={b.x}
          cy={bulbY + 4 * scale}
          r={coreR}
          fill={b.color}
          opacity="0.8"
          filter="url(#garland-glow-core)"
        />

        {/* Brass Socket Collar */}
        <rect
          x={b.x - 2.2 * scale}
          y={bulbY - 3 * scale}
          width={4.4 * scale}
          height={4.2 * scale}
          rx={0.8 * scale}
          fill="#5B2902"
          stroke="#D97706"
          strokeWidth={0.5 * scale}
        />

        {/* Teardrop Glass Bulb Body */}
        <path
          d={`M${b.x - 3.2 * scale},${bulbY + 1 * scale} C${b.x - 4.6 * scale},${bulbY + 5 * scale} ${b.x - 3.5 * scale},${bulbY + 9 * scale} ${b.x},${bulbY + 11.5 * scale} C${b.x + 3.5 * scale},${bulbY + 9 * scale} ${b.x + 4.6 * scale},${bulbY + 5 * scale} ${b.x + 3.2 * scale},${bulbY + 1 * scale} Z`}
          fill={b.color}
          opacity="0.95"
        />

        {/* Specular Curved Highlight on Glass */}
        <path
          d={`M${b.x - 2 * scale},${bulbY + 2.5 * scale} Q${b.x - 2.8 * scale},${bulbY + 5.5 * scale} ${b.x - 1 * scale},${bulbY + 8.5 * scale}`}
          stroke="#FFFFFF"
          strokeWidth={0.75 * scale}
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Incandescent Core Spark */}
        <circle
          cx={b.x}
          cy={bulbY + 4.5 * scale}
          r={1.5 * scale}
          fill="#FFFFFF"
          opacity="0.98"
        />
      </g>
    )
  }

  return (
    <div
      className={`absolute top-0 inset-x-0 w-full max-w-full pointer-events-none select-none z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* ── SHARED SVG FILTER DEFINITIONS (Rendered once) ── */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="garland-wire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#451A03" stopOpacity="0.75" />
            <stop offset="25%" stopColor="#B45309" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#78350F" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#B45309" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#451A03" stopOpacity="0.75" />
          </linearGradient>

          <filter id="garland-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.8" />
          </filter>

          <filter id="garland-glow-core" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" />
          </filter>

          <radialGradient id="toran-lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── 1. MOBILE FAIRY LIGHT GARLAND (< 640px)              ── */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="block sm:hidden w-full max-w-full overflow-hidden">
        <svg
          viewBox="0 0 420 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full max-w-full h-11 block overflow-hidden"
        >
          {/* Natural Hanging Catenary Wire: 3 pronounced swags with 24px sag depth */}
          <path
            d="M0,4 Q70,28 140,6 Q210,29 280,6 Q350,28 420,4"
            stroke="url(#garland-wire-grad)"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Calibrated Mobile Bulbs */}
          {mobileBulbs.map((b, idx) => renderBulb(b, idx, 0.88))}
        </svg>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── 2. TABLET FAIRY LIGHT GARLAND (640px to 1023px)      ── */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="hidden sm:block lg:hidden w-full max-w-full overflow-hidden">
        <svg
          viewBox="0 0 768 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full max-w-full h-14 md:h-16 block overflow-hidden"
        >
          {/* 4 Hanging Catenary Swags across tablet width */}
          <path
            d="M0,6 Q96,38 192,8 Q288,40 384,8 Q480,40 576,8 Q672,38 768,6"
            stroke="url(#garland-wire-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Calibrated Tablet Bulbs */}
          {tabletBulbs.map((b, idx) => renderBulb(b, idx, 0.95))}
        </svg>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── 3. DESKTOP FAIRY LIGHT GARLAND (>= 1024px)           ── */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block w-full max-w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full max-w-full h-20 xl:h-24 block overflow-hidden"
        >
          {/* 6 Generous Catenary Swags across full desktop screen */}
          <path
            d="M0,8 Q120,52 240,12 Q360,54 480,12 Q600,56 720,12 Q840,56 960,12 Q1080,54 1200,12 Q1320,52 1440,8"
            stroke="url(#garland-wire-grad)"
            strokeWidth="1.7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Calibrated Desktop Bulbs */}
          {desktopBulbs.map((b, idx) => renderBulb(b, idx, 1.1))}

          {/* ── Desktop Left Vertical Hanging Toran at Far Edge (x=36) ── */}
          <g transform="translate(36, 0)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#78350F" strokeWidth="1.2" />
            <circle cx="0" cy="20" r="8" fill="#EA580C" />
            <circle cx="0" cy="20" r="5" fill="#FBBF24" />
            <circle cx="0" cy="34" r="8" fill="#D97706" />
            <circle cx="0" cy="34" r="5" fill="#FEF08A" />
            <line x1="0" y1="42" x2="0" y2="52" stroke="#78350F" strokeWidth="1" />
            {/* Hanging mini kandil */}
            <g transform="translate(0, 52)">
              <circle cx="0" cy="16" r="20" fill="#FBBF24" opacity="0.3" filter="url(#garland-glow-soft)" />
              <path d="M-8,10 L8,10 L10,20 L5,30 L-5,30 L-10,20 Z" fill="url(#toran-lantern-glow)" stroke="#B45309" strokeWidth="1" />
              <circle cx="0" cy="20" r="2.5" fill="#FFFFFF" opacity="0.9" />
              <path d="M-4,30 L4,30 L3,34 L-3,34 Z" fill="#92400E" />
              <line x1="0" y1="34" x2="0" y2="48" stroke="#D97706" strokeWidth="1" />
            </g>
          </g>

          {/* ── Desktop Right Vertical Hanging Toran at Far Edge (x=1404) ── */}
          <g transform="translate(1404, 0)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#78350F" strokeWidth="1.2" />
            <circle cx="0" cy="20" r="8" fill="#EA580C" />
            <circle cx="0" cy="20" r="5" fill="#FBBF24" />
            <circle cx="0" cy="34" r="8" fill="#D97706" />
            <circle cx="0" cy="34" r="5" fill="#FEF08A" />
            <line x1="0" y1="42" x2="0" y2="52" stroke="#78350F" strokeWidth="1" />
            {/* Hanging mini kandil */}
            <g transform="translate(0, 52)">
              <circle cx="0" cy="16" r="20" fill="#FBBF24" opacity="0.3" filter="url(#garland-glow-soft)" />
              <path d="M-8,10 L8,10 L10,20 L5,30 L-5,30 L-10,20 Z" fill="url(#toran-lantern-glow)" stroke="#B45309" strokeWidth="1" />
              <circle cx="0" cy="20" r="2.5" fill="#FFFFFF" opacity="0.9" />
              <path d="M-4,30 L4,30 L3,34 L-3,34 Z" fill="#92400E" />
              <line x1="0" y1="34" x2="0" y2="48" stroke="#D97706" strokeWidth="1" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
