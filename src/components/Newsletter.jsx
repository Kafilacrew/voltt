import React from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../App'

export default function Newsletter() {
  const { openCheckout } = useAppContext()

  return (
    /*
     * Outer wrapper: cream background with horizontal padding so the
     * purple card has visible cream gaps on the left and right.
     * No bottom padding — the card bottom flows into the dark footer.
     */
    <section className="bg-[#F5F2EB] pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Fully-rounded deep-purple card matching reference screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-t-[36px] rounded-b-none bg-[#3B1B6E] text-white px-8 sm:px-16 py-16 sm:py-20 text-center"
        >
          {/* Headline */}
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-[3.75rem] text-white tracking-tight uppercase leading-[1.05]">
            READY TO RECHARGE?
          </h2>

          {/* Sub-copy */}
          <p className="mt-5 text-white/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Join thousands of active professionals, athletes, and creative thinkers who have ditched the synthetic junk for real plant-powered performance.
          </p>

          {/* CTA buttons — white filled + white outline */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">

            <a
              href="#shop"
              className="inline-flex items-center justify-center bg-white hover:bg-[#F5F2EB] text-[#3B1B6E] font-display font-bold text-xs tracking-widest uppercase px-9 py-4 rounded-full transition-all duration-200 shadow-md active:scale-95 whitespace-nowrap"
            >
              SHOP THE STARTER KIT
            </a>

            <button
              type="button"
              onClick={() => openCheckout()}
              className="inline-flex items-center justify-center bg-transparent hover:bg-white/10 text-white font-display font-bold text-xs tracking-widest uppercase px-9 py-4 rounded-full border border-white/50 hover:border-white transition-all duration-200 active:scale-95 whitespace-nowrap"
            >
              SUBSCRIBE &amp; SAVE 10%
            </button>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
