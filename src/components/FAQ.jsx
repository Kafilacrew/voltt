import { useMemo, useState } from 'react'

export default function FAQ() {
  const faqs = [
    {
      q: 'What makes your protein bars different?',
      a: 'Crafted to balance taste, nutrition, and clean ingredients with no compromises.',
    },
    {
      q: 'What kind of ingredients do you use?',
      a: 'We use high-quality protein sources and carefully selected ingredients for a cleaner snack.',
    },
    {
      q: 'Who are these bars for?',
      a: 'They work well for busy professionals, students, gym-goers, and anyone who wants a convenient better-for-you snack.',
    },
    {
      q: 'What are Voltt protein bars made of?',
      a: 'Voltt bars are made with protein blends, nuts, and flavor ingredients chosen to deliver taste and practical daily nutrition.',
    },
    {
      q: 'How much protein does each bar contain?',
      a: 'Each bar is designed to deliver 10g of protein.',
    },
    {
      q: 'Are Voltt protein bars suitable for vegetarians?',
      a: 'Yes, the bars are vegetarian-friendly.',
    },
    {
      q: 'When is the best time to eat a Voltt bar?',
      a: 'You can have one before a workout, after a workout, between meetings, or whenever you need an easy snack.',
    },
    {
      q: 'Do Voltt bars contain added sugar or preservatives?',
      a: 'The bars focus on clean nutrition and avoid unnecessary additives wherever possible.',
    },
    {
      q: 'How should I store Voltt protein bars?',
      a: 'Store them in a cool, dry place away from direct sunlight.',
    },
    {
      q: 'Where do you ship?',
      a: 'We currently ship across India.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Most orders are delivered within 3 to 7 business days depending on your location.',
    },
    {
      q: 'What if I receive a damaged or wrong product?',
      a: 'Please contact us within 48 hours of delivery with photos or videos so the team can review it quickly.',
    },
  ]

  const initialVisible = 6
  const [showAll, setShowAll] = useState(false)
  const visibleFaqs = useMemo(
    () => (showAll ? faqs : faqs.slice(0, initialVisible)),
    [showAll],
  )

  return (
    <section id="faq" className="bg-earthx-bg py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center">
          Got Questions? We&apos;ve Got Answers.
        </h2>
        <p className="text-earthx-muted text-center mt-4">
          Quick answers about ingredients, delivery, and how to enjoy Voltt.
        </p>
        <dl className="mt-12 space-y-4">
          {visibleFaqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-xl border border-earthx-border p-6">
              <dt className="font-display font-semibold text-earthx-dark">{faq.q}</dt>
              <dd className="mt-2 text-earthx-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>

        {faqs.length > initialVisible && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="h-11 px-6 rounded-xl bg-earthx-dark text-white text-sm font-semibold hover:bg-black transition"
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? 'Show less' : 'Show more'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
