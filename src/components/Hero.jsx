import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppContext } from '../App'
import { PRODUCTS, getProductBySlug } from '../data/products'

// Exactly 3 products in the hero section carousel in order: Almond Crunch, Choco Cranz, Berry Rush
const HERO_SLUGS = ['almond-crunch', 'choco-cranz', 'berry-rush']
const HERO_PRODUCTS = HERO_SLUGS.map((slug) => getProductBySlug(slug)).filter(Boolean)

const INTERVAL = 3500 // ms between auto-advances

export default function Hero({ selectedProduct, onSelectFlavor }) {
  const { openCheckout } = useAppContext()

  const initialIndex = selectedProduct
    ? Math.max(0, HERO_PRODUCTS.findIndex((p) => p.eventSlug === selectedProduct.eventSlug))
    : 0

  const [current, setCurrent] = useState(initialIndex < 0 ? 0 : initialIndex)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  useEffect(() => {
    if (selectedProduct) {
      const idx = HERO_PRODUCTS.findIndex((p) => p.eventSlug === selectedProduct.eventSlug)
      if (idx !== -1 && idx !== current) {
        setCurrent(idx)
      }
    }
  }, [selectedProduct])

  const goTo = useCallback(
    (idx, dir = 1) => {
      setDirection(dir)
      setCurrent(idx)
      const targetProduct = HERO_PRODUCTS[idx]
      if (targetProduct && onSelectFlavor) {
        onSelectFlavor(targetProduct.eventSlug)
      }
    },
    [onSelectFlavor]
  )

  const next = useCallback(() => {
    const nextIdx = (current + 1) % HERO_PRODUCTS.length
    goTo(nextIdx, 1)
  }, [current, goTo])

  const prev = useCallback(() => {
    const prevIdx = (current - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length
    goTo(prevIdx, -1)
  }, [current, goTo])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, INTERVAL)
    return () => clearInterval(id)
  }, [paused, next])

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  const activeProduct = HERO_PRODUCTS[current] || HERO_PRODUCTS[0]

  return (
    <section className="relative bg-[#F5F2EB] text-[#2A1646] pt-10 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-[#E6DFD3]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ── LEFT: Copy synchronized with selected product ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2A1646]/10 text-[#2A1646] font-mono text-[10px] font-bold tracking-widest uppercase mb-4 w-max">
              <span>{activeProduct.eyebrow}</span>
            </div>

            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.02] uppercase text-[#2A1646]">
              {activeProduct.title}
            </h1>

            <p className="mt-6 text-[#71717A] text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              {activeProduct.summary}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => openCheckout(activeProduct)}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#F95738] hover:bg-[#E04729] text-white font-display font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
              >
                ADD TO CART — ₹{activeProduct.price}
              </button>
              <a
                href="#stock-up"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent hover:bg-[#F95738]/10 text-[#F95738] font-display font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-full border-2 border-[#F95738] transition-all duration-200"
              >
                BUILD YOUR BOX
              </a>
            </div>

            {/* Dynamic Nutrition Stats for active product */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#E6DFD3]">
              {activeProduct.nutritionSummary.slice(0, 3).map((item) => (
                <div key={item.label}>
                  <p className="font-display font-black text-3xl sm:text-4xl text-[#2A1646]">
                    {item.value}
                  </p>
                  <p className="text-xs font-semibold text-[#71717A] mt-1 uppercase tracking-wider">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Slideshow Carousel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 w-full"
          >
            <div
              className="relative aspect-square sm:aspect-[4/3.8] lg:aspect-square rounded-[36px] bg-[#FAF8F3] overflow-hidden shadow-lg border border-[#E6DFD3] select-none"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Slides */}
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={activeProduct.id}
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/hero.png'
                  }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Prev / Next arrow buttons */}
              <button
                type="button"
                onClick={prev}
                aria-label="Previous product"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border border-[#E6DFD3] flex items-center justify-center text-[#2A1646] shadow-sm transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next product"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border border-[#E6DFD3] flex items-center justify-center text-[#2A1646] shadow-sm transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dot indicators (3 dots for 3 products) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
                {HERO_PRODUCTS.map((prod, idx) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => goTo(idx, idx > current ? 1 : -1)}
                    aria-label={`Go to ${prod.title}`}
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      width: idx === current ? 20 : 6,
                      height: 6,
                      borderRadius: 9999,
                      background: idx === current ? '#F95738' : 'rgba(255,255,255,0.7)',
                      border: idx === current ? 'none' : '1px solid rgba(42,22,70,0.15)',
                    }}
                  />
                ))}
              </div>

              {/* Thin progress bar at top */}
              {!paused && (
                <motion.div
                  key={`progress-${current}`}
                  className="absolute top-0 left-0 h-0.5 z-10 rounded-full"
                  style={{ background: '#F95738' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                />
              )}
            </div>

            {/* Thumbnail strip below the card - Exactly 3 products */}
            <div className="flex items-center gap-2.5 mt-3 px-1">
              {HERO_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => goTo(idx, idx > current ? 1 : -1)}
                  className="flex-1 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 relative group cursor-pointer"
                  style={{
                    borderColor: idx === current ? '#F95738' : '#E6DFD3',
                    opacity: idx === current ? 1 : 0.65,
                    transform: idx === current ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/assets/hero.png'
                    }}
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-1.5 text-center">
                    <span className="text-[10px] sm:text-xs font-bold text-white block truncate drop-shadow-xs font-display">
                      {prod.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
