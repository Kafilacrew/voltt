import { useCart } from '../App'

export default function Nav() {
  const { cartCount } = useCart()
  const links = [
    { label: 'About Us', href: '#about' },
    { label: 'Why Voltt', href: '#why' },
    { label: 'Nutrition Hub', href: '#nutrition' },
    { label: 'Contact', href: '#contact' },
    { label: 'Shop', href: '#shop', dropdown: true },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-earthx-border h-20 flex items-center justify-between px-6 lg:px-12 max-w-[1920px] mx-auto">
      <a href="#" className="font-display font-black text-2xl text-earthx-dark">
        Voltt
      </a>
      <div className="hidden md:flex items-center gap-8">
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-earthx-muted font-medium hover:text-earthx-dark transition"
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="p-2 rounded-full hover:bg-earthx-bg" aria-label="Search">
          <svg className="w-5 h-5 text-earthx-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button type="button" className="p-2 rounded-full hover:bg-earthx-bg" aria-label="Account">
          <svg className="w-5 h-5 text-earthx-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <a
          href="#cart"
          className="relative p-2 rounded-full hover:bg-earthx-bg"
          aria-label="Cart"
        >
          <svg className="w-5 h-5 text-earthx-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-brand-red text-white text-[11px] leading-[18px] text-center px-1">
              {cartCount}
            </span>
          )}
        </a>
      </div>
    </nav>
  )
}
