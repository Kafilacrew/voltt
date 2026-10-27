import React, { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'
import Diya from './Diya'
import MarigoldAccent from './MarigoldAccent'
import { DIWALI_CONFIG } from './diwaliConfig'

const DISMISS_KEY = 'voltt_diwali_banner_dismissed_v1'

/**
 * Compact, Tasteful Diwali Greeting Banner
 * Sits at the top of the viewport, harmonizing with Voltt's royal navy & gold palette.
 * Strictly adheres to truth in advertising (no invented discounts).
 */
export default function DiwaliBanner() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === 'true') {
        setDismissed(true)
      }
    } catch (_) {}
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true')
    } catch (_) {}
  }

  if (dismissed || !DIWALI_CONFIG.enabled) return null

  return (
    <div
      className="relative z-50 bg-[#1A0B2E] text-white border-b border-[#D9A441]/40 py-2 px-3 sm:px-4 overflow-hidden select-none"
      role="region"
      aria-label="Diwali Festive Greeting"
    >
      {/* Subtle Warm Amber Gradient Accent Underlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D9A441]/10 via-[#F97316]/15 to-[#D9A441]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 relative">
        {/* Left Diya & Marigold grouping */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Diya size="xs" showGlow={false} />
          <MarigoldAccent size={16} />
        </div>

        {/* Center Festive Message */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center text-xs tracking-wide">
          <span className="sm:hidden shrink-0">
            <Diya size="xs" showGlow={false} />
          </span>

          <span className="inline-flex items-center gap-1.5 font-display font-medium text-[#FAF8F3]">
            <span className="hidden md:inline font-bold text-[#FBBF24]">
              ✨ Shubh Deepavali!
            </span>
            <span className="hidden sm:inline">
              Celebrate the Festival of Lights with clean nutrition, 0 added sugar &amp; essential electrolytes.
            </span>
            <span className="sm:hidden font-medium">
              Celebrate Diwali with Clean Fuel &amp; 0 Added Sugar ✨
            </span>
          </span>

          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/40 text-[#FDE68A] text-[10px] font-mono font-bold uppercase tracking-wider ml-1">
            <Sparkles className="w-2.5 h-2.5 text-[#FBBF24]" />
            Pure Energy
          </span>
        </div>

        {/* Right Diya & Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <MarigoldAccent size={16} />
            <Diya size="xs" showGlow={false} />
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss Diwali greeting"
            className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
