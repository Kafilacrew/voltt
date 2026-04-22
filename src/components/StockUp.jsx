import BookingWidgetButton from './BookingWidgetButton'

const packs = [
  { id: 'stockup-6', label: 'Pack of 6', price: 388, soldOut: false },
  { id: 'stockup-9', label: 'Pack of 9', price: 566, soldOut: false },
  { id: 'stockup-12', label: 'Pack of 12', price: 735, soldOut: false },
]

export default function StockUp() {
  return (
    <section id="stock-up" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-earthx-dark text-center">
          Stock Up
        </h2>
        <p className="text-earthx-muted text-center mt-4 max-w-xl mx-auto">
          Simple pack pricing with direct booking.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-3xl px-6 py-8 flex flex-col border border-earthx-border shadow-card text-center"
            >
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-earthx-dark">{pack.label}</h3>
                <div className="mt-5">
                  <p className="font-display font-extrabold text-3xl text-earthx-dark">
                    Rs. {pack.price}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {pack.soldOut ? (
                  <button
                    type="button"
                    disabled
                    className="w-full h-12 rounded-xl bg-earthx-border text-earthx-muted font-semibold cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <div className="flex justify-center">
                    <BookingWidgetButton
                      containerId={`book-container-${pack.id}`}
                      buttonLabel="Buy Now"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
