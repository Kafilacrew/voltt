import { useState } from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  const shop = [
    { label: 'Choose Your Power', href: '#shop' },
    { label: 'Premium Nutrition', href: '#stock-up' },
  ]
  const support = [
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#about' },
    { label: 'Cart', href: '#cart' },
  ]
  const contact = [
    { label: '+91 73859 74015', href: 'tel:+917385974015' },
    { label: 'eatvoltt@gmail.com', href: 'mailto:eatvoltt@gmail.com' },
  ]
  const marketer =
    'Marketed by: Pradeep Food Ventures LLP, Flat No: A-201, 2nd Floor, The Spires, Aundh Police Station Road, Aundh, Pune, Maharashtra 411007'
  const manufacturer =
    'Manufactured by : Arjava Nutrition Private Limited E-001, Prateek Laurel, Sector-120 Noida, Gautam Buddha Nagar, Uttar Pradesh-201301'

  const [policyModal, setPolicyModal] = useState(null) // 'shipping' | 'returns' | null

  return (
    <footer className="bg-white border-t border-earthx-border">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5 max-w-md">
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
                href="https://instagram.com/eatvoltt"
                target="_blank"
                rel="noreferrer"
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
              <a
                href="https://linkedin.com/company/eatvoltt/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-earthx-bg flex items-center justify-center hover:bg-earthx-border transition"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5 text-earthx-muted"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.84v2.13h.05c.53-1 1.84-2.13 3.79-2.13 4.05 0 4.8 2.67 4.8 6.14V24h-4v-8.5c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.26 2.21-3.26 4.5V24h-4V8.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-display font-bold text-earthx-dark mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              {shop.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-earthx-muted hover:text-earthx-dark transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="font-display font-bold text-earthx-dark mt-8 mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              {support.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <a href={item.href} className="text-earthx-muted hover:text-earthx-dark transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display font-bold text-earthx-dark mb-3">Contact</h4>
            <ul className="space-y-2 text-earthx-muted text-sm">
              {contact.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-earthx-dark transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3 text-[11px] leading-relaxed text-earthx-muted">
              <p>{marketer}</p>
              <p>{manufacturer}</p>
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
            <button
              type="button"
              className="text-earthx-muted hover:text-earthx-dark"
              onClick={() => setPolicyModal('shipping')}
            >
              Shipping Policy
            </button>
            <button
              type="button"
              className="text-earthx-muted hover:text-earthx-dark"
              onClick={() => setPolicyModal('returns')}
            >
              Returns &amp; Refunds Policy
            </button>
          </div>
        </div>
      </div>

      {policyModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPolicyModal(null)}
        >
          <div
            className="max-w-2xl w-full rounded-2xl bg-white shadow-card overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-earthx-border bg-earthx-bg">
              <h3 className="font-display font-semibold text-earthx-dark text-sm md:text-base">
                {policyModal === 'shipping' ? 'Shipping Policy' : 'Returns & Refunds Policy'}
              </h3>
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-earthx-muted hover:bg-white transition"
                onClick={() => setPolicyModal(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto px-5 py-5 text-sm text-earthx-dark">
              {policyModal === 'shipping' ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Where do you ship?</p>
                    <p className="text-earthx-muted">We currently ship across India.</p>
                  </div>
                  <div>
                    <p className="font-semibold">How long does delivery take?</p>
                    <p className="text-earthx-muted">
                      Orders are typically delivered within 3–7 business days, depending on your
                      location.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">When will my order be shipped?</p>
                    <p className="text-earthx-muted">
                      All orders are processed and dispatched within 24–48 hours after confirmation.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">How can I track my order?</p>
                    <p className="text-earthx-muted">
                      Once your order is shipped, you’ll receive a tracking link via SMS/email.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Is there a shipping charge?</p>
                    <p className="text-earthx-muted">
                      Shipping charges may vary based on your location and order value. Free
                      shipping may be available on selected orders or offers.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Do you accept returns?</p>
                    <p className="text-earthx-muted">
                      Due to the nature of food products, we do not accept returns once the product
                      is delivered.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">What if I receive a damaged or wrong product?</p>
                    <p className="text-earthx-muted">
                      If you receive a damaged, defective, or incorrect item, please contact us
                      within 48 hours of delivery with photos/videos as proof.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Will I get a refund or replacement?</p>
                    <p className="text-earthx-muted">
                      After verification, we will offer a replacement or refund, depending on the
                      situation.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">How long do refunds take?</p>
                    <p className="text-earthx-muted">
                      Approved refunds are processed within 5–7 business days to your original
                      payment method.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Can I cancel my order?</p>
                    <p className="text-earthx-muted">
                      Orders can only be cancelled before they are shipped. Once dispatched,
                      cancellations are not possible.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
