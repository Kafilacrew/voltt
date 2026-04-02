import { useCart } from '../App'

const packs = [
  { id: 'stockup-6', label: 'Pack of 6', qty: 6, price: 388, oldPrice: 408, discount: 'Save 5%', perBar: '₹64.7 per bar' },
  { id: 'stockup-9', label: 'Pack of 9', qty: 9, price: 566, oldPrice: 612, discount: 'Save 7.5%', perBar: '₹62.9 per bar', featured: true },
  { id: 'stockup-12', label: 'Pack of 12', qty: 12, price: 735, oldPrice: 816, discount: 'Save 10%', perBar: '₹61.3 per bar' },
]

export default function StockUp() {
  const { addToCart, showToast } = useCart()

  return (
    <section id="stock-up" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center">
          Stock Up. Save Big.
        </h2>
        <p className="text-earthx-muted text-center mt-4 max-w-xl mx-auto">
          The more you buy, the more you save. Simple math, maximum gains.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`relative bg-white rounded-3xl px-6 py-8 flex flex-col ${pack.featured
                  ? 'border-2 border-brand-yellow shadow-card hover:shadow-card-hover md:py-10 scale-105'
                  : 'border border-earthx-border shadow-card'
                }`}
            >
              {pack.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex px-4 py-1 rounded-full bg-brand-yellow text-earthx-dark text-xs font-semibold shadow-deal">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-earthx-dark">{pack.label}</h3>
                <p className="text-earthx-muted mt-1">{pack.qty} protein bars</p>
                <span className="inline-flex mt-4 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold">
                  {pack.discount}
                </span>
                <div className="mt-5 flex items-baseline gap-2">
                  <p className="font-display font-extrabold text-3xl text-earthx-dark">₹{pack.price}</p>
                  <p className="text-earthx-muted text-sm line-through">₹{pack.oldPrice}</p>
                </div>
                <p className="text-earthx-muted text-sm mt-1">{pack.perBar}</p>
                {pack.featured && (
                  <p className="mt-3 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span>⚠</span> Only 5 left at this price
                  </p>
                )}
                <ul className="mt-5 space-y-2 text-sm text-earthx-dark">
                  <li className="flex items-center gap-2"><span className="text-brand-teal">✓</span> Free shipping</li>
                  <li className="flex items-center gap-2"><span className="text-brand-teal">✓</span> Mix &amp; match flavors</li>
                  <li className="flex items-center gap-2"><span className="text-brand-teal">✓</span> 30-day money back</li>
                </ul>
              </div>

              <button
                type="button"
                className={`mt-8 h-12 rounded-xl font-semibold transition ${pack.featured
                    ? 'bg-brand-red text-white hover:opacity-90'
                    : 'bg-earthx-dark text-white hover:bg-black'
                  }`}
                onClick={() => {
                  addToCart({ id: pack.id, name: pack.label, price: pack.price, qty: 1 })
                  showToast(`${pack.label} added to cart!`)
                }}
              >
                Get {pack.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
