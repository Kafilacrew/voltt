import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Info, Sparkles, Zap } from 'lucide-react'
import { useAppContext } from '../App'
import { PRODUCTS } from '../data/products'
import EmbeddedBookingWidget from './EmbeddedBookingWidget'

export default function ProductBookingPage({ product }) {
  const { openNutrition, openCheckout } = useAppContext()
  const relatedProducts = PRODUCTS.filter((item) => item.eventSlug !== product.eventSlug)

  return (
    <section className="min-h-screen bg-[#F7F4EC] text-[#1F2937] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <a
          href="#shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#153B75] hover:text-[#0F2C59] transition-colors py-2 px-4 rounded-full bg-white border border-[#E8E3D5] shadow-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4 text-[#D8A24A]" />
          <span>Back to all flavours</span>
        </a>

        {/* Product Details & Booking Widget Grid */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)] items-start">
          
          {/* Left Column: Product Showcase */}
          <div className="rounded-2xl border border-[#E8E3D5] bg-white p-6 sm:p-8 shadow-md overflow-hidden">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              
              {/* Image Frame */}
              <div className="relative aspect-square rounded-xl bg-[#F7F4EC] overflow-hidden border border-[#E8E3D5] group">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(event) => {
                    event.target.style.display = 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={() => openNutrition(product.nutritionKey)}
                  className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-[#153B75] px-3.5 py-1.5 text-xs font-bold text-white shadow transition-colors hover:bg-[#0F2C59]"
                >
                  <Info className="w-3.5 h-3.5 text-[#D8A24A]" />
                  <span>View Specs</span>
                </button>
              </div>

              {/* Product Copy */}
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#153B75] bg-[#153B75]/10 px-3 py-1 rounded border border-[#153B75]/20">
                  <Zap className="w-3 h-3 text-[#D8A24A]" />
                  {product.eyebrow}
                </span>

                <h1 className="mt-4 font-display text-4xl sm:text-5xl font-black text-[#153B75] tracking-tight">
                  {product.title}
                </h1>

                <div className="mt-4 inline-flex items-baseline gap-2 px-4 py-2 rounded-xl bg-[#F7F4EC] border border-[#E8E3D5]">
                  <span className="text-xs font-bold uppercase text-[#6B7280]">Price</span>
                  <span className="font-display text-3xl font-black text-[#153B75]">₹{product.price}</span>
                  <span className="text-xs text-[#6B7280]">/ bar</span>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[#6B7280]">
                  {product.summary}
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => openCheckout(product)}
                    className="w-full py-4 rounded-xl bg-[#153B75] hover:bg-[#0F2C59] text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Zap className="w-4 h-4 text-[#D8A24A]" />
                    <span>Buy Now – Express Checkout</span>
                  </button>
                  <p className="mt-2 text-center text-[11px] text-[#6B7280]">
                    ⚡ Express Shipping Available Across India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#E8E3D5]">
              <h3 className="font-display font-bold text-lg text-[#153B75]">Product Highlights</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 rounded-xl border border-[#E8E3D5] bg-[#F7F4EC] px-4 py-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#5D8C4A] shrink-0" />
                    <span className="text-xs font-semibold text-[#1F2937]">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Nutrition Cards & Embedded Order Widget */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            {/* Quick Nutrition Summary */}
            <div className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E3D5]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#153B75]">
                    Nutritional Specs
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#153B75] mt-0.5">
                    Per 40g Serving
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => openNutrition(product.nutritionKey)}
                  className="rounded-lg bg-[#153B75] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0F2C59] transition-colors"
                >
                  Full Specs
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {product.nutritionSummary.map((item) => (
                  <div key={item.label} className="rounded-xl bg-[#F7F4EC] border border-[#E8E3D5] px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                      {item.label}
                    </p>
                    <p className="mt-1 font-display text-lg font-black text-[#153B75]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Express Checkout Card */}
            <div className="rounded-2xl border border-[#153B75]/30 bg-white p-6 shadow-xl relative overflow-hidden text-center space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#5D8C4A] bg-[#5D8C4A]/10 px-3 py-1 rounded-full border border-[#5D8C4A]/20">
                <Sparkles className="w-3 h-3 text-[#5D8C4A]" />
                Official Voltt Store
              </span>
              <h3 className="font-display font-black text-2xl text-[#153B75]">
                Order {product.title}
              </h3>
              <p className="text-xs text-[#6B7280]">
                Real-time pincode serviceability and express shipping via Shiprocket.
              </p>
              <button
                type="button"
                onClick={() => openCheckout(product)}
                className="w-full py-4 rounded-xl bg-[#153B75] hover:bg-[#0F2C59] text-white font-display font-bold text-sm uppercase tracking-wider shadow-lg transition-all"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>

        {/* Explore Related Products */}
        <div className="mt-16 rounded-2xl border border-[#E8E3D5] bg-white p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#153B75]">
                Explore More Flavours
              </span>
              <h2 className="font-display text-2xl font-black text-[#153B75] mt-1">
                OTHER VOLTT VARIATION PAGES
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <a
                key={item.eventSlug}
                href={`#/product/${item.eventSlug}`}
                className="group rounded-xl border border-[#E8E3D5] bg-[#F7F4EC] p-5 transition-all duration-200 hover:border-[#153B75] hover:bg-white hover:shadow-md"
              >
                <h3 className="font-display text-xl font-bold text-[#153B75] group-hover:text-[#D8A24A] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-[#6B7280] line-clamp-2">{item.summary}</p>
                <p className="mt-4 text-xs font-bold text-[#153B75] flex items-center gap-1">
                  <span>View Product Page</span>
                  <span>→</span>
                </p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
