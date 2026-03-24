const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Verified Purchase',
    text:
      'Finally found a protein bar that tastes amazing AND is affordable! The chocolate brownie flavor is my favorite. Been ordering for 3 months now.',
    avatarEmoji: '👩',
  },
  {
    name: 'Rahul Mehta',
    role: 'Fitness Coach',
    text:
      'As a fitness coach, I recommend Voltt to all my clients. Clean ingredients, great macros, and the price is unbeatable.',
    avatarEmoji: '👨',
  },
  {
    name: 'Ananya Patel',
    role: 'Verified Purchase',
    text:
      'Perfect for my busy lifestyle. I keep a box at work and one in my gym bag. The peanut butter flavor is addictive!',
    avatarEmoji: '👩',
  },
]

export default function TrustedBy() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center">
          Trusted by Fitness Enthusiasts
        </h2>

        {/* Review cards */}
        <div className="mt-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="bg-white rounded-3xl border border-earthx-border shadow-card p-6 md:p-7 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-earthx-bg border border-earthx-border/60 flex items-center justify-center text-2xl md:text-3xl leading-none shrink-0 select-none"
                    aria-hidden="true"
                  >
                    {t.avatarEmoji}
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
