import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, Zap } from 'lucide-react'
import { useAppContext } from '../App'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { openCheckout } = useAppContext()

  const links = [
    { label: 'Shop All', href: '#shop' },
    { label: 'Why Volt', href: '#trusted' },
    { label: 'Flavours', href: '#shop' },
    { label: 'Reviews', href: '#trusted' },
    { label: 'Build A Box', href: '#stock-up' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = ['shop', 'nutrition', 'trusted', 'faq', 'stock-up']
      const current = sections.find((sec) => {
        const el = document.getElementById(sec)
        if (el) {
          const rect = el.getBoundingClientRect()
          return rect.top <= 200 && rect.bottom >= 200
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#E6DFD3] shadow-subtle py-3'
            : 'bg-[#F5F2EB] py-5 border-b border-[#E6DFD3]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Left matching reference screenshot */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="flex items-center gap-1 text-[#2A1646] font-display font-black text-2xl tracking-tighter">
              <Zap className="w-6 h-6 fill-[#2A1646] text-[#2A1646]" />
              <span>VOLT</span>
            </div>
          </a>

          {/* Desktop Nav Links Center matching reference screenshot */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(({ label, href }) => {
              const secId = href.replace('#', '')
              const isActive = activeSection === secId
              return (
                <a
                  key={label}
                  href={href}
                  className={`text-sm font-bold tracking-tight transition-colors duration-200 ${
                    isActive ? 'text-[#2A1646]' : 'text-[#2A1646]/80 hover:text-[#F95738]'
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </nav>

          {/* Action CTA Button Right matching reference screenshot */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => openCheckout()}
              aria-label="View cart"
              className="flex items-center gap-1.5 text-xs font-bold text-[#2A1646] hover:text-[#F95738] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>(0)</span>
            </button>

            <a
              href="#shop"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#F95738] hover:bg-[#E04729] text-white font-display font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md active:scale-95"
            >
              SHOP NOW
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#2A1646] hover:text-[#F95738]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-[#F5F2EB] border-b border-[#E6DFD3] px-6 py-6 lg:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold tracking-tight text-[#2A1646] hover:text-[#F95738] py-2 border-b border-[#E6DFD3]/50"
                >
                  {label}
                </a>
              ))}
              <a
                href="#shop"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#F95738] text-white text-xs font-bold tracking-wider uppercase shadow-md"
              >
                <span>SHOP NOW</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
