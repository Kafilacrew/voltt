import { useAppContext } from '../App'
import { PRODUCTS } from '../data/products'
import BookingWidgetButton from './BookingWidgetButton'

export default function ChooseYourPower() {
  const { openNutrition } = useAppContext()

  return (
    <section id="shop" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center">
          Choose Your Power
        </h2>
        <p className="text-earthx-muted text-center mt-4 max-w-lg mx-auto">
          Handcrafted protein bars designed to fuel your ambitions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-7xl mx-auto">
          {PRODUCTS.map((card) => (
            <article
              key={card.id}
              className="bg-white border border-earthx-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-earthx-bg">
                <img
                  src={card.image}
                  alt={card.title}
                  className={`w-full h-full object-cover ${card.soldOut ? 'opacity-60' : ''}`}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                {card.soldOut && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-earthx-dark">
                      Out of Stock
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  aria-label="View nutritional info"
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center shadow-card hover:bg-brand-red/30 transition"
                  onClick={() => openNutrition(card.nutritionKey)}
                >
                  <span className="w-5 h-5 rounded-full bg-white text-brand-red text-xs font-semibold flex items-center justify-center">
                    i
                  </span>
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-semibold text-earthx-dark">{card.title}</h3>
                  {card.soldOut && (
                    <span className="shrink-0 rounded-full bg-earthx-border px-2 py-1 text-[11px] font-semibold text-earthx-muted">
                      Out of Stock
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-earthx-muted">Rs. {card.price} per bar</p>

                <div className="mt-6">
                  {card.soldOut ? (
                    <button
                      type="button"
                      disabled
                      className="w-full h-11 rounded-xl bg-earthx-border text-earthx-muted text-sm font-semibold cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <div className="flex justify-center">
                      <BookingWidgetButton
                        containerId={`book-container-product-${card.id}`}
                        eventSlug={card.eventSlug}
                        buttonLabel="Buy Now"
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
