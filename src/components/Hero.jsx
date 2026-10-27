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
  SkyLantern,
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
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setHasLoaded(true)
  }, [])

  // Track viewport layout: mount only one carousel in DOM to prevent Framer Motion presence conflicts
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(max-width: 1023px)')
    const updateLayout = () => setIsMobileLayout(mql.matches)
    updateLayout()
    mql.addEventListener('change', updateLayout)
    return () => mql.removeEventListener('change', updateLayout)
  }, [])

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

  // Product Showcase Carousel Card & Thumbnails (shared between mobile & desktop)
  const renderProductShowcase = (isMobile = false) => (
    <div className={`relative w-full ${isMobile ? 'max-w-[320px] sm:max-w-[400px]' : 'max-w-[460px]'} mx-auto min-w-0`}>
      {/* Warm Amber & Gold Festive Backlight Glow */}
      <div
        className="absolute inset-0 sm:-inset-6 rounded-[28px] sm:rounded-[44px] bg-gradient-to-tr from-[#D9A441]/28 via-[#F59E0B]/22 to-[#F95738]/18 blur-xl sm:blur-2xl -z-10 pointer-events-none select-none diwali-carousel-aura"
        aria-hidden="true"
      />

      <div
        className="relative w-full aspect-[3/4] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-xl border border-[#D9A441]/40 select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={`${isMobile ? 'm' : 'd'}-${activeProduct.id}`}
            src={activeProduct.image}
            alt={activeProduct.title}
            custom={direction}
            variants={variants}
            initial={hasLoaded ? 'enter' : false}
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
          className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-white/60 flex items-center justify-center text-[#2A1646] shadow-sm transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next product"
          className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-white/60 flex items-center justify-center text-[#2A1646] shadow-sm transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Festive Dot indicators (3 dots for 3 products) */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
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
            key={`progress-${isMobile ? 'm' : 'd'}-${current}`}
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

      {/* Thumbnail strip below the card - Exactly 3 products */}
      <div className={`flex items-center gap-2 sm:gap-3 mt-3 sm:mt-3.5 w-full ${isMobile ? 'max-w-[320px] sm:max-w-[400px]' : 'max-w-[460px]'} mx-auto px-1 min-w-0`}>
        {HERO_PRODUCTS.map((prod, idx) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => goTo(idx, idx > current ? 1 : -1)}
            className="flex-1 min-w-0 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-200 relative group cursor-pointer"
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
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-1.5 sm:p-2 text-center">
              <span className="text-[9px] sm:text-xs font-bold text-white block truncate drop-shadow-xs font-display">
                {prod.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <section className="relative diwali-hero-bg text-[#2A1646] pt-6 pb-20 sm:pt-12 sm:pb-20 md:pt-16 md:pb-28 overflow-hidden w-full max-w-full border-b border-[#E6DFD3]/40">
      {/* ── 1. Festive Header Hanging Garland (Catenary lights, marigold torans, lanterns & hanging diyas) ── */}
      <div className="absolute top-0 inset-x-0 w-full overflow-hidden pointer-events-none select-none z-20">
        <FestiveHeaderGarland />
      </div>

      {/* ── Festive Background Atmosphere & Decorations Layer (Clipped strictly within container) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Ambient Golden Bokeh & Floating Particle Canvas */}
        <FestiveParticles />

        {/* Golden Radiating Fireworks (Rich on desktop, subtle outer-edge on mobile) */}
        <div className="hidden sm:block absolute top-8 left-2 sm:top-12 sm:left-10 lg:left-16 z-0">
          <GoldenFirework size={260} opacity={0.7} />
        </div>
        <div className="hidden sm:block absolute top-6 right-2 sm:top-10 sm:right-10 lg:right-14 z-0">
          <GoldenFirework size={290} opacity={0.75} />
        </div>
        {/* Mobile Subtle Edge Fireworks: small, faint, tucked into outer margins */}
        <div className="sm:hidden absolute -top-4 -left-6 z-0">
          <GoldenFirework size={90} opacity={0.25} />
        </div>
        <div className="sm:hidden absolute -top-4 -right-6 z-0">
          <GoldenFirework size={100} opacity={0.3} />
        </div>

        {/* Diwali Bottle Rockets (Along outer left & right margins on large screens) */}
        <div className="hidden lg:block absolute left-3 xl:left-7 top-[32%] z-10">
          <DiwaliRocket direction="left" size={125} />
        </div>
        <div className="hidden lg:block absolute right-3 xl:right-7 top-[46%] z-10">
          <DiwaliRocket direction="right" size={125} />
        </div>

        {/* ── Glowing Diwali Sky Lanterns (Akash Kandils) around outer edges ── */}
        {/* Desktop: 2 on Left Outer Margin, 2 on Right Outer Margin */}
        <div className="hidden lg:block absolute left-4 xl:left-8 top-16 z-0">
          <SkyLantern size={48} variant="gold" anim="float-1" opacity={0.88} />
        </div>
        <div className="hidden lg:block absolute left-14 xl:left-20 top-48 z-0">
          <SkyLantern size={36} variant="amber" anim="float-2" opacity={0.78} />
        </div>
        <div className="hidden lg:block absolute right-4 xl:right-8 top-20 z-0">
          <SkyLantern size={50} variant="gold" anim="float-2" opacity={0.9} />
        </div>
        <div className="hidden lg:block absolute right-14 xl:right-22 top-52 z-0">
          <SkyLantern size={38} variant="saffron" anim="float-1" opacity={0.8} />
        </div>

        {/* Tablet: 1 on Left Outer Margin, 1 on Right Outer Margin */}
        <div className="hidden sm:block lg:hidden absolute left-3 top-12 z-0">
          <SkyLantern size={38} variant="gold" anim="float-1" opacity={0.8} />
        </div>
        <div className="hidden sm:block lg:hidden absolute right-3 top-16 z-0">
          <SkyLantern size={40} variant="amber" anim="float-2" opacity={0.82} />
        </div>

        {/* Mobile: Small, subtle glowing sky lanterns tucked at outer edges */}
        <div className="sm:hidden absolute left-1.5 top-6 z-0">
          <SkyLantern size={24} variant="gold" anim="float-1" opacity={0.55} />
        </div>
        <div className="sm:hidden absolute right-1.5 top-8 z-0">
          <SkyLantern size={26} variant="amber" anim="float-2" opacity={0.55} />
        </div>

        {/* Bottom-Left Corner Festive Architecture: Rangoli + Marigold Cluster + Twin Glowing Floor Diyas */}
        <div className="absolute -bottom-24 -left-24 sm:-bottom-36 sm:-left-36 z-0">
          <Rangoli size={180} opacity={0.14} className="sm:hidden" />
          <Rangoli size={420} opacity={0.32} className="hidden sm:block" />
        </div>
        <div className="absolute -bottom-3 -left-3 sm:bottom-0 sm:left-2 z-0 scale-45 sm:scale-100 origin-bottom-left">
          <MarigoldFloorArrangement variant="double-diya" />
        </div>

        {/* Bottom-Right Corner Festive Architecture: Desktop Only (Hidden on mobile) */}
        <div className="hidden sm:block absolute -bottom-36 -right-36 z-0">
          <Rangoli size={420} opacity={0.32} />
        </div>
        <div className="hidden sm:block absolute bottom-0 right-2 z-0 scale-100 origin-bottom-right">
          <MarigoldFloorArrangement variant="border-cluster" />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full min-w-0">
          {/* ── LEFT: Content synchronized with selected product ── */}
          <div className="lg:col-span-6 flex flex-col justify-center w-full min-w-0">
            {/* Flavour Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F3]/90 text-[#2A1646] font-mono text-[10px] font-bold tracking-widest uppercase mb-3 sm:mb-4 w-max border border-[#D9A441]/45 shadow-[0_2px_10px_rgba(217,164,65,0.18)]">
              <Diya size="xs" showGlow={false} />
              <span>{activeProduct.eyebrow}</span>
            </div>

            {/* Responsive Heading: Fits on single line on mobile without awkward wrapping */}
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.08] uppercase text-[#2A1646]">
              {activeProduct.title}
            </h1>

            {/* ── MOBILE PRODUCT SHOWCASE: Placed right after Title on mobile screens ── */}
            {isMobileLayout && (
              <div className="my-5 w-full">
                {renderProductShowcase(true)}
              </div>
            )}

            {/* Flavour Summary Description */}
            <p className="mt-2 sm:mt-5 text-[#71717A] text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-medium">
              {activeProduct.summary}
            </p>

            {/* ── PACK SIZE SELECTOR: 3 Equal-Width Options (Pack of 6, 12, 24) ── */}
            <div className="mt-6 mb-2 max-w-md w-full">
              <div className="flex items-center justify-between text-xs font-semibold mb-2 text-[#2A1646]">
                <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                  Select Pack Size:
                </span>
                <span className="font-mono text-[11px] sm:text-xs font-bold text-[#2A1646]">
                  {heroPackSize} bars × ₹{activeProduct.price} = ₹{activeProduct.price * heroPackSize}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full p-1 rounded-2xl bg-[#FAF8F3] border border-[#D9A441]/40 shadow-xs">
                {[6, 12, 24].map((size) => {
                  const isSelected = heroPackSize === size
                  const priceForSize = activeProduct.price * size
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setHeroPackSize(size)}
                      className={`flex-1 min-w-0 flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#2A1646] text-white shadow-sm ring-1 ring-[#D9A441]/60'
                          : 'text-[#2A1646] hover:bg-white/90 bg-white/50 border border-[#E6DFD3]/60'
                      }`}
                    >
                      <span className="font-display font-bold text-[11px] sm:text-xs whitespace-nowrap">
                        Pack of {size}
                      </span>
                      <span className={`font-mono text-[10px] sm:text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-[#FDE68A]' : 'text-[#71717A]'}`}>
                        ₹{priceForSize}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── PURCHASE BUTTONS: Consistent Height, Full Width on Mobile ── */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 max-w-md w-full">
              <button
                type="button"
                onClick={() => addToCart && addToCart(activeProduct, heroPackSize, 1)}
                className="w-full sm:w-auto flex-1 h-12 inline-flex items-center justify-center bg-[#F95738] hover:bg-[#E04729] text-white font-display font-bold text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 rounded-full transition-all duration-200 shadow-md diwali-cta-gold active:scale-95 cursor-pointer box-border"
              >
                ADD TO CART — ₹{activeProduct.price * heroPackSize}
              </button>
              <a
                href="#stock-up"
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center bg-transparent hover:bg-[#F95738]/10 text-[#F95738] font-display font-bold text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 rounded-full border-2 border-[#F95738] transition-all duration-200 box-border text-center"
              >
                BUILD YOUR BOX
              </a>
            </div>

            {/* ── NUTRITION STATS: Clean 3-Column Layout ── */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-6 sm:mt-10 pt-5 sm:pt-7 border-t border-[#E6DFD3] max-w-md w-full text-center sm:text-left">
              {activeProduct.nutritionSummary.slice(0, 3).map((item) => (
                <div key={item.label} className="p-0.5 sm:p-0">
                  <p className="font-display font-black text-xl sm:text-3xl lg:text-4xl text-[#2A1646] tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-[#71717A] mt-0.5 uppercase tracking-wider">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── DESKTOP PRODUCT SHOWCASE: Slideshow Carousel (Mounted on Desktop) ── */}
          {!isMobileLayout && (
            <div className="lg:col-span-6 w-full">
              {renderProductShowcase(false)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
