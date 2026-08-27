import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const columns = [
    {
      heading: 'PRODUCTS',
      links: [
        { label: 'Shop All', href: '#shop' },
        { label: 'Mixed Box', href: '#stock-up' },
        { label: 'Almond Crunch', href: '#/product/almond-crunch' },
        { label: 'Choco Cranz', href: '#/product/choco-cranz' },
        { label: 'Berry Rush', href: '#/product/berry-rush' },
      ],
    },
    {
      heading: 'COMPANY',
      links: [
        { label: 'Our Story', href: '#trusted' },
        { label: 'Atelier', href: '#nutrition' },
        { label: 'Ingredients', href: '#nutrition' },
        { label: 'Sourcing', href: '#nutrition' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      heading: 'SUPPORT & CONTACT',
      links: [
        { label: 'Help Center', href: '#faq' },
        { label: 'Shipping & Returns', policy: 'shipping' },
        { label: '+91 73783 70160', href: 'tel:+917378370160' },
        { label: 'eatvoltt@gmail.com', href: 'mailto:eatvoltt@gmail.com' },
      ],
    },
  ]

  const marketer =
    'Marketed by: Pradeep Food Ventures LLP, Plot No-BG 71/2/A, Pimpri Industrial Area, Pune, Maharashtra 411026'
  const manufacturer =
    'Manufactured by: Arjava Nutrition Private Limited, E-001, Prateek Laurel, Sector-120 Noida, UP-201301'

  const [policyModal, setPolicyModal] = useState(null)

  return (
    <footer
      id="contact"
      className="bg-[#0F0F12] text-white/70 pt-14 pb-10 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main grid: brand (wide) + 3 link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">

          {/* Brand block */}
          <div className="lg:col-span-4">
            <a href="#" className="inline-block mb-3 group" aria-label="Volt Homepage">
              <img
                src="/assets/volt-logo-light.png"
                alt="Volt Logo"
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </a>
            <p className="text-white/50 text-xs leading-relaxed max-w-xs mt-3">
              Providing premium whole-food fuel designed to sustain real, modern lifestyles. Crafted without shortcuts, enjoyed without compromise.
            </p>

            {/* Direct Contact Info */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs">
              <p className="font-mono text-[10px] font-bold text-white/50 tracking-widest uppercase mb-1">CONTACT US</p>
              <a
                href="tel:+917378370160"
                className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#F95738]" />
                <span className="font-mono font-medium">+91 73783 70160</span>
              </a>
              <a
                href="mailto:eatvoltt@gmail.com"
                className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#F95738]" />
                <span>eatvoltt@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading} className="lg:col-span-2">
              <h4 className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-5">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((item) => (
                  <li key={item.label}>
                    {item.policy ? (
                      <button
                        type="button"
                        onClick={() => setPolicyModal(item.policy)}
                        className="text-xs text-white/55 hover:text-white transition-colors text-left"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        className="text-xs text-white/55 hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Corporate disclosures */}
        <div className="py-5 border-b border-white/8 text-[10px] text-white/35 font-mono space-y-0.5 leading-relaxed">
          <p>{marketer}</p>
          <p>{manufacturer}</p>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40 font-sans">
          <p>© {year} Volt Protein Co. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setPolicyModal('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setPolicyModal('terms')}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>

      </div>

      {/* Policy Modal */}
      <AnimatePresence>
        {policyModal && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setPolicyModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-xl w-full rounded-2xl bg-white text-[#2A1646] border border-[#E6DFD3] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6DFD3] bg-[#3B1B6E] text-white">
                <h3 className="font-display font-bold text-white text-base">
                  {policyModal === 'shipping' && 'Shipping & Returns'}
                  {policyModal === 'privacy' && 'Privacy Policy'}
                  {policyModal === 'terms' && 'Terms of Service'}
                </h3>
                <button
                  type="button"
                  className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                  onClick={() => setPolicyModal(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[65vh] overflow-auto px-6 py-6 text-xs text-[#2A1646] space-y-4">
                {policyModal === 'shipping' && (
                  <p className="text-[#71717A]">We ship nationwide across India with 3–7 day delivery. Due to food safety standards, unopened items can only be returned if damaged on arrival.</p>
                )}
                {policyModal === 'privacy' && (
                  <p className="text-[#71717A]">We collect only the information necessary to fulfil your orders and improve your experience. We never sell your data to third parties.</p>
                )}
                {policyModal === 'terms' && (
                  <p className="text-[#71717A]">By using this website you agree to our terms of service. All purchases are subject to our refund and shipping policy.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  )
}
