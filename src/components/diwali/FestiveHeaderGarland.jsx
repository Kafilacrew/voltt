import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Festive Header Garland & Toran
 * Directly matches the reference image:
 * 1. Top catenary fairy light strand with drop cords of varied hanging lengths & warm incandescent bulbs
 * 2. Left & Right vertical marigold torans with ornate hanging brass lanterns (kandil) and hanging diyas
 * 3. Pure SVG, zero layout shift, seamless attachment to hero top edge, pointer-events: none
 */
export default function FestiveHeaderGarland({ className = '' }) {
  if (!DIWALI_CONFIG.enabled || !DIWALI_CONFIG.showFairyLights) return null

  // 17 hanging bulbs along 3 sweeping catenary arcs across a 1400px coordinate space
  // yBase is on the wire; dropLen is the vertical pendant cord length
  const bulbs = [
    { x: 100, yWire: 14, dropLen: 18, color: '#FFCA28', glow: '#FFE082', anim: 'fairy-bulb-1' },
    { x: 175, yWire: 24, dropLen: 28, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-2' },
    { x: 250, yWire: 30, dropLen: 16, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3' },
    { x: 330, yWire: 24, dropLen: 32, color: '#FFF59D', glow: '#FFF9C4', anim: 'fairy-bulb-1' },
    { x: 410, yWire: 14, dropLen: 14, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-2' },

    { x: 490, yWire: 22, dropLen: 26, color: '#FF6F00', glow: '#FFA000', anim: 'fairy-bulb-3' },
    { x: 570, yWire: 30, dropLen: 36, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-1' },
    { x: 650, yWire: 32, dropLen: 18, color: '#FF8A65', glow: '#FFAB91', anim: 'fairy-bulb-2' },
    { x: 730, yWire: 30, dropLen: 34, color: '#FFF9C4', glow: '#FFF59D', anim: 'fairy-bulb-3' },
    { x: 810, yWire: 22, dropLen: 20, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-1' },
    { x: 890, yWire: 14, dropLen: 14, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-2' },

    { x: 970, yWire: 24, dropLen: 30, color: '#FF7043', glow: '#FF8A65', anim: 'fairy-bulb-3' },
    { x: 1050, yWire: 30, dropLen: 16, color: '#FFB300', glow: '#FFCA28', anim: 'fairy-bulb-1' },
    { x: 1130, yWire: 26, dropLen: 32, color: '#FFF59D', glow: '#FFF9C4', anim: 'fairy-bulb-2' },
    { x: 1210, yWire: 18, dropLen: 22, color: '#FFA000', glow: '#FFB300', anim: 'fairy-bulb-3' },
    { x: 1285, yWire: 12, dropLen: 16, color: '#FFD54F', glow: '#FFE082', anim: 'fairy-bulb-1' },
  ]

  return (
    <div
      className={`absolute top-0 inset-x-0 w-full pointer-events-none select-none z-20 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1400 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-24 sm:h-32 md:h-40 block overflow-visible"
      >
        <defs>
          {/* Wire gradient */}
          <linearGradient id="garland-wire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#451A03" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#B45309" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#78350F" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#B45309" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#451A03" stopOpacity="0.8" />
          </linearGradient>

          {/* Broad warm glow halo for bulbs */}
          <filter id="garland-glow-broad" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" />
          </filter>

          {/* Intense filament glow */}
          <filter id="garland-glow-core" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" />
          </filter>

          {/* Lantern interior glow */}
          <radialGradient id="lantern-interior" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* ── 1. Top Curved Swag Wire Across Entire Viewport ── */}
        <path
          d="M0,6 Q210,38 450,10 Q680,42 930,10 Q1160,38 1400,6"
          stroke="url(#garland-wire-grad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── 2. Hanging Pendant Bulbs with Varied Drop Lengths ── */}
        {bulbs.map((b, idx) => {
          const bulbY = b.yWire + b.dropLen
          return (
            <g key={`bulb-${idx}`} className={b.anim}>
              {/* Vertical hanging cord from main wire */}
              <line
                x1={b.x}
                y1={b.yWire}
                x2={b.x}
                y2={bulbY - 4}
                stroke="#78350F"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.75"
              />

              {/* Outer broad warm radial halo */}
              <circle
                cx={b.x}
                cy={bulbY + 5}
                r="15"
                fill={b.glow}
                opacity="0.45"
                filter="url(#garland-glow-broad)"
              />

              {/* Inner intense radiant aura */}
              <circle
                cx={b.x}
                cy={bulbY + 5}
                r="7"
                fill={b.color}
                opacity="0.8"
                filter="url(#garland-glow-core)"
              />

              {/* Brass socket collar */}
              <rect
                x={b.x - 2.5}
                y={bulbY - 4}
                width="5"
                height="5"
                rx="1"
                fill="#5B2902"
                stroke="#D97706"
                strokeWidth="0.6"
              />

              {/* Teardrop glowing glass bulb body */}
              <path
                d={`M${b.x - 3.8},${bulbY + 1} C${b.x - 5.5},${bulbY + 5.5} ${b.x - 4.2},${bulbY + 11} ${b.x},${bulbY + 13.5} C${b.x + 4.2},${bulbY + 11} ${b.x + 5.5},${bulbY + 5.5} ${b.x + 3.8},${bulbY + 1} Z`}
                fill={b.color}
                opacity="0.95"
              />

              {/* Specular curved highlight */}
              <path
                d={`M${b.x - 2.4},${bulbY + 3} Q${b.x - 3.2},${bulbY + 6.5} ${b.x - 1.2},${bulbY + 10}`}
                stroke="#FFFFFF"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Hot core incandescent filament spark */}
              <circle
                cx={b.x}
                cy={bulbY + 5.5}
                r="1.8"
                fill="#FFFFFF"
                opacity="0.98"
              />
            </g>
          )
        })}

        {/* ── 3. LEFT Vertical Hanging Toran: Marigolds + Ornate Lantern + Diya ── */}
        <g transform="translate(32, 0)">
          {/* Top connecting cord */}
          <line x1="0" y1="0" x2="0" y2="15" stroke="#78350F" strokeWidth="1.2" />

          {/* Marigold Blossom 1 (Orange) */}
          <circle cx="0" cy="22" r="9" fill="#EA580C" />
          <circle cx="0" cy="22" r="7" fill="#F97316" />
          <circle cx="0" cy="22" r="4" fill="#FBBF24" />

          {/* Marigold Blossom 2 (Golden Yellow) */}
          <circle cx="0" cy="38" r="9" fill="#D97706" />
          <circle cx="0" cy="38" r="7" fill="#FBBF24" />
          <circle cx="0" cy="38" r="4" fill="#FEF08A" />

          {/* Cord to Lantern */}
          <line x1="0" y1="47" x2="0" y2="60" stroke="#78350F" strokeWidth="1" />

          {/* ── Ornate Hanging Brass Lantern (Kandil) ── */}
          <g transform="translate(0, 60)">
            {/* Ambient lantern radial halo */}
            <circle cx="0" cy="20" r="28" fill="#FBBF24" opacity="0.38" filter="url(#garland-glow-broad)" />
            <circle cx="0" cy="20" r="14" fill="#FEF08A" opacity="0.7" filter="url(#garland-glow-core)" />

            {/* Lantern Top Cap & Ring */}
            <circle cx="0" cy="2" r="3" stroke="#B45309" strokeWidth="1" fill="none" />
            <path d="M-10,8 L10,8 L6,14 L-6,14 Z" fill="#92400E" stroke="#D97706" strokeWidth="0.8" />

            {/* Glowing Octagonal Glass/Paper Body */}
            <path
              d="M-10,14 L10,14 L13,26 L6,38 L-6,38 L-13,26 Z"
              fill="url(#lantern-interior)"
              stroke="#B45309"
              strokeWidth="1.2"
            />
            {/* Cutout Geometric Lattice Lines */}
            <line x1="-10" y1="14" x2="6" y2="38" stroke="#78350F" strokeWidth="0.8" opacity="0.75" />
            <line x1="10" y1="14" x2="-6" y2="38" stroke="#78350F" strokeWidth="0.8" opacity="0.75" />
            <circle cx="0" cy="25" r="3.5" fill="#FFFFFF" opacity="0.9" />

            {/* Lantern Bottom Base */}
            <path d="M-6,38 L6,38 L4,42 L-4,42 Z" fill="#92400E" stroke="#D97706" strokeWidth="0.8" />
          </g>

          {/* Cord to Lower Diya */}
          <line x1="0" y1="102" x2="0" y2="116" stroke="#78350F" strokeWidth="1" />

          {/* Marigold Blossom 3 (Orange) */}
          <circle cx="0" cy="124" r="8.5" fill="#EA580C" />
          <circle cx="0" cy="124" r="6.5" fill="#F97316" />
          <circle cx="0" cy="124" r="3.5" fill="#FBBF24" />

          {/* Cord to Hanging Diya */}
          <line x1="0" y1="133" x2="0" y2="144" stroke="#78350F" strokeWidth="1" />

          {/* ── Hanging Brass Diya ── */}
          <g transform="translate(0, 144)">
            {/* Diya Glow */}
            <circle cx="0" cy="12" r="16" fill="#F59E0B" opacity="0.45" filter="url(#garland-glow-broad)" />
            {/* Flame */}
            <path
              d="M0,0 C-3,4 -3,8 0,11 C3,8 3,4 0,0 Z"
              fill="#FEF08A"
              className="animate-diya-flame"
            />
            <circle cx="0" cy="7" r="1.5" fill="#FFFFFF" />
            {/* Brass Bowl */}
            <path
              d="M-10,10 C-10,18 10,18 10,10 C6,12 -6,12 -10,10 Z"
              fill="#B45309"
              stroke="#D97706"
              strokeWidth="0.8"
            />
            {/* Hanging Ring Top */}
            <circle cx="0" cy="3" r="2" stroke="#B45309" strokeWidth="0.8" fill="none" />
          </g>
        </g>

        {/* ── 4. RIGHT Vertical Hanging Toran: Marigolds + Ornate Lantern + Diya ── */}
        <g transform="translate(1368, 0)">
          {/* Top connecting cord */}
          <line x1="0" y1="0" x2="0" y2="15" stroke="#78350F" strokeWidth="1.2" />

          {/* Marigold Blossom 1 (Orange) */}
          <circle cx="0" cy="22" r="9" fill="#EA580C" />
          <circle cx="0" cy="22" r="7" fill="#F97316" />
          <circle cx="0" cy="22" r="4" fill="#FBBF24" />

          {/* Marigold Blossom 2 (Golden Yellow) */}
          <circle cx="0" cy="38" r="9" fill="#D97706" />
          <circle cx="0" cy="38" r="7" fill="#FBBF24" />
          <circle cx="0" cy="38" r="4" fill="#FEF08A" />

          {/* Cord to Lantern */}
          <line x1="0" y1="47" x2="0" y2="60" stroke="#78350F" strokeWidth="1" />

          {/* ── Ornate Hanging Brass Lantern (Kandil) ── */}
          <g transform="translate(0, 60)">
            {/* Ambient lantern radial halo */}
            <circle cx="0" cy="20" r="28" fill="#FBBF24" opacity="0.38" filter="url(#garland-glow-broad)" />
            <circle cx="0" cy="20" r="14" fill="#FEF08A" opacity="0.7" filter="url(#garland-glow-core)" />

            {/* Lantern Top Cap & Ring */}
            <circle cx="0" cy="2" r="3" stroke="#B45309" strokeWidth="1" fill="none" />
            <path d="M-10,8 L10,8 L6,14 L-6,14 Z" fill="#92400E" stroke="#D97706" strokeWidth="0.8" />

            {/* Glowing Octagonal Glass/Paper Body */}
            <path
              d="M-10,14 L10,14 L13,26 L6,38 L-6,38 L-13,26 Z"
              fill="url(#lantern-interior)"
              stroke="#B45309"
              strokeWidth="1.2"
            />
            {/* Cutout Geometric Lattice Lines */}
            <line x1="-10" y1="14" x2="6" y2="38" stroke="#78350F" strokeWidth="0.8" opacity="0.75" />
            <line x1="10" y1="14" x2="-6" y2="38" stroke="#78350F" strokeWidth="0.8" opacity="0.75" />
            <circle cx="0" cy="25" r="3.5" fill="#FFFFFF" opacity="0.9" />

            {/* Lantern Bottom Base */}
            <path d="M-6,38 L6,38 L4,42 L-4,42 Z" fill="#92400E" stroke="#D97706" strokeWidth="0.8" />
          </g>

          {/* Cord to Lower Diya */}
          <line x1="0" y1="102" x2="0" y2="116" stroke="#78350F" strokeWidth="1" />

          {/* Marigold Blossom 3 (Orange) */}
          <circle cx="0" cy="124" r="8.5" fill="#EA580C" />
          <circle cx="0" cy="124" r="6.5" fill="#F97316" />
          <circle cx="0" cy="124" r="3.5" fill="#FBBF24" />

          {/* Cord to Hanging Diya */}
          <line x1="0" y1="133" x2="0" y2="144" stroke="#78350F" strokeWidth="1" />

          {/* ── Hanging Brass Diya ── */}
          <g transform="translate(0, 144)">
            {/* Diya Glow */}
            <circle cx="0" cy="12" r="16" fill="#F59E0B" opacity="0.45" filter="url(#garland-glow-broad)" />
            {/* Flame */}
            <path
              d="M0,0 C-3,4 -3,8 0,11 C3,8 3,4 0,0 Z"
              fill="#FEF08A"
              className="animate-diya-flame"
            />
            <circle cx="0" cy="7" r="1.5" fill="#FFFFFF" />
            {/* Brass Bowl */}
            <path
              d="M-10,10 C-10,18 10,18 10,10 C6,12 -6,12 -10,10 Z"
              fill="#B45309"
              stroke="#D97706"
              strokeWidth="0.8"
            />
            {/* Hanging Ring Top */}
            <circle cx="0" cy="3" r="2" stroke="#B45309" strokeWidth="0.8" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  )
}
