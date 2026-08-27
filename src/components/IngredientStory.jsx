import React from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function IngredientStory() {
  const ingredients = [
    'Organic Almond Butter',
    'Sprouted Pea Protein',
    'Flaky Celtic Sea Salt',
    'Organic Quinoa Crisps',
    'Virgin Coconut Oil',
    'Raw Cacao Butter',
  ]

  return (
    <section id="nutrition" className="bg-[#F5F2EB] py-20 lg:py-28 text-[#2A1646] border-b border-[#E6DFD3]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Layout matching reference screenshot #4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headline, Description & Ingredient Pills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#2A1646] tracking-tight uppercase leading-[1.08]">
              HONEST EARTH-GROWN <br />
              INGREDIENTS
            </h2>

            <p className="mt-5 text-[#71717A] text-base leading-relaxed font-medium">
              We believe you should understand everything that goes into your body. We carefully curate our macronutrients directly from whole plants, seeds, and slow-burning cold-pressed oils.
            </p>

            {/* Ingredient Pills Grid matching reference screenshot #4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {ingredients.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-white border border-[#E6DFD3] text-xs font-bold text-[#2A1646] shadow-xs"
                >
                  <Leaf className="w-4 h-4 text-[#5D8C4A] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Large Ingredients Flatlay Image matching reference screenshot #4 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 w-full"
          >
            <div className="relative aspect-[4/3] rounded-[32px] bg-[#FAF8F3] border border-[#E6DFD3] p-4 shadow-lg overflow-hidden group">
              <img
                src="/assets/almond-crunch.png"
                alt="Volt Honest Earth-Grown Ingredients"
                className="w-full h-full object-cover rounded-[24px] group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = '/assets/hero.png'
                }}
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
