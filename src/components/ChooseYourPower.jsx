import React from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../App'
import { PRODUCTS, getProductBySlug } from '../data/products'

export default function ChooseYourPower() {
  const { openCheckout } = useAppContext()

  const products = [
    {
      id: 1,
      title: 'Almond Crunch',
      badge: 'RICH & TEXTURED',
      price: '₹68',
      desc: 'A roasted almond profile with a clean crunch that feels familiar, simple, and satisfying.',
      image: '/assets/almond-crunch.png',
      fallbackImage: '/assets/hero.png',
      eventSlug: 'almond-crunch',
    },
    {
      id: 2,
      title: 'Choco Cranz',
      badge: 'DECADENT & SMOOTH',
      price: '₹68',
      desc: 'A bright cranberry twist layered into a rich protein bar for a sharper, fruit-forward bite.',
      image: '/assets/choco-cranz.png',
      fallbackImage: '/assets/hero.png',
      eventSlug: 'choco-cranz',
    },
    {
      id: 3,
      title: 'Berry Rush',
      badge: 'FRESH & TROPICAL',
      price: '₹68',
      desc: 'A smooth berry-led bar with a lighter profile for people who want something fruity after activity.',
      image: '/assets/berry-rush.png',
      fallbackImage: '/assets/hero.png',
      eventSlug: 'berry-rush',
    },
  ]

  return (
    <section id="shop" className="bg-[#F5F2EB] py-20 lg:py-28 text-[#2A1646] border-b border-[#E6DFD3]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#2A1646] tracking-tight uppercase">
            THE TASTE OF INTENTION
          </h2>
          <p className="mt-4 text-[#71717A] text-base leading-relaxed font-medium">
            Every bar is crafted with distinct layers of flavor and real structural texture. No single mushy blend here.
          </p>
        </div>

        {/* 3 Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#FAF8F3] rounded-[28px] border border-[#E6DFD3] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div>
                {/* Card Image Frame */}
                <div className="relative aspect-[4/3] bg-white overflow-hidden border-b border-[#E6DFD3]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <span className="font-display font-bold text-lg text-[#2A1646]">
                      {product.price}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#2A1646] mb-2">
                    {product.title}
                  </h3>
                  
                  <p className="text-xs text-[#71717A] leading-relaxed font-normal">
                    {product.desc}
                  </p>
                </div>
              </div>

              {/* Card Action Button */}
              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const fullProduct = getProductBySlug(product.eventSlug) || PRODUCTS[0]
                    openCheckout(fullProduct)
                  }}
                  className="w-full py-4 px-4 rounded-full border-2 border-[#F95738] text-[#F95738] hover:bg-[#F95738] hover:text-white font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center active:scale-95 cursor-pointer"
                >
                  ADD TO CART
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
