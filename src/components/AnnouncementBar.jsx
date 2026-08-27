import React from 'react'
import { motion } from 'framer-motion'
import { Truck, Sparkles, Zap, ShieldCheck } from 'lucide-react'

export default function AnnouncementBar() {
  const items = [
    { text: 'FREE SHIPPING ON ORDERS ABOVE ₹500', icon: Truck },
    { text: '10G CLEAN WHEY PROTEIN', icon: Zap },
    { text: 'ADDED ELECTROLYTES (Na + Mg)', icon: Sparkles },
    { text: 'ZERO ARTIFICIAL SWEETENERS', icon: ShieldCheck },
  ]

  return (
    <div className="bg-[#0F2C59] text-white py-2.5 px-4 overflow-hidden border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        
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
                <div key={idx} className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#F7F4EC]">
                  <IconComp className="w-3.5 h-3.5 text-[#D8A24A] shrink-0" />
                  <span>{item.text}</span>
                  <span className="text-[#D8A24A]/40 mx-2">•</span>
                </div>
              )
            })}
          </motion.div>
        </div>

      </div>
    </div>
  )
}
