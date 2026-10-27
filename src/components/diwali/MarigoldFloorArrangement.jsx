import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'

/**
 * Rich Marigold & Glowing Diya Floor Arrangement
 * Matches the reference image:
 * - Traditional clay/brass diyas with realistic oil flames and warm ambient floor glow puddle
 * - Lush fresh orange & yellow marigold blossoms (genda phool)
 * - Deep green leaves & scattered floor flower petals
 */
export default function MarigoldFloorArrangement({
  variant = 'double-diya', // 'double-diya' (lower-left) or 'border-cluster' (lower-right)
  className = '',
}) {
  if (!DIWALI_CONFIG.enabled || (DIWALI_CONFIG.showMarigolds !== undefined && !DIWALI_CONFIG.showMarigolds)) {
    return null
  }

  if (variant === 'border-cluster') {
    return (
      <div
        className={`pointer-events-none select-none flex items-end gap-1.5 ${className}`}
        role="img"
        aria-label="Festive Marigolds and Diya Corner"
      >
        <svg
          viewBox="0 0 220 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 sm:w-60 md:w-72 h-auto overflow-visible"
        >
          <defs>
            <radialGradient id="diya-floor-puddle-r" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#EA580C" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
            </radialGradient>
            <filter id="puddle-blur-r" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
          </defs>

          {/* Green Leaves */}
          <path d="M120,80 Q135,60 160,65 Q140,82 120,80 Z" fill="#4D733D" />
          <path d="M70,82 Q85,62 110,68 Q90,85 70,82 Z" fill="#5D8C4A" />

          {/* Marigolds chain along bottom */}
          {/* Blossom 1 (Gold) */}
          <circle cx="50" cy="78" r="14" fill="#D97706" />
          <circle cx="50" cy="78" r="11" fill="#FBBF24" />
          <circle cx="50" cy="78" r="6" fill="#FEF08A" />

          {/* Blossom 2 (Orange) */}
          <circle cx="82" cy="74" r="16" fill="#C2410C" />
          <circle cx="82" cy="74" r="13" fill="#EA580C" />
          <circle cx="82" cy="74" r="8" fill="#F97316" />
          <circle cx="82" cy="74" r="4" fill="#FBBF24" />

          {/* Blossom 3 (Yellow) */}
          <circle cx="115" cy="76" r="15" fill="#D97706" />
          <circle cx="115" cy="76" r="12" fill="#FBBF24" />
          <circle cx="115" cy="76" r="6" fill="#FEF08A" />

          {/* Scattered Petals */}
          <ellipse cx="25" cy="88" rx="4" ry="2" fill="#F59E0B" transform="rotate(-15 25 88)" />
          <ellipse cx="38" cy="92" rx="3.5" ry="1.8" fill="#F97316" transform="rotate(25 38 92)" />
          <ellipse cx="140" cy="85" rx="4.5" ry="2.2" fill="#FBBF24" transform="rotate(-30 140 85)" />

          {/* Right Diya with Warm Glow */}
          <g transform="translate(165, 45)">
            {/* Ambient floor light pool */}
            <ellipse cx="18" cy="42" rx="32" ry="14" fill="url(#diya-floor-puddle-r)" filter="url(#puddle-blur-r)" />

            {/* Flickering Flame */}
            <path
              d="M18,12 C13,20 13,26 18,32 C23,26 23,20 18,12 Z"
              fill="#FEF08A"
              className="animate-diya-flame"
            />
            <path
              d="M18,18 C15,23 15,27 18,31 C21,27 21,23 18,18 Z"
              fill="#FFFFFF"
            />

            {/* Diya Clay Bowl */}
            <path
              d="M2,32 C0,44 36,44 34,32 C28,35 8,35 2,32 Z"
              fill="#831843"
              stroke="#D97706"
              strokeWidth="1"
            />
            {/* Rim highlight */}
            <ellipse cx="18" cy="32" rx="16" ry="3.5" fill="#B45309" stroke="#F59E0B" strokeWidth="0.8" />
            <ellipse cx="18" cy="32" rx="12" ry="2.2" fill="#451A03" />
          </g>
        </svg>
      </div>
    )
  }

  // Default: 'double-diya' (Lower-Left corner matching reference screenshot)
  return (
    <div
      className={`pointer-events-none select-none flex items-end ${className}`}
      role="img"
      aria-label="Festive Marigolds and Traditional Diyas"
    >
      <svg
        viewBox="0 0 320 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-64 sm:w-80 md:w-96 h-auto overflow-visible"
      >
        <defs>
          {/* Floor light puddle gradient */}
          <radialGradient id="diya-floor-puddle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#EA580C" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </radialGradient>

          <filter id="puddle-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        {/* ── Floor Light Reflection Puddles for Both Diyas ── */}
        <ellipse cx="160" cy="118" rx="55" ry="22" fill="url(#diya-floor-puddle)" filter="url(#puddle-blur)" />
        <ellipse cx="230" cy="125" rx="45" ry="18" fill="url(#diya-floor-puddle)" filter="url(#puddle-blur)" />

        {/* ── Scattered Marigold Flower Petals on Floor ── */}
        <ellipse cx="65" cy="132" rx="5" ry="2.5" fill="#F59E0B" transform="rotate(-20 65 132)" />
        <ellipse cx="78" cy="138" rx="4" ry="2" fill="#EA580C" transform="rotate(35 78 138)" />
        <ellipse cx="115" cy="136" rx="5" ry="2.2" fill="#FBBF24" transform="rotate(-15 115 136)" />
        <ellipse cx="132" cy="142" rx="4.5" ry="2" fill="#F97316" transform="rotate(45 132 142)" />
        <ellipse cx="205" cy="140" rx="4" ry="2" fill="#FDE047" transform="rotate(10 205 140)" />
        <ellipse cx="265" cy="138" rx="5.5" ry="2.5" fill="#EA580C" transform="rotate(-30 265 138)" />
        <ellipse cx="285" cy="142" rx="4" ry="2" fill="#F59E0B" transform="rotate(20 285 142)" />

        {/* ── Green Leaves Underlay ── */}
        <path d="M30,110 Q55,80 85,95 Q55,120 30,110 Z" fill="#365314" />
        <path d="M75,100 Q105,75 135,90 Q105,115 75,100 Z" fill="#4D733D" />
        <path d="M120,95 Q145,70 170,85 Q145,110 120,95 Z" fill="#5D8C4A" />

        {/* ── Lush Marigold Flower Cluster ── */}
        {/* Flower 1 - Large Deep Orange (Bottom Left) */}
        <g transform="translate(45, 105)">
          <circle cx="0" cy="0" r="22" fill="#9A3412" />
          <circle cx="0" cy="0" r="19" fill="#C2410C" />
          <circle cx="0" cy="0" r="15" fill="#EA580C" />
          <circle cx="0" cy="0" r="10" fill="#F97316" />
          <circle cx="0" cy="0" r="5" fill="#FBBF24" />
        </g>

        {/* Flower 2 - Golden Yellow Blossom (Mid Left) */}
        <g transform="translate(78, 88)">
          <circle cx="0" cy="0" r="20" fill="#B45309" />
          <circle cx="0" cy="0" r="17" fill="#D97706" />
          <circle cx="0" cy="0" r="13" fill="#F59E0B" />
          <circle cx="0" cy="0" r="8" fill="#FBBF24" />
          <circle cx="0" cy="0" r="4" fill="#FEF08A" />
        </g>

        {/* Flower 3 - Saffron Orange Blossom (Lower Center) */}
        <g transform="translate(105, 115)">
          <circle cx="0" cy="0" r="18" fill="#9A3412" />
          <circle cx="0" cy="0" r="15" fill="#C2410C" />
          <circle cx="0" cy="0" r="12" fill="#EA580C" />
          <circle cx="0" cy="0" r="7" fill="#F97316" />
          <circle cx="0" cy="0" r="3" fill="#FBBF24" />
        </g>

        {/* Flower 4 - Golden Marigold (Tucked near diya) */}
        <g transform="translate(125, 95)">
          <circle cx="0" cy="0" r="16" fill="#B45309" />
          <circle cx="0" cy="0" r="13" fill="#D97706" />
          <circle cx="0" cy="0" r="9" fill="#FBBF24" />
          <circle cx="0" cy="0" r="4" fill="#FEF08A" />
        </g>

        {/* ── Diya 1 (Primary Front Terracotta Diya) ── */}
        <g transform="translate(160, 68)">
          {/* Flame Halo */}
          <circle cx="0" cy="18" r="20" fill="#F59E0B" opacity="0.45" filter="url(#puddle-blur)" />
          {/* Flame Core */}
          <path
            d="M0,-8 C-7,4 -7,14 0,22 C7,14 7,4 0,-8 Z"
            fill="#FEF08A"
            className="animate-diya-flame"
          />
          <path
            d="M0,0 C-4,8 -4,15 0,21 C4,15 4,8 0,0 Z"
            fill="#FFFFFF"
          />
          <circle cx="0" cy="14" r="2" fill="#FFF9C4" />

          {/* Diya Clay Body */}
          <path
            d="M-26,22 C-28,40 28,40 26,22 C18,26 -18,26 -26,22 Z"
            fill="#7C2D12"
            stroke="#D97706"
            strokeWidth="1.2"
          />
          <ellipse cx="0" cy="22" rx="26" ry="6.5" fill="#9A3412" stroke="#F59E0B" strokeWidth="1" />
          <ellipse cx="0" cy="22" rx="21" ry="4.5" fill="#451A03" />
          <ellipse cx="0" cy="22" rx="16" ry="3" fill="#78350F" opacity="0.8" />
        </g>

        {/* ── Diya 2 (Secondary Diya to the Right) ── */}
        <g transform="translate(230, 80)">
          {/* Flame Halo */}
          <circle cx="0" cy="15" r="16" fill="#F59E0B" opacity="0.4" filter="url(#puddle-blur)" />
          {/* Flame Core */}
          <path
            d="M0,-4 C-6,6 -6,14 0,20 C6,14 6,6 0,-4 Z"
            fill="#FEF08A"
            className="animate-diya-flame"
          />
          <path
            d="M0,3 C-3,10 -3,15 0,19 C3,15 3,10 0,3 Z"
            fill="#FFFFFF"
          />

          {/* Diya Clay Body */}
          <path
            d="M-22,20 C-24,35 24,35 22,20 C15,24 -15,24 -22,20 Z"
            fill="#7C2D12"
            stroke="#D97706"
            strokeWidth="1"
          />
          <ellipse cx="0" cy="20" rx="22" ry="5.5" fill="#9A3412" stroke="#F59E0B" strokeWidth="0.8" />
          <ellipse cx="0" cy="20" rx="17" ry="3.8" fill="#451A03" />
        </g>
      </svg>
    </div>
  )
}
