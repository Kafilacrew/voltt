import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ShoppingBag } from 'lucide-react'

export default function OrdersStartSoonModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full max-w-md rounded-3xl bg-[#FAF8F3] border border-[#E6DFD3] p-6 sm:p-8 shadow-2xl overflow-hidden text-center select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#2A1646]/5 hover:bg-[#2A1646]/10 flex items-center justify-center text-[#2A1646] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand Badge Icon */}
          <div className="w-16 h-16 rounded-full bg-[#F95738]/10 border border-[#F95738]/20 flex items-center justify-center mx-auto mb-5 text-[#F95738] shadow-sm">
            <Sparkles className="w-8 h-8 text-[#F95738]" />
          </div>

          {/* Heading */}
          <h3 className="font-display font-black text-2xl sm:text-3xl text-[#2A1646] tracking-tight uppercase leading-tight">
            ONLINE ORDERS START SOON
          </h3>

          {/* Message */}
          <p className="mt-3 text-sm sm:text-base text-[#71717A] leading-relaxed font-medium">
            We're getting everything ready! Online ordering will be available soon. Stay tuned.
          </p>

          {/* CTA Button */}
          <div className="mt-7">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 px-6 rounded-full bg-[#F95738] hover:bg-[#E04729] text-white font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>CONTINUE SHOPPING</span>
            </button>
          </div>

          {/* Brand Tag */}
          <p className="mt-4 text-[11px] font-mono text-[#71717A]/70 uppercase tracking-wider">
            VOLT PROTEIN CO.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
