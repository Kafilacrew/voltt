const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Verified Purchase',
    text:
      'Finally found a protein bar that tastes amazing AND is affordable! The chocolate brownie flavor is my favorite. Been ordering for 3 months now.',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Rahul Mehta',
    role: 'Fitness Coach',
    text:
      'As a fitness coach, I recommend Voltt to all my clients. Clean ingredients, great macros, and the price is unbeatable.',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Ananya Patel',
    role: 'Verified Purchase',
    text:
      'Perfect for my busy lifestyle. I keep a box at work and one in my gym bag. The peanut butter flavor is addictive!',
    avatar:
      'https://images.unsplash.com/photo-1544723795-432537d12f6c?auto=format&fit=crop&w=200&q=80',
  },
]

export default function TrustedBy() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center">
          Trusted by 50,000+ Fitness Enthusiasts
        </h2>

        {/* Bars sold card */}
        <div className="mt-8 flex flex-col items-center">
          <div className="inline-flex px-10 py-6 rounded-3xl bg-gradient-to-r from-brand-red to-brand-brown text-center text-white shadow-card">
            <div>
              <p className="font-display font-extrabold text-3xl md:text-4xl">127,458</p>
              <p className="text-sm md:text-base mt-1 opacity-90">Bars Sold This Month</p>
            </div>
          </div>

          {/* Rating line */}
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-6 h-6 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="font-semibold text-earthx-dark ml-2">4.8/5</span>
            <span className="text-earthx-muted ml-1">(2,847 reviews)</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="mt-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="bg-white rounded-3xl border border-earthx-border shadow-card p-6 md:p-7 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-earthx-bg overflow-hidden">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-earthx-dark text-sm">{t.name}</p>
                    <p className="text-xs text-earthx-muted">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-brand-yellow text-sm">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-sm text-earthx-muted leading-relaxed flex-1">{t.text}</p>
                <p className="text-xs font-semibold text-brand-teal mt-1">Verified Purchase ✓</p>
              </article>
            ))}
          </div>

          {/* Carousel arrows (static for now) */}
          <button
            type="button"
            className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-earthx-border shadow items-center justify-center hover:bg-earthx-bg transition"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-earthx-border shadow items-center justify-center hover:bg-earthx-bg transition"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
