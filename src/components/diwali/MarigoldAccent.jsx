import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Traditional Marigold (Genda Phool) Floral Accent
 * Ruffled petals in auspicious saffron, warm orange, and golden yellow with green leaf accents.
 */
export default function MarigoldAccent({
  variant = 'single',
  size = 24,
  className = '',
  ariaLabel = 'Festive Marigold Blossom',
}) {
  if (!DIWALI_CONFIG.enabled || !DIWALI_CONFIG.showMarigolds) return null
  if (variant === 'duo') {
    return (
      <div
        className={`inline-flex items-center gap-0.5 select-none ${className}`}
        style={{ height: size }}
        role="img"
        aria-label={ariaLabel}
      >
        {/* Leaf Accent */}
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 24 24"
          fill="none"
          className="-mr-1.5 opacity-90 transform -rotate-12"
        >
          <path
            d="M2 22C6 14 14 6 22 2C20 10 14 18 2 22Z"
            fill="#5D8C4A"
            stroke="#4D733D"
            strokeWidth="0.8"
          />
          <path d="M4 20L18 6" stroke="#79A865" strokeWidth="0.6" strokeLinecap="round" />
        </svg>

        {/* Primary Marigold (Saffron) */}
        <MarigoldBlossom size={size} colorScheme="saffron" />

        {/* Secondary Marigold (Gold) */}
        <MarigoldBlossom size={size * 0.85} colorScheme="gold" className="-ml-1" />
      </div>
    )
  }

  return (
    <MarigoldBlossom
      size={size}
      className={className}
      ariaLabel={ariaLabel}
      colorScheme="saffron"
    />
  )
}

function MarigoldBlossom({
  size = 24,
  className = '',
  colorScheme = 'saffron',
  ariaLabel = 'Marigold Blossom',
}) {
  const outerColor = colorScheme === 'gold' ? '#FBBF24' : '#EA580C'
  const midColor = colorScheme === 'gold' ? '#F59E0B' : '#F97316'
  const innerColor = colorScheme === 'gold' ? '#FEF08A' : '#FDE047'
  const coreColor = '#9A3412'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible select-none ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <radialGradient id={`mg-${colorScheme}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={innerColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="85%" stopColor={outerColor} />
          <stop offset="100%" stopColor={coreColor} />
        </radialGradient>
      </defs>

      {/* Outer Ruffled Petals (12 petals) */}
      <g fill={outerColor} opacity="0.95">
        <circle cx="20" cy="7" r="4.5" />
        <circle cx="27" cy="9" r="4.5" />
        <circle cx="33" cy="15" r="4.5" />
        <circle cx="33" cy="23" r="4.5" />
        <circle cx="29" cy="30" r="4.5" />
        <circle cx="22" cy="33" r="4.5" />
        <circle cx="15" cy="33" r="4.5" />
        <circle cx="9" cy="28" r="4.5" />
        <circle cx="7" cy="21" r="4.5" />
        <circle cx="8" cy="14" r="4.5" />
        <circle cx="13" cy="8" r="4.5" />
      </g>

      {/* Mid Petal Ring */}
      <g fill={midColor}>
        <circle cx="20" cy="11" r="3.6" />
        <circle cx="26" cy="14" r="3.6" />
        <circle cx="28" cy="20" r="3.6" />
        <circle cx="25" cy="26" r="3.6" />
        <circle cx="19" cy="28" r="3.6" />
        <circle cx="13" cy="25" r="3.6" />
        <circle cx="11" cy="19" r="3.6" />
        <circle cx="14" cy="13" r="3.6" />
      </g>

      {/* Inner Petal Ring */}
      <g fill={innerColor}>
        <circle cx="20" cy="15" r="2.8" />
        <circle cx="24" cy="18" r="2.8" />
        <circle cx="23" cy="23" r="2.8" />
        <circle cx="18" cy="24" r="2.8" />
        <circle cx="15" cy="20" r="2.8" />
        <circle cx="17" cy="16" r="2.8" />
      </g>

      {/* Blossom Core Center */}
      <circle cx="20" cy="20" r="3" fill={`url(#mg-${colorScheme})`} />
      <circle cx="20" cy="20" r="1.5" fill="#7C2D12" opacity="0.8" />
    </svg>
  )
}
