import React from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Sparkles, ShieldCheck, Heart } from 'lucide-react'
import { useAppContext } from '../App'

export default function StockUp() {
  const { openCheckout } = useAppContext()

  const benefits = [
    {
      icon: Sparkles,
      title: 'Zero Junk Policy',
      desc: 'Free from sugar alcohols, artificial sweeteners, and mysterious "natural flavors". Only ingredients your grandmother would recognize.',
    },
    {
      icon: ShieldCheck,
      title: 'Sustained Endurance',
      desc: 'Balanced macro profiles pairing clean fats and slow-burning complex carbs for level, crash-free performance throughout your workday.',
    },
    {
      icon: Heart,
      title: 'Gastro-Friendly',
      desc: 'Crafted without gut-bloating synthetic fibers or excessive whey concentrates. We prioritize easy-to-digest plant proteins instead.',
    },
  ]

  return (
    <section id="stock-up" className="bg-[#F5F2EB] py-20 lg:py-28 text-[#2A1646] border-b border-[#E6DFD3]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mixed Box Section matching reference screenshot #3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-24">
          
          {/* Image Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 w-full"
          >
            <div className="relative aspect-[4/3] rounded-[32px] bg-[#FAF8F3] border border-[#E6DFD3] p-4 shadow-lg overflow-hidden group">
              <img
                src="/assets/mix.png"
                alt="The Volt Mixed Box Packaging"
                className="w-full h-full object-cover rounded-[24px] group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = '/assets/hero.png'
                }}
              />
            </div>
          </motion.div>

          {/* Content Right matching reference screenshot #3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2A1646]/10 text-[#2A1646] font-mono text-[10px] font-bold tracking-widest uppercase mb-4 w-max">
              <span>BEST SELLER</span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#2A1646] tracking-tight uppercase">
              THE VOLT MIXED BOX
            </h2>

            <p className="mt-4 text-[#71717A] text-base leading-relaxed font-medium">
              Can't settle on a single flavor? We understand. The Mixed Box features a balanced 12-bar selection containing all three of our signature recipes. Discover your rhythm, find your favorite, or keep them all in constant rotation.
            </p>

            {/* Checkbox Bullets matching reference screenshot #3 */}
            <div className="mt-6 space-y-3 font-display font-bold text-sm text-[#2A1646]">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-[#2A1646] shrink-0" />
                <span>4x Almond Crunch</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-[#2A1646] shrink-0" />
                <span>4x Choco Cranz</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-[#2A1646] shrink-0" />
                <span>4x Berry Rush</span>
              </div>
            </div>

            {/* CTA Button matching reference screenshot #3 */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => openCheckout({ eventSlug: 'mixed-flavours', title: 'Volt Mixed Box', price: 735 })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#2A1646] hover:bg-[#1F0F36] text-white font-display font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md active:scale-95"
              >
                <span>GET THE MIXED BOX — ₹735</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* 3 Feature Benefit Cards matching bottom of reference screenshot #3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, idx) => {
            const IconComp = b.icon
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-[28px] border border-[#E6DFD3]/60 p-8 shadow-xs hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#2A1646]/5 flex items-center justify-center mb-6 text-[#2A1646]">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#2A1646] mb-3">
                    {b.title}
                  </h3>

                  <p className="text-xs text-[#71717A] leading-relaxed font-normal">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
