export default function FAQ() {
  const faqs = [
    { q: 'What are Voltt bars made of?', a: 'Premium natural ingredients, 20g protein per bar, no preservatives.' },
    { q: 'Are they suitable for vegans?', a: 'We have both whey and plant-based options. Check product labels.' },
    { q: 'How do I store them?', a: 'Cool, dry place. Best before date on pack.' },
    { q: 'Do you ship nationwide?', a: 'Yes, we deliver across India.' },
  ]

  return (
    <section id="about" className="bg-earthx-bg py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center">
          Got Questions? We&apos;ve Got Answers.
        </h2>
        <p className="text-earthx-muted text-center mt-4">
          Everything you need to know about Voltt protein bars
        </p>
        <dl className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-xl border border-earthx-border p-6">
              <dt className="font-display font-semibold text-earthx-dark">{faq.q}</dt>
              <dd className="mt-2 text-earthx-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
