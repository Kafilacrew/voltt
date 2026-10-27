import React from 'react'

/**
 * Traditional Indian Sky Lantern (Akash Kandil)
 * Lightweight vector illustration with:
 * - Octagonal faceted glowing paper lantern body
 * - Warm interior candle/diya illumination
 * - Hanging suspension cord with brass bead
 * - Flowing golden-saffron paper tassels that dangle at the bottom
 * - Smooth floating animation & reduced-motion support
 */
export default function SkyLantern({
  size = 50,
  opacity = 1,
  anim = 'float-1',
  variant = 'gold',
  className = '',
}) {
  const height = Math.round(size * 1.55)
  const animClass = anim === 'float-2' ? 'animate-lantern-float-2' : 'animate-lantern-float-1'

  // Variant color definitions
  const colors = {
    gold: {
      core: '#FFF9C4',
      primary: '#F59E0B',
      secondary: '#D97706',
      dark: '#92400E',
      glow: '#FBBF24',
    },
    amber: {
      core: '#FEF08A',
      primary: '#EA580C',
      secondary: '#B45309',
      dark: '#78350F',
      glow: '#F59E0B',
    },
    saffron: {
      core: '#FFFFFF',
      primary: '#F97316',
      secondary: '#C2410C',
      dark: '#7C2D12',
      glow: '#FB923C',
    },
  }[variant] || {
    core: '#FFF9C4',
    primary: '#F59E0B',
    secondary: '#D97706',
    dark: '#92400E',
    glow: '#FBBF24',
  }

  const uid = React.useId().replace(/:/g, '')

  return (
    <div
      className={`pointer-events-none select-none ${animClass} ${className}`}
      style={{ width: size, height, opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        <defs>
          {/* Radial candle glow from inside */}
          <radialGradient id={`kandil-glow-${uid}`} cx="50%" cy="45%" r="48%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor={colors.core} stopOpacity="0.9" />
            <stop offset="65%" stopColor={colors.primary} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.3" />
          </radialGradient>

          {/* Facet shading gradients */}
          <linearGradient id={`kandil-left-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id={`kandil-right-${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.85" />
          </linearGradient>

          {/* Soft outer aura blur */}
          <filter id={`kandil-blur-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>

        {/* ── 1. Soft Ambient Golden Glow Halo Behind Lantern ── */}
        <circle
          cx="50"
          cy="52"
          r="38"
          fill={colors.glow}
          opacity="0.35"
          filter={`url(#kandil-blur-${uid})`}
        />

        {/* ── 2. Top Hanging Cord & Bead ── */}
        <line x1="50" y1="0" x2="50" y2="16" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="50" cy="8" r="2.5" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
        {/* Top Suspension Ring */}
        <circle cx="50" cy="18" r="3" stroke="#B45309" strokeWidth="1.2" fill="none" />

        {/* ── 3. Top Decorative Crown / Cap ── */}
        <path
          d="M38,22 L62,22 L56,26 L44,26 Z"
          fill={colors.dark}
          stroke="#D97706"
          strokeWidth="0.8"
        />

        {/* ── 4. Main Octagonal / Faceted Lantern Body ── */}
        {/* Background glow base */}
        <path
          d="M50,26 L76,46 L68,76 L50,86 L32,76 L24,46 Z"
          fill={`url(#kandil-glow-${uid})`}
          stroke={colors.dark}
          strokeWidth="1.2"
        />

        {/* Left Side Facet */}
        <path
          d="M50,26 L24,46 L32,76 L50,86 Z"
          fill={`url(#kandil-left-${uid})`}
          opacity="0.55"
        />

        {/* Right Side Facet */}
        <path
          d="M50,26 L76,46 L68,76 L50,86 Z"
          fill={`url(#kandil-right-${uid})`}
          opacity="0.4"
        />

        {/* Center Glowing Diamond Aperture */}
        <polygon
          points="50,34 64,54 50,74 36,54"
          fill={`url(#kandil-glow-${uid})`}
          stroke="#FEF08A"
          strokeWidth="0.8"
          opacity="0.95"
        />

        {/* Inner Diamond Core Highlight */}
        <polygon
          points="50,42 58,54 50,66 42,54"
          fill="#FFFFFF"
          opacity="0.85"
        />

        {/* Traditional Geometric Lattice Accent Lines */}
        <line x1="24" y1="46" x2="76" y2="46" stroke="#92400E" strokeWidth="0.7" opacity="0.6" />
        <line x1="32" y1="76" x2="68" y2="76" stroke="#92400E" strokeWidth="0.7" opacity="0.6" />
        <line x1="50" y1="26" x2="50" y2="86" stroke="#92400E" strokeWidth="0.8" opacity="0.5" />

        {/* Decorative corner star florets */}
        <circle cx="50" cy="26" r="2" fill="#FEF08A" />
        <circle cx="24" cy="46" r="1.8" fill="#FBBF24" />
        <circle cx="76" cy="46" r="1.8" fill="#FBBF24" />
        <circle cx="32" cy="76" r="1.8" fill="#FBBF24" />
        <circle cx="68" cy="76" r="1.8" fill="#FBBF24" />
        <circle cx="50" cy="86" r="2.2" fill="#FEF08A" />

        {/* ── 5. Bottom Base Collar ── */}
        <path
          d="M42,86 L58,86 L55,90 L45,90 Z"
          fill={colors.dark}
          stroke="#D97706"
          strokeWidth="0.8"
        />

        {/* ── 6. Flowing Hanging Paper Tassels / Ribbons ── */}
        <g className="animate-lantern-tassel">
          {/* Central longest tassel */}
          <path
            d="M50,90 Q51,118 49,146 L51,146 Q53,118 51,90 Z"
            fill="#FBBF24"
            opacity="0.95"
          />
          <circle cx="50" cy="148" r="1.8" fill="#F59E0B" />

          {/* Inner Left Tassel */}
          <path
            d="M46,90 Q44,114 43,138 L45,138 Q47,114 48,90 Z"
            fill="#F97316"
            opacity="0.9"
          />
          <circle cx="44" cy="140" r="1.5" fill="#D97706" />

          {/* Inner Right Tassel */}
          <path
            d="M54,90 Q56,114 57,138 L55,138 Q54,114 52,90 Z"
            fill="#F97316"
            opacity="0.9"
          />
          <circle cx="56" cy="140" r="1.5" fill="#D97706" />

          {/* Outer Left Tassel */}
          <path
            d="M42,90 Q39,108 38,126 L40,126 Q41,108 44,90 Z"
            fill="#EA580C"
            opacity="0.85"
          />
          <circle cx="39" cy="128" r="1.4" fill="#B45309" />

          {/* Outer Right Tassel */}
          <path
            d="M58,90 Q61,108 62,126 L60,126 Q59,108 56,90 Z"
            fill="#EA580C"
            opacity="0.85"
          />
          <circle cx="61" cy="128" r="1.4" fill="#B45309" />
        </g>
      </svg>
    </div>
  )
}
