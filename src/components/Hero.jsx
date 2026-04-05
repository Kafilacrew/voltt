export default function Hero() {
  const features = [
    '100% Natural',
    '10g Protein',
    'No Preservatives',
    'With added electrolytes',
  ]

  return (
    <section className="relative min-h-[980px] md:min-h-[1080px] flex items-center overflow-hidden">
      {/* Background: gradient + single athlete (Unsplash) */}
      <div className="absolute inset-0 bg-gradient-to-br from-earthx-dark/90 to-earthx-dark/70">
        <picture className="block w-full h-full">
          <source media="(max-width: 767px)" srcSet="/assets/mobile.png" />
          <img
            src="/assets/hero.png"
            alt="Voltt protein bars hero"
            className="w-full h-full object-cover object-center opacity-90"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </picture>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-earthx-dark/80 pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-[1920px] mx-auto pl-3 pr-4 sm:pl-4 sm:pr-6 lg:pl-12 lg:pr-16 w-full">
        <div className="max-w-[320px] sm:max-w-xl">
          <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-lg">
            <span className="block">Complete</span>
            <span className="block mt-1 md:mt-2">Nutrition,</span>
            <span className="block mt-1 md:mt-2">Instant</span>
            <span className="block mt-1 md:mt-2">Rehydration</span>
          </h1>
          <p className="text-white/90 text-xl md:text-2xl mt-4 sm:mt-6">
            Protein Bars with added electrolytes
          </p>
          <div className="flex flex-wrap gap-4 mt-6 sm:mt-8">
            <a
              href="#shop"
              className="inline-flex items-center justify-center bg-brand-red text-white font-semibold h-14 px-6 rounded-xl hover:opacity-90 transition"
            >
              Shop Now
            </a>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 sm:mt-12 text-white/80">
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

