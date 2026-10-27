import React from 'react'
import { motion } from 'framer-motion'
import { Truck, Sparkles, Zap, ShieldCheck } from 'lucide-react'

export default function AnnouncementBar() {
  const items = [
    {
      content: <span>FREE SHIPPING ON ORDERS ABOVE ₹500</span>,
      icon: Truck,
    },
    {
      content: <span>COMPLETE NUTRITION</span>,
      icon: Zap,
    },
    {
      content: (
        <span>
          ADDED <span className="text-[#D8A24A] font-extrabold">ELECTROLYTES</span> (Na + Mg + K)
        </span>
      ),
      icon: Sparkles,
    },
    {
      content: <span>0 ADDED SUGAR</span>,
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="relative bg-gradient-to-r from-[#0C1E3C] via-[#0F2C59] to-[#0C1E3C] text-white py-2 px-4 overflow-hidden border-t border-[#D9A441]/40 border-b border-[#D9A441]/30 select-none shadow-[0_2px_10px_rgba(217,164,65,0.08)]">
      {/* Subtle Warm Amber / Gold Shimmer Accent Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D9A441]/8 via-[#F97316]/10 to-[#D9A441]/8 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-center relative z-10">
        
        {/* Subtle Marquee Ticker */}
        <div className="flex items-center gap-8 overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-8 whitespace-nowrap"
          >
            {[...items, ...items].map((item, idx) => {
              const IconComp = item.icon
              return (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#FAF8F3]">
                  <IconComp className="w-3.5 h-3.5 text-[#FBBF24] shrink-0 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                  <div>{item.content}</div>
                  <span className="text-[#D9A441]/70 mx-3">✦</span>
                </div>
              )
            })}
          </motion.div>
        </div>

      </div>
    </div>
  )
}
