export default function YourGoalOurFuel() {
  const goals = [
    {
      title: 'Weight Loss',
      subtitle: 'Low Sugar, High Fiber',
      image:
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=85',
    },
    {
      title: 'Muscle Gain',
      subtitle: '25g Protein, BCAAs',
      image:
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=85',
    },
    {
      title: 'Quick Energy',
      subtitle: 'Natural Carbs, Zero Crash',
      image:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=85',
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
            <article
              key={g.title}
              className="block rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition transform hover:-translate-y-1 bg-gradient-to-b from-transparent to-black/80 relative"
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
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

