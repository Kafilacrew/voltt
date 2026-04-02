const items = [
  {
    title: 'Affordable Premium',
    subtitle: 'Same quality, 40% less price',
    icon: 'tag',
  },
  {
    title: 'Clean Ingredients',
    subtitle: 'No artificial sweeteners',
    icon: 'leaf',
  },
  {
    title: 'High Protein',
    subtitle: '10g protein per bar',
    icon: 'bolt',
  },
  {
    title: 'Added Electrolytes',
    subtitle: 'Replenish & rehydrate faster',
    icon: 'electrolyte',
  },
  {
    title: 'Natural Energy Booster',
    subtitle: 'Sustained fuel without the crash',
    icon: 'sun',
  },
  {
    title: 'Active Performance Fuel',
    subtitle: 'Built for training & recovery',
    icon: 'activity',
  },
]

function Icon({ type }) {
  const base = 'w-5 h-5'
  if (type === 'tag') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4h6l8 8-6 6-8-8V4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="9" r="1.2" fill="currentColor" />
      </svg>
    )
  }
  if (type === 'leaf') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 19c7 0 12-5 12-12-7 0-12 5-12 12z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 19c3-1 5-3 6-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'bolt') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2L6 13h5l-1 9 7-11h-5l1-9z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'electrolyte') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-12z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 14h6M12 11v6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (type === 'sun') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (type === 'activity') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none">
        <path
          d="M22 12h-4l-3 9L9 3l-3 9H2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return null
}

export default function PremiumNutrition() {

  return (
    <section id="nutrition" className="bg-earthx-bg py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center max-w-4xl mx-auto">
          Complete Nutrition. Instant Rehydration.
        </h2>
        <p className="text-earthx-muted text-center mt-4">
          Crafted to balance taste, nutrition, and clean ingredients — no compromises.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl shadow-card border border-earthx-border/60 px-6 py-7 flex flex-col items-center text-center"
            >
              <div className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-brand-red/10 text-brand-red">
                <Icon type={item.icon} />
              </div>
              <h3 className="font-display font-semibold text-earthx-dark text-base md:text-lg">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-earthx-muted">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

