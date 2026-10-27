import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Check } from 'lucide-react'
import { useAppContext } from '../App'
import { PRODUCTS, getProductBySlug } from '../data/products'
import { Diya, MarigoldAccent, Rangoli, GoldenFirework, DiwaliRocket } from './diwali/DiwaliTheme'

export default function ChooseYourPower() {
  const { openCheckout, addToCart } = useAppContext()

  const [selectedPacks, setSelectedPacks] = useState({
    1: 6, // Almond Crunch
    3: 6, // Choco Cranz
    2: 6, // Berry Rush
  })

  const products = [
    {
      id: 1,
      title: 'Almond Crunch',
      badge: 'RICH & TEXTURED',
      perBarPrice: 68,
      desc: 'A roasted almond profile with a clean crunch that feels familiar, simple, and satisfying.',
      image: '/assets/almond-crunch.png',
      fallbackImage: '/assets/hero.png',
      eventSlug: 'almond-crunch',
    },
    {
      id: 3,
      title: 'Choco Cranz',
      badge: 'DECADENT & SMOOTH',
      perBarPrice: 68,
      desc: 'A bright cranberry twist layered into a rich protein bar for a sharper, fruit-forward bite.',
      image: '/assets/choco-cranz.png',
      fallbackImage: '/assets/hero.png',
      eventSlug: 'choco-cranz',
    },
    {
      id: 2,
      title: 'Berry Rush',
      badge: 'FRESH & TROPICAL',
      perBarPrice: 68,
      desc: 'A smooth berry-led bar with a lighter profile for people who want something fruity after activity.',
      image: '/assets/berry-rush.png',
      fallbackImage: '/assets/hero.png',
      eventSlug: 'berry-rush',
    },
  ]

  const handlePackChange = (productId, packSize) => {
    setSelectedPacks((prev) => ({
      ...prev,
      [productId]: packSize,
    }))
  }

  return (
    <section id="shop" className="relative diwali-section-bg py-20 lg:py-28 text-[#2A1646] border-b border-[#E6DFD3]/50 overflow-hidden">
      {/* Corner Heritage Rangoli Motif */}
      <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 z-0 pointer-events-none select-none">
        <Rangoli size={300} opacity={0.20} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Matching Reference Image */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#B45309] inline-flex items-center justify-center gap-1.5 mb-2">
            OUR FLAVOURS
          </span>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <GoldenFirework size={36} opacity={0.85} className="shrink-0 -mb-1" />
            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#2A1646] tracking-tight uppercase">
              Shop by flavour
            </h2>
            <DiwaliRocket direction="mini" size={28} className="shrink-0 -mt-1" />
          </div>

          <p className="mt-4 text-[#71717A] text-base leading-relaxed font-medium">
            Every bar is crafted with distinct layers of flavour and texture, delivering a satisfying bite in every mouthful. Choose your pack size below.
          </p>
        </div>

        {/* 3 Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, idx) => {
            const currentPackSize = selectedPacks[product.id] || 6
            const packTotalPrice = product.perBarPrice * currentPackSize
            const hasFreeShipping = packTotalPrice >= 499

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#FAF8F3] rounded-[28px] border border-[#E6DFD3] diwali-card-glow overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div>
                  {/* Card Image Frame */}
                  <div className="relative aspect-[3/3.8] bg-[#FAF8F3] overflow-hidden border-b border-[#E6DFD3]">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = product.fallbackImage
                      }}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[10px] font-bold text-[#2A1646] bg-[#2A1646]/5 px-3 py-1 rounded-full tracking-wider uppercase">
                        {product.badge}
                      </span>
                      <div className="text-right">
                        <span className="font-display font-black text-xl text-[#2A1646]">
                          ₹{packTotalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[10px] text-gray-500 font-mono">
                          Pack of {currentPackSize}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-[#2A1646] mb-2">
                      {product.title}
                    </h3>
                    
                    <p className="text-xs text-[#71717A] leading-relaxed font-normal mb-5">
                      {product.desc}
                    </p>

                    {/* Pack Size Selector for 6, 12, 24 Bars */}
                    <div className="pt-4 border-t border-[#E6DFD3]/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#2A1646]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                          Select Pack:
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#2A1646]">
                          {currentPackSize} bars × ₹{product.perBarPrice} = ₹{packTotalPrice}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[6, 12, 24].map((size) => {
                          const isSelected = currentPackSize === size
                          const priceForSize = product.perBarPrice * size

                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handlePackChange(product.id, size)}
                              className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#2A1646] text-white border-[#2A1646] shadow-sm'
                                  : 'bg-white text-[#2A1646] border-[#E6DFD3] hover:border-[#D9A441] hover:bg-[#FAF8F3]'
                              }`}
                            >
                              <div className="font-display font-bold text-xs">
                                Pack of {size}
                              </div>
                              <div className={`font-mono text-[11px] ${isSelected ? 'text-[#FDE68A] font-bold' : 'text-gray-500'}`}>
                                ₹{priceForSize}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium px-1">
                        <span>₹{product.perBarPrice}/bar</span>
                        {hasFreeShipping ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" /> Free Shipping
                          </span>
                        ) : (
                          <span className="text-gray-400">Standard Shipping</span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Card Action Button */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const fullProduct = getProductBySlug(product.eventSlug) || PRODUCTS.find((p) => p.id === product.id) || product
                      addToCart && addToCart(fullProduct, currentPackSize, 1)
                    }}
                    className="w-full py-4 px-4 rounded-full border-2 border-[#F95738] text-[#F95738] hover:bg-[#F95738] hover:text-white font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center active:scale-95 cursor-pointer shadow-xs hover:shadow-md"
                  >
                    ADD TO CART — ₹{packTotalPrice}
                  </button>
                </div>

              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
