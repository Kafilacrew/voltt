export default function Hero() {
  const features = [
    '100% Natural',
    '10g Protein',
    'No Preservatives',
    'With added electrolytes',
  ]

  return (
    <section className="relative min-h-[1080px] flex items-center overflow-hidden">
      {/* Background: gradient + single athlete (Unsplash) */}
      <div className="absolute inset-0 bg-gradient-to-br from-earthx-dark/90 to-earthx-dark/70">
        <img
          src="/assets/hero.png"
          alt="Voltt protein bars hero"
          className="w-full h-full object-cover object-center opacity-90"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-earthx-dark/80 pointer-events-none" />

      {/* Flash sale badge */}
      <div className="absolute top-32 right-8 md:right-12">
        <div className="bg-brand-yellow text-earthx-dark rounded-2xl px-5 py-3 shadow-deal">
          <div className="flex items-center gap-2 text-sm md:text-base font-semibold">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-red-600">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3L8 9H12L10 15L16 9H12L12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Flash Sale</span>
          </div>
          <p className="font-mono text-xs font-bold mt-1">Ends in 02:47:26</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-[1920px] mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-xl">
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white leading-none drop-shadow-lg">
            Complete Nutrition,
            <br />
            Instant Rehydration
          </h1>
          <p className="text-white/90 text-xl md:text-2xl mt-6">
            Protein Bars with added electrolytes
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="#shop"
              className="inline-flex items-center justify-center bg-brand-red text-white font-semibold h-14 px-6 rounded-xl hover:opacity-90 transition"
            >
              Shop Now
            </a>
          </div>
          <div className="flex flex-wrap gap-6 mt-12 text-white/80">
            {features.map((f) => (
              <span key={f} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-yellow shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-earthx-dark to-transparent pointer-events-none" />
    </section>
  )
}

