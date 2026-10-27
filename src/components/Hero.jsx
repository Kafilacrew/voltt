import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppContext } from '../App'
import { PRODUCTS, getProductBySlug } from '../data/products'
import {
  FestiveHeaderGarland,
  FestiveParticles,
  GoldenFirework,
  DiwaliRocket,
  MarigoldFloorArrangement,
  Diya,
  Rangoli,
} from './diwali/DiwaliTheme'

// Exactly 3 products in the hero section carousel in order: Almond Crunch, Choco Cranz, Berry Rush
const HERO_SLUGS = ['almond-crunch', 'choco-cranz', 'berry-rush']
const HERO_PRODUCTS = HERO_SLUGS.map((slug) => getProductBySlug(slug)).filter(Boolean)

const INTERVAL = 3500 // ms between auto-advances

export default function Hero({ selectedProduct, onSelectFlavor }) {
  const { openCheckout, addToCart } = useAppContext()

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

  const [heroPackSize, setHeroPackSize] = useState(6)

  return (
    <section className="relative diwali-hero-bg text-[#2A1646] pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-[#E6DFD3]/40">
      {/* ── 1. Festive Header Hanging Garland (Catenary lights, marigold torans, lanterns & hanging diyas) ── */}
      <FestiveHeaderGarland />

      {/* ── 2. Ambient Golden Bokeh & Floating Particle Canvas ── */}
      <FestiveParticles />

      {/* ── 3. Golden Radiating Fireworks (Left behind copy & Right behind showcase) ── */}
      <div className="absolute top-8 left-2 sm:top-12 sm:left-10 lg:left-16 z-0 pointer-events-none select-none">
        <GoldenFirework size={260} opacity={0.7} />
      </div>
      <div className="absolute top-6 right-2 sm:top-10 sm:right-10 lg:right-14 z-0 pointer-events-none select-none">
        <GoldenFirework size={290} opacity={0.75} />
      </div>

      {/* ── 4. Diwali Bottle Rockets (Along outer left & right margins) ── */}
      <div className="hidden lg:block absolute left-3 xl:left-7 top-[32%] z-10 pointer-events-none select-none">
        <DiwaliRocket direction="left" size={125} />
      </div>
      <div className="hidden lg:block absolute right-3 xl:right-7 top-[46%] z-10 pointer-events-none select-none">
        <DiwaliRocket direction="right" size={125} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ── LEFT: Copy synchronized with selected product ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F3]/90 text-[#2A1646] font-mono text-[10px] font-bold tracking-widest uppercase mb-4 w-max border border-[#D9A441]/45 shadow-[0_2px_10px_rgba(217,164,65,0.18)]">
              <Diya size="xs" showGlow={false} />
              <span>{activeProduct.eyebrow}</span>
            </div>

            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.02] uppercase text-[#2A1646]">
              {activeProduct.title}
            </h1>

            <p className="mt-6 text-[#71717A] text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              {activeProduct.summary}
            </p>

            {/* Pack Size Selector for Active Hero Flavour */}
            <div className="mt-8 mb-2">
              <div className="flex items-center justify-between text-xs font-semibold mb-2 text-[#2A1646] max-w-md">
                <span className="font-mono text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                  Select Pack Size:
                </span>
                <span className="font-mono text-xs font-bold text-[#2A1646]">
                  {heroPackSize} bars × ₹{activeProduct.price} = ₹{activeProduct.price * heroPackSize}
                </span>
              </div>
              <div className="inline-flex p-1 rounded-2xl bg-[#FAF8F3] border border-[#D9A441]/40 shadow-xs gap-1.5">
                {[6, 12, 24].map((size) => {
                  const isSelected = heroPackSize === size
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setHeroPackSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2A1646] text-white shadow-sm'
                          : 'text-[#2A1646] hover:bg-white/80'
                      }`}
                    >
                      <span>Pack of {size}</span>
                      <span className={`block font-mono text-[10px] ${isSelected ? 'text-[#FDE68A]' : 'text-gray-500'}`}>
                        ₹{activeProduct.price * size}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => addToCart && addToCart(activeProduct, heroPackSize, 1)}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#F95738] hover:bg-[#E04729] text-white font-display font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200 shadow-md diwali-cta-gold active:scale-95 cursor-pointer"
              >
                ADD TO CART — ₹{activeProduct.price * heroPackSize}
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
            <div className="relative w-full max-w-[460px] mx-auto">
              {/* Warm Amber & Gold Festive Backlight Glow */}
              <div
                className="absolute -inset-4 sm:-inset-6 rounded-[44px] bg-gradient-to-tr from-[#D9A441]/28 via-[#F59E0B]/22 to-[#F95738]/18 blur-2xl -z-10 pointer-events-none select-none diwali-carousel-aura"
                aria-hidden="true"
              />

              <div
                className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden shadow-xl border border-[#D9A441]/40 select-none bg-[#FAF8F3]"
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
                    className="absolute inset-0 w-full h-full object-cover object-center"
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-white/60 flex items-center justify-center text-[#2A1646] shadow-sm transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next product"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-white/60 flex items-center justify-center text-[#2A1646] shadow-sm transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Festive Dot indicators (3 dots for 3 products) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
                  {HERO_PRODUCTS.map((prod, idx) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => goTo(idx, idx > current ? 1 : -1)}
                      aria-label={`Go to ${prod.title}`}
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        width: idx === current ? 22 : 6,
                        height: 6,
                        borderRadius: 9999,
                        background:
                          idx === current
                            ? 'linear-gradient(90deg, #F95738 0%, #F59E0B 50%, #FBBF24 100%)'
                            : 'rgba(217, 164, 65, 0.35)',
                        boxShadow: idx === current ? '0 0 10px rgba(245, 158, 11, 0.7)' : 'none',
                        border: idx === current ? 'none' : '1px solid rgba(217, 164, 65, 0.4)',
                      }}
                    />
                  ))}
                </div>

                {/* Thin progress bar at top with warm festive gold gradient */}
                {!paused && (
                  <motion.div
                    key={`progress-${current}`}
                    className="absolute top-0 left-0 h-0.5 z-10 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #F95738 0%, #F59E0B 60%, #FBBF24 100%)',
                      boxShadow: '0 0 8px rgba(251, 191, 36, 0.8)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                  />
                )}
              </div>
            </div>

            {/* Thumbnail strip below the card - Exactly 3 products */}
            <div className="flex items-center gap-2.5 sm:gap-3 mt-3.5 max-w-[460px] mx-auto px-1">
              {HERO_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => goTo(idx, idx > current ? 1 : -1)}
                  className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-200 relative group cursor-pointer"
                  style={{
                    borderColor: idx === current ? '#F95738' : '#E6DFD3',
                    opacity: idx === current ? 1 : 0.65,
                    transform: idx === current ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/assets/hero.png'
                    }}
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-2 text-center">
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

      {/* ── Bottom-Left Corner Festive Architecture (Reference Image): Large Rangoli Mandala + Marigold Cluster + Twin Glowing Floor Diyas ── */}
      <div className="absolute -bottom-28 -left-28 sm:-bottom-36 sm:-left-36 z-0 pointer-events-none select-none">
        <Rangoli size={420} opacity={0.32} />
      </div>
      <div className="absolute -bottom-1 left-0 sm:bottom-0 sm:left-2 z-10 pointer-events-none select-none scale-85 sm:scale-100 origin-bottom-left">
        <MarigoldFloorArrangement variant="double-diya" />
      </div>

      {/* ── Bottom-Right Corner Festive Architecture (Reference Image): Large Rangoli Mandala + Marigold Border Cluster + Diya ── */}
      <div className="absolute -bottom-28 -right-28 sm:-bottom-36 sm:-right-36 z-0 pointer-events-none select-none">
        <Rangoli size={420} opacity={0.32} />
      </div>
      <div className="absolute -bottom-1 right-0 sm:bottom-0 sm:right-2 z-10 pointer-events-none select-none scale-85 sm:scale-100 origin-bottom-right">
        <MarigoldFloorArrangement variant="border-cluster" />
      </div>
    </section>
  )
}
