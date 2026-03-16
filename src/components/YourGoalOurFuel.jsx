export default function YourGoalOurFuel() {
  const goals = [
    {
      title: 'Weight Loss',
      subtitle: 'Low Sugar, High Fiber',
      currentPrice: '₹159',
      oldPrice: '₹199',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Muscle Gain',
      subtitle: '25g Protein, BCAAs',
      currentPrice: '₹179',
      oldPrice: '₹229',
      image:
        'https://images.unsplash.com/photo-1554344058-8d1d1dbc5960?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Quick Energy',
      subtitle: 'Natural Carbs, Zero Crash',
      currentPrice: '₹149',
      oldPrice: '₹189',
      image:
        'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=900&q=80',
    },
  ]

  return (
    <section className="bg-earthx-bg py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center">
          Your Goal. Our Fuel.
        </h2>
        <p className="text-earthx-muted text-center mt-4 max-w-xl mx-auto">
          Whatever your fitness journey looks like, we&apos;ve got the perfect bar for you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {goals.map((g) => (
            <a
              key={g.title}
              href="#shop"
              className="group block rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition transform hover:-translate-y-1 bg-gradient-to-b from-transparent to-black/80 relative"
            >
              {/* Image as background layer */}
              <div className="absolute inset-0">
                <img
                  src={g.image}
                  alt={g.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/85" />
              </div>

              {/* Content at bottom */}
              <div className="relative h-[420px] flex flex-col justify-end p-7 text-white">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-2xl">{g.title}</h3>
                  <p className="text-sm text-white/80">{g.subtitle}</p>
                  <div className="flex items-baseline gap-2 text-sm">
                    <span className="text-brand-yellow font-semibold">{g.currentPrice}</span>
                    <span className="text-white/60 line-through text-xs">{g.oldPrice}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-yellow group-hover:gap-3 transition-[gap]"
                >
                  Shop Now
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

