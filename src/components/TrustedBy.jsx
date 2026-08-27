import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Marcus Vance',
    role: 'Freelance Creative',
    text: 'Unlike every other bar on the shelf, Volt actually keeps me full without turning my stomach inside out. The Almond Crunch is a staple of my morning commute.',
  },
  {
    name: 'Elena Rostov',
    role: 'Marathon Runner',
    text: 'The texture is unmatched. You can actually see the chunks of almond and berries rather than a processed paste. A truly premium snack worth every penny.',
  },
  {
    name: 'Dr. Aris Thorne',
    role: 'Nutritional Biologist',
    text: 'The Choco Cranz tastes like a real dessert but has the macros to support my afternoon lifting sessions. Unbelievably clean profile.',
  },
]

export default function TrustedBy() {
  return (
    <section id="trusted" className="bg-[#F5F2EB] py-20 lg:py-28 text-[#2A1646] border-b border-[#E6DFD3]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching reference screenshot #5 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#2A1646] tracking-tight uppercase">
            TRUSTED FOR THE LONG HAUL
          </h2>
        </div>

        {/* 3 Review Cards matching reference screenshot #5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-[28px] border border-[#E6DFD3]/60 p-8 shadow-xs hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Row matching reference screenshot #5 */}
                <div className="flex text-[#2A1646] gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#2A1646]" />
                  ))}
                </div>

                <p className="text-[#2A1646] text-sm leading-relaxed font-normal italic mb-6">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-2">
                <h4 className="font-display font-bold text-[#2A1646] text-base">{t.name}</h4>
                <p className="text-xs text-[#71717A] font-medium mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
