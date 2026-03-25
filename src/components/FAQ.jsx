import { useMemo, useState } from 'react'

export default function FAQ() {
  const faqs = [
    {
      q: 'What makes your protein bars different?',
      a: 'Crafted to balance taste, nutrition, and clean ingredients — no compromises.',
    },
    {
      q: 'What kind of ingredients do you use?',
      a: 'Made with high-quality protein sources and carefully selected ingredients.',
    },
    {
      q: 'Who are these bars for?',
      a: 'Perfect for anyone looking for a convenient, healthier snack option.',
    },
    {
      q: 'When will the bars be available?',
      a: 'Launching soon — stay tuned!',
    },
    {
      q: 'What are Voltt protein bars made of?',
      a: 'Voltt bars are crafted using high-quality ingredients like protein blends, nuts, and natural flavors to give you clean and effective nutrition.',
    },
    {
      q: 'How much protein does each bar contain?',
      a: 'Each Voltt bar is designed to deliver a solid protein boost to support your daily nutrition and fitness goals.',
    },
    {
      q: 'Are Voltt protein bars suitable for vegetarians?',
      a: 'Yes, our bars are vegetarian-friendly. We also offer both whey-based and plant-based options.',
    },
    {
      q: 'When is the best time to eat a Voltt bar?',
      a: 'You can enjoy it anytime — as a pre-workout boost, post-workout recovery snack, or a healthy on-the-go option.',
    },
    {
      q: 'Do Voltt bars contain added sugar or preservatives?',
      a: 'We focus on clean nutrition, keeping unnecessary additives and preservatives to a minimum.',
    },
    {
      q: 'Are these bars good for weight management?',
      a: 'Yes, they can be a convenient, portion-controlled snack that helps manage hunger and supports fitness goals.',
    },
    {
      q: 'How should I store Voltt protein bars?',
      a: 'Store them in a cool, dry place away from direct sunlight.',
    },
    {
      q: 'Are Voltt bars suitable for beginners or only athletes?',
      a: 'They’re perfect for everyone — whether you’re just starting your fitness journey or already active.',
    },
    {
      q: 'Where do you ship?',
      a: 'We currently ship across India.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders are typically delivered within 3–7 business days, depending on your location.',
    },
    {
      q: 'When will my order be shipped?',
      a: 'All orders are processed and dispatched within 24–48 hours after confirmation.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order is shipped, you’ll receive a tracking link via SMS/email.',
    },
    {
      q: 'Is there a shipping charge?',
      a: 'Shipping charges may vary based on your location and order value. Free shipping may be available on selected orders or offers.',
    },
    {
      q: 'Do you accept returns?',
      a: 'Due to the nature of food products, we do not accept returns once the product is delivered.',
    },
    {
      q: 'What if I receive a damaged or wrong product?',
      a: 'If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery with photos/videos as proof.',
    },
    {
      q: 'Will I get a refund or replacement?',
      a: 'After verification, we will offer a replacement or refund, depending on the situation.',
    },
    {
      q: 'How long do refunds take?',
      a: 'Approved refunds are processed within 5–7 business days to your original payment method.',
    },
    {
      q: 'Can I cancel my order?',
      a: 'Orders can only be cancelled before they are shipped. Once dispatched, cancellations are not possible.',
    },
  ]

  const initialVisible = 6
  const [showAll, setShowAll] = useState(false)
  const visibleFaqs = useMemo(
    () => (showAll ? faqs : faqs.slice(0, initialVisible)),
    [faqs, showAll],
  )

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
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Show less' : 'Show more'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
