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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#E6DFD3] shadow-subtle py-3'
            : 'bg-[#F5F2EB] py-5 border-b border-[#E6DFD3]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Left */}
          <a href="#" className="flex items-center group" aria-label="Voltt Homepage">
            <img
              src="/assets/volt-logo-dark.png"
              alt="Voltt Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
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
                  className={`text-sm font-bold tracking-tight transition-colors duration-200 ${
                    isActive ? 'text-[#2A1646]' : 'text-[#2A1646]/80 hover:text-[#F95738]'
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </nav>

          {/* Action CTA Buttons Right */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Account / Order History Trigger */}
            <button
              type="button"
              onClick={() => openAuth && openAuth()}
              aria-label="Customer Account & Order History"
              className="flex items-center gap-1.5 text-xs font-bold text-[#2A1646] hover:text-[#F95738] transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-black/5"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => openCart && openCart()}
              aria-label={`View cart (${cartTotalCount || 0} items)`}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2A1646] hover:text-[#F95738] transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-black/5"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-[#F95738] text-white text-[9px] font-black flex items-center justify-center leading-none">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">({cartTotalCount || 0})</span>
            </button>

            <a
              href="#shop"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full bg-[#F95738] hover:bg-[#E04729] text-white font-display font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md active:scale-95"
            >
              SHOP NOW
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#2A1646] hover:text-[#F95738] cursor-pointer"
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
            <div className="flex flex-col gap-3">
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

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  if (openCart) openCart()
                }}
                className="flex items-center justify-between text-sm font-bold tracking-tight text-[#2A1646] hover:text-[#F95738] py-2 border-b border-[#E6DFD3]/50 text-left cursor-pointer"
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
                className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#2A1646] hover:text-[#F95738] py-2 border-b border-[#E6DFD3]/50 text-left cursor-pointer"
              >
                <User className="w-4 h-4 text-[#D9A441]" />
                <span>My Account &amp; Order History</span>
              </button>

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
