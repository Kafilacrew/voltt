export default function Footer() {
  const year = new Date().getFullYear()
  const shop = ['All Products', 'Best Sellers', 'High Protein', 'Bundle & Save']
  const support = ['FAQ', 'Shipping & Returns', 'Contact Us', 'Track Order']
  const company = ['About Us', 'Our Story', 'Blog', 'Careers']
  const contact = ['eatvoltt@gmail.com', 'Support 9am–6pm IST']
  const marketer =
    'Marketed by: Pradeep Food Ventures LLP, Flat No: A-201, 2nd Floor, The Spires, Aundh Police Station Road, Aundh, Pune, Maharashtra 411007'
  const manufacturer = 'Manufactured by: Arjava Nutrition, Noida, Uttar Pradesh, India'
  const productInfo = 'Net wt: 40g · Shelf life: 6 months'

  return (
    <footer className="bg-white border-t border-earthx-border">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <a href="#" className="inline-block">
              <img
                src="/16.png"
                alt="Voltt"
                width={111.6}
                height={36}
                className="block h-[36px] w-[111.6px] object-contain"
              />
            </a>
            <p className="text-earthx-muted text-sm mt-4 leading-relaxed">
              Premium protein bars crafted with care. Fuel your ambitions without breaking the bank.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-earthx-bg flex items-center justify-center hover:bg-earthx-border transition"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5 text-earthx-muted"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm10 1a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-earthx-dark mb-4">Shop</h4>
            <ul className="space-y-3">
              {shop.map((item) => (
                <li key={item}>
                  <a href="#" className="text-earthx-muted hover:text-earthx-dark transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-earthx-dark mb-4">Support</h4>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item}>
                  <a href="#" className="text-earthx-muted hover:text-earthx-dark transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-earthx-dark mb-4">Company</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item}>
                  <a href="#" className="text-earthx-muted hover:text-earthx-dark transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-earthx-dark mb-4">Contact</h4>
            <ul className="space-y-3 text-earthx-muted text-sm">
              {contact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 text-[11px] leading-relaxed text-earthx-muted">
              <p>{marketer}</p>
              <p>{manufacturer}</p>
              <p>{productInfo}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-earthx-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-earthx-muted">
            <span>We accept:</span>
            <span className="px-2 py-1 rounded bg-earthx-bg">Card</span>
            <span className="px-2 py-1 rounded bg-earthx-bg">UPI</span>
            <span className="px-2 py-1 rounded bg-earthx-bg">Net Banking</span>
            <span className="flex items-center gap-1 text-brand-teal font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              100% Secure Checkout
            </span>
          </div>
          <p className="text-earthx-muted text-sm">© {year} Voltt. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-earthx-muted hover:text-earthx-dark">Privacy</a>
            <a href="#" className="text-earthx-muted hover:text-earthx-dark">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
