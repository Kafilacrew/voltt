import { useAppContext } from '../App'
import { PRODUCTS } from '../data/products'
import EmbeddedBookingWidget from './EmbeddedBookingWidget'

export default function ProductBookingPage({ product }) {
  const { openNutrition } = useAppContext()
  const relatedProducts = PRODUCTS.filter((item) => item.eventSlug !== product.eventSlug)

  return (
    <section className="bg-earthx-bg/60 py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        <a
          href="#shop"
          className="inline-flex items-center text-sm font-semibold text-earthx-muted transition hover:text-earthx-dark"
        >
          Back to shop
        </a>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="overflow-hidden rounded-[28px] border border-earthx-border bg-white shadow-card">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="relative min-h-[360px] bg-earthx-bg">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.target.style.display = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => openNutrition(product.nutritionKey)}
                  className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-brand-red shadow-card transition hover:bg-white"
                >
                  View Nutrition
                </button>
              </div>

              <div className="p-6 md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red/80">
                  {product.eyebrow}
                </p>
                <h1 className="mt-3 font-display text-4xl font-bold text-earthx-dark md:text-5xl">
                  {product.title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-earthx-muted">
                  {product.summary}
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-6 rounded-2xl bg-earthx-bg/80 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earthx-muted">
                      Price
                    </p>
                    <p className="mt-1 font-display text-3xl font-bold text-earthx-dark">
                      Rs. {product.price}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-earthx-muted">{product.description}</p>

                <div className="mt-8 grid gap-3">
                  {product.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-3 rounded-2xl border border-earthx-border/80 px-4 py-3"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                        +
                      </span>
                      <p className="text-sm text-earthx-dark">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="self-start rounded-[28px] border border-earthx-border bg-white p-5 shadow-card md:p-6 lg:sticky lg:top-28">
            <div className="rounded-2xl bg-earthx-bg/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red/80">
                    Nutrition
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-earthx-dark">
                    Per 40g bar
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => openNutrition(product.nutritionKey)}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-red shadow-card transition hover:bg-brand-red hover:text-white"
                >
                  View full
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {product.nutritionSummary.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-earthx-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 font-display text-xl font-bold text-earthx-dark">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-earthx-border bg-white p-5 shadow-card md:p-6">
          <EmbeddedBookingWidget eventSlug={product.eventSlug} productTitle={product.title} />
        </div>

        <div className="mt-10 rounded-[28px] border border-earthx-border bg-white p-6 shadow-card md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red/80">
                Explore More
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-earthx-dark">
                Other Voltt product pages
              </h2>
            </div>
            <p className="text-sm text-earthx-muted">
              Each one opens its own page with the full embedded widget.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <a
                key={item.eventSlug}
                href={`#/product/${item.eventSlug}`}
                className="rounded-2xl border border-earthx-border p-4 transition hover:border-brand-red/50 hover:shadow-card"
              >
                <p className="font-display text-xl font-semibold text-earthx-dark">{item.title}</p>
                <p className="mt-2 text-sm text-earthx-muted">{item.summary}</p>
                <p className="mt-4 text-sm font-semibold text-brand-red">Open product page</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
