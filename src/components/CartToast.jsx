import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ShoppingBag, X } from 'lucide-react'
import { useAppContext } from '../App'

export default function CartToast({ toast, onDismiss }) {
  const { openCart } = useAppContext()

  if (!toast || !toast.show) return null

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[70] max-w-sm w-[90vw]">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="bg-[#2A1646] text-white rounded-2xl p-4 shadow-2xl border border-[#D9A441]/40 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#5D8C4A]/20 flex items-center justify-center shrink-0 text-[#5D8C4A]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-xs uppercase tracking-wide text-white truncate">
                Added to your box!
              </p>
              <p className="text-[11px] text-white/70 truncate">
                {toast.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onDismiss()
                openCart()
              }}
              className="px-3 py-1.5 rounded-lg bg-[#F95738] hover:bg-[#E04729] text-white font-display font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              View Cart
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="text-white/60 hover:text-white p-1 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
