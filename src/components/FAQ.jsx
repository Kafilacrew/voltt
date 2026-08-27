import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function FAQ() {
  const faqs = [
    {
      q: 'What makes Voltt protein bars different from typical snack bars?',
      a: 'Voltt bars combine 10g of clean whey protein with essential electrolytes (Sodium & Magnesium) for instant rehydration, 0 artificial sweeteners, and authentic taste.',
    },
    {
      q: 'What ingredients are used in Voltt bars?',
      a: 'We use high-grade clean whey protein, roasted almonds, cocoa, fruit extracts, and mineral salts carefully formulated without synthetic fillers or sugar alcohols.',
    },
    {
      q: 'Who are Voltt protein bars designed for?',
      a: 'Voltt is built for anyone with an active lifestyle: athletes, gym-goers, marathon runners, corporate professionals, and travelers needing quick clean fuel.',
    },
    {
      q: 'How much protein does each bar contain?',
      a: 'Each 40g Voltt bar delivers 10g of clean whey protein along with 5g of dietary fibre and essential electrolytes.',
    },
    {
      q: 'Are Voltt protein bars vegetarian?',
      a: 'Yes! All Voltt bars are 100% vegetarian-friendly.',
    },
    {
      q: 'Where do you ship across India?',
      a: 'We ship nationwide across all pin codes in India. Orders are dispatched within 24 hours.',
    },
  ]

  const initialVisible = 4
  const [showAll, setShowAll] = useState(false)
  const [openIndex, setOpenIndex] = useState(0)

  const visibleFaqs = useMemo(
    () => (showAll ? faqs : faqs.slice(0, initialVisible)),
    [showAll, faqs]
  )

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="bg-[#F6F3EC] py-20 lg:py-28 text-[#1F2937] border-b border-[#E5DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Sticky Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <span className="font-mono text-[11px] font-bold text-[#123D87] uppercase tracking-wider block mb-2">
              KNOWLEDGE BASE
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#123D87] tracking-tight uppercase leading-[1.1]">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="mt-4 text-[#6B7280] text-sm leading-relaxed">
              Clear, transparent answers about macros, formulation, shipping timelines, and how to fuel your daily routine.
            </p>
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-8 space-y-4">
            {visibleFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-[#E5DFC9] p-6 shadow-xs transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="w-full flex items-center justify-between text-left font-display font-bold text-base sm:text-lg text-[#123D87] hover:text-[#D9A441] transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <span className="p-1.5 rounded-full bg-[#F6F3EC] border border-[#E5DFC9] shrink-0 text-[#123D87]">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="mt-4 pt-4 border-t border-[#E5DFC9]/50 text-[#6B7280] text-xs sm:text-sm leading-relaxed font-normal">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {faqs.length > initialVisible && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  className="font-mono text-xs font-bold text-[#123D87] hover:underline uppercase tracking-wider"
                  onClick={() => setShowAll((value) => !value)}
                >
                  {showAll ? 'Show fewer questions ↑' : 'View all questions ↓'}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  )
}
