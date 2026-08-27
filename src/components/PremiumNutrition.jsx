import React from 'react'
import { Tag, Leaf, Zap, Droplets, Sun, Activity, Check } from 'lucide-react'

const specs = [
  {
    title: 'Affordable Premium',
    detail: 'Same international grade, 40% lower price point than competitors.',
    icon: Tag,
    code: 'SPEC-01',
  },
  {
    title: 'Clean Formulation',
    detail: 'Zero artificial sweeteners, no hidden preservatives or chemical fillers.',
    icon: Leaf,
    code: 'SPEC-02',
  },
  {
    title: '10g Clean Protein',
    detail: 'High bioavailability whey protein concentrate in every 40g bar.',
    icon: Zap,
    code: 'SPEC-03',
  },
  {
    title: 'Added Electrolytes',
    detail: 'Formulated with Sodium & Magnesium for rapid cellular rehydration.',
    icon: Droplets,
    code: 'SPEC-04',
  },
  {
    title: 'Sustained Fuel',
    detail: 'Complex carbs and natural fiber providing energy without the crash.',
    icon: Sun,
    code: 'SPEC-05',
  },
  {
    title: 'Active Recovery',
    detail: 'Macro ratios engineered for pre-workout stamina and post-workout recovery.',
    icon: Activity,
    code: 'SPEC-06',
  },
]

export default function PremiumNutrition() {
  return (
    <section id="nutrition" className="bg-[#153B75] py-20 lg:py-28 text-white border-b border-[#0F2C59]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-[11px] font-bold text-[#D8A24A] tracking-widest uppercase">
            // FORMULA & NUTRITION SPECS
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase mt-2">
            COMPLETE NUTRITION. <br />
            <span className="text-[#D8A24A]">INSTANT REHYDRATION.</span>
          </h2>
          <p className="mt-4 text-[#F7F4EC]/90 text-base sm:text-lg">
            Voltt bars fuse clean whey protein with essential electrolyte minerals for rapid absorption, digestive ease, and authentic taste.
          </p>
        </div>

        {/* Technical Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {specs.map((item) => {
            const IconComp = item.icon
            return (
              <div
                key={item.title}
                className="bg-[#0F2C59] border border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-[#D8A24A]/50 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#D8A24A]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-[#D8A24A] font-bold tracking-wider">
                      {item.code}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#F7F4EC]/80 leading-relaxed font-normal">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-[#00E5A3] font-bold">
                  <Check className="w-3.5 h-3.5 text-[#5D8C4A]" />
                  <span>VERIFIED SPEC</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Studio Comparison Matrix */}
        <div className="bg-white text-[#1F2937] border border-[#E8E3D5] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <span className="font-mono text-[10px] text-[#153B75] font-bold tracking-wider uppercase">
              SPECIFICATION COMPARISON
            </span>
            <h3 className="font-display font-bold text-xl text-[#153B75] mt-1">
              Voltt vs. Traditional Commercial Snack Bars
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E3D5] text-[#6B7280] font-mono text-[11px]">
                  <th className="py-3 px-4 uppercase">Feature</th>
                  <th className="py-3 px-4 uppercase text-[#153B75] font-bold">Voltt Bars</th>
                  <th className="py-3 px-4 uppercase">Generic Candy/Snack Bars</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3D5] text-[#1F2937]">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-[#153B75]">Protein Content</td>
                  <td className="py-3.5 px-4 text-[#5D8C4A] font-bold">10g Clean Whey</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">1-3g Low Quality</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-[#153B75]">Electrolytes (Na + Mg)</td>
                  <td className="py-3.5 px-4 text-[#5D8C4A] font-bold">Yes (Instant Rehydration)</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">None</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-[#153B75]">Artificial Sweeteners</td>
                  <td className="py-3.5 px-4 text-[#5D8C4A] font-bold">Zero</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">High Additives</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-[#153B75]">Price per Bar</td>
                  <td className="py-3.5 px-4 text-[#D8A24A] font-bold">₹68 (Affordable)</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">₹120+ (Import Markup)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  )
}
