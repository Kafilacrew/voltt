import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useAppContext } from '../App'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { openCheckout, openCart, cartTotalCount, openAuth } = useAppContext()

  const links = [
    { label: 'Shop All', href: '#shop' },
    { label: 'Why Voltt', href: '#trusted' },
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
        className={`sticky top-0 z-50 w-full max-w-full transition-all duration-300 relative ${
          scrolled
            ? 'diwali-nav-scrolled py-3 border-b border-[#D9A441]/35'
            : 'diwali-nav-bg py-5 border-b border-[#D9A441]/25'
        }`}
      >
        {/* Subtle Decorative Golden Corner Motifs (Rangoli Inspired) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none overflow-hidden opacity-20 hidden md:block">
          <svg className="h-full w-auto text-[#D9A441]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="0" cy="50" r="40" strokeDasharray="3 3" />
            <circle cx="0" cy="50" r="28" />
            <circle cx="0" cy="50" r="16" />
            <path d="M 0 10 L 0 90 M -40 50 L 40 50 M 0 25 L 25 50 L 0 75" />
          </svg>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none select-none overflow-hidden opacity-20 hidden md:block">
          <svg className="h-full w-auto text-[#D9A441] ml-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="100" cy="50" r="40" strokeDasharray="3 3" />
            <circle cx="100" cy="50" r="28" />
            <circle cx="100" cy="50" r="16" />
            <path d="M 100 10 L 100 90 M 60 50 L 140 50 M 100 25 L 75 50 L 100 75" />
          </svg>
        </div>

        {/* Tiny Floating Gold Sparkle Stars */}
        <div className="absolute left-6 top-3 pointer-events-none select-none hidden lg:block">
          <svg className="w-3.5 h-3.5 text-[#D9A441] animate-sparkle-twinkle" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
        <div className="absolute right-8 bottom-3 pointer-events-none select-none hidden lg:block" style={{ animationDelay: '1.5s' }}>
          <svg className="w-3 h-3 text-[#D9A441] animate-sparkle-twinkle" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between relative z-10 min-w-0">
          
          {/* Logo Left */}
          <a href="#" className="flex items-center gap-2 group shrink-0" aria-label="Voltt Homepage">
            <img
              src="/assets/volt-logo-dark.png"
              alt="Voltt Logo"
              className="h-7 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            {/* Delicate festive flourish dot */}
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#D9A441] shadow-[0_0_6px_#D9A441]" title="Festive Edition" />
          </a>

          {/* Desktop Nav Links Center */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(({ label, href }) => {
              const secId = href.replace('#', '')
              const isActive = activeSection === secId
              return (
                <a
                  key={label}
                  href={href}
                  className={`text-sm font-bold tracking-tight transition-all duration-200 ${
                    isActive
                      ? 'text-[#2A1646] border-b-2 border-[#D9A441] pb-0.5'
                      : 'text-[#2A1646]/80 hover:text-[#B45309]'
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </nav>

          {/* Action CTA Buttons Right */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-4">
            {/* Account / Order History Trigger */}
            <button
              type="button"
              onClick={() => openAuth && openAuth()}
              aria-label="Customer Account & Order History"
              className="flex items-center gap-1.5 text-xs font-bold text-[#2A1646] hover:text-[#B45309] transition-colors cursor-pointer p-1.5 sm:py-1.5 sm:px-2.5 rounded-lg hover:bg-[#D9A441]/10 border border-transparent hover:border-[#D9A441]/30"
            >
              <User className="w-4 h-4 text-[#D9A441]" />
              <span className="hidden sm:inline">Account</span>
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => openCart && openCart()}
              aria-label={`View cart (${cartTotalCount || 0} items)`}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2A1646] hover:text-[#B45309] transition-colors cursor-pointer p-1.5 sm:py-1.5 sm:px-2.5 rounded-lg hover:bg-[#D9A441]/10 border border-transparent hover:border-[#D9A441]/30"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#2A1646]" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-[#F95738] text-white text-[9px] font-black flex items-center justify-center leading-none shadow-[0_0_8px_rgba(249,87,56,0.6)]">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">({cartTotalCount || 0})</span>
            </button>

            {/* Glowing Festive Shop Now Button */}
            <a
              href="#shop"
              className="inline-flex items-center justify-center px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-[#F95738] hover:bg-[#E04729] text-white font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-200 diwali-nav-shop-btn diwali-cta-gold active:scale-95 cursor-pointer shrink-0"
            >
              SHOP NOW
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-[#2A1646] hover:text-[#F95738] cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-40 bg-[#FAF7F0] border-b border-[#D9A441]/35 px-6 py-6 lg:hidden shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col gap-3">
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold tracking-tight text-[#2A1646] hover:text-[#B45309] py-2 border-b border-[#D9A441]/20"
                >
                  {label}
                </a>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  if (openCart) openCart()
                }}
                className="flex items-center justify-between text-sm font-bold tracking-tight text-[#2A1646] hover:text-[#B45309] py-2 border-b border-[#D9A441]/20 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#F95738]" />
                  <span>My Cart</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#2A1646] text-white text-xs font-bold">
                  {cartTotalCount || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  if (openAuth) openAuth()
                }}
                className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#2A1646] hover:text-[#B45309] py-2 border-b border-[#D9A441]/20 text-left cursor-pointer"
              >
                <User className="w-4 h-4 text-[#D9A441]" />
                <span>My Account &amp; Order History</span>
              </button>

              <a
                href="#shop"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#F95738] hover:bg-[#E04729] text-white text-xs font-bold tracking-wider uppercase diwali-nav-shop-btn diwali-cta-gold"
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
