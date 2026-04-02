export default function StockUp() {
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
          {/* Pack of 6 */}
          <div className="bg-white rounded-3xl border border-earthx-border shadow-card px-6 py-8 flex flex-col">
            <div className="flex-1">
              <h3 className="font-display font-bold text-xl text-earthx-dark">Pack of 6</h3>
              <p className="text-earthx-muted mt-1">6 protein bars</p>
              <span className="inline-flex mt-4 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold">
                Save 5%
              </span>
              <div className="mt-5 flex items-baseline gap-2">
                <p className="font-display font-extrabold text-3xl text-earthx-dark">₹388</p>
                <p className="text-earthx-muted text-sm line-through">₹408</p>
              </div>
              <p className="text-earthx-muted text-sm mt-1">₹64.7 per bar</p>
              <ul className="mt-5 space-y-2 text-sm text-earthx-dark">
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> Free shipping
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> Mix &amp; match flavors
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> 30-day money back
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="mt-8 h-12 rounded-xl bg-earthx-dark text-white font-semibold hover:bg-black transition"
            >
              Get Pack of 6
            </button>
          </div>

          {/* Pack of 9 (featured) */}
          <div className="relative bg-white rounded-3xl border-2 border-brand-yellow shadow-card hover:shadow-card-hover px-6 py-8 md:py-10 flex flex-col scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="inline-flex px-4 py-1 rounded-full bg-brand-yellow text-earthx-dark text-xs font-semibold shadow-deal">
                Most Popular
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-xl text-earthx-dark">Pack of 9</h3>
              <p className="text-earthx-muted mt-1">9 protein bars</p>
              <span className="inline-flex mt-4 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold">
                Save 7.5%
              </span>
              <div className="mt-5 flex items-baseline gap-2">
                <p className="font-display font-extrabold text-3xl text-earthx-dark">₹566</p>
                <p className="text-earthx-muted text-sm line-through">₹612</p>
              </div>
              <p className="text-earthx-muted text-sm mt-1">₹62.9 per bar</p>
              <p className="mt-3 text-xs text-red-500 font-medium flex items-center gap-1">
                <span>⚠</span> Only 5 left at this price
              </p>
              <ul className="mt-4 space-y-2 text-sm text-earthx-dark">
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> Free shipping
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> Mix &amp; match flavors
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> 30-day money back
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="mt-8 h-12 rounded-xl bg-brand-red text-white font-semibold hover:opacity-90 transition"
            >
              Get Pack of 9
            </button>
          </div>

          {/* Pack of 12 */}
          <div className="bg-white rounded-3xl border border-earthx-border shadow-card px-6 py-8 flex flex-col">
            <div className="flex-1">
              <h3 className="font-display font-bold text-xl text-earthx-dark">Pack of 12</h3>
              <p className="text-earthx-muted mt-1">12 protein bars</p>
              <span className="inline-flex mt-4 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold">
                Save 10%
              </span>
              <div className="mt-5 flex items-baseline gap-2">
                <p className="font-display font-extrabold text-3xl text-earthx-dark">₹735</p>
                <p className="text-earthx-muted text-sm line-through">₹816</p>
              </div>
              <p className="text-earthx-muted text-sm mt-1">₹61.3 per bar</p>
              <ul className="mt-5 space-y-2 text-sm text-earthx-dark">
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> Free shipping
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> Mix &amp; match flavors
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-teal">✓</span> 30-day money back
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="mt-8 h-12 rounded-xl bg-earthx-dark text-white font-semibold hover:bg-black transition"
            >
              Get Pack of 12
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

