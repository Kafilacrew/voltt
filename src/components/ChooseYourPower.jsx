import { useState } from 'react'
import { useCart } from '../App'

export default function ChooseYourPower() {
  const { addToCart, showToast, openNutrition } = useCart()
  const [openPacks, setOpenPacks] = useState({})

  const cards = [
    {
      id: 3,
      title: 'Choco Cranz',
      image: '/assets/choco-cranz.jpg',
      soldOut: false,
      preOrder: false,
    },
    {
      id: 1,
      title: 'Almond Crunch',
      image: '/assets/almond-crunch.jpg',
      soldOut: true,
      preOrder: true,
    },
    {
      id: 2,
      title: 'Berry Rush',
      image: '/assets/berry-rush.jpg',
      soldOut: true,
      preOrder: true,
    },
    {
      id: 4,
      title: 'All in One',
      image: '/assets/mobile.png',
      soldOut: true,
      preOrder: true,
    },
  ]

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
          {cards.map((card) => {
            const isPreOrder = card.preOrder
            const isSoldOut = card.soldOut && !card.preOrder

            return (
              <article
                key={card.id}
                className="bg-white border border-earthx-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition flex flex-col"
              >
              <div className="relative aspect-[4/5] bg-earthx-bg">
                <img
                  src={card.image}
                  alt={card.title}
                  className={`w-full h-full object-cover ${isSoldOut ? 'opacity-60' : ''}`}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                {isPreOrder && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-earthx-dark">
                      Pre-Order Only
                    </span>
                  </div>
                )}
                {isSoldOut && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-earthx-dark">
                      Sold Out
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  aria-label="View nutritional info"
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center shadow-card hover:bg-brand-red/30 transition"
                  onClick={() =>
                    openNutrition(
                      card.id === 1
                        ? 'almond'
                        : card.id === 2
                          ? 'blueberry'
                          : card.id === 4
                            ? 'mix'
                            : 'cranberry',
                    )
                  }
                >
                  <span className="w-5 h-5 rounded-full bg-white text-brand-red text-xs font-semibold flex items-center justify-center">
                    i
                  </span>
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-semibold text-earthx-dark">{card.title}</h3>
                  {isPreOrder && (
                    <span className="shrink-0 rounded-full bg-brand-red/10 px-2 py-1 text-[11px] font-semibold text-brand-red">
                      Pre-Order
                    </span>
                  )}
                  {isSoldOut && (
                    <span className="shrink-0 rounded-full bg-earthx-border px-2 py-1 text-[11px] font-semibold text-earthx-muted">
                      Sold Out
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-earthx-muted">Rs. 68 per bar</p>

                <div className="mt-4 space-y-2">
                  {[
                    {
                      key: '6',
                      label: 'Pack of 6',
                      price: 388,
                      oldPrice: 408,
                      discount: '5% OFF',
                      qty: 6,
                    },
                    {
                      key: '9',
                      label: 'Pack of 9',
                      price: 566,
                      oldPrice: 612,
                      discount: '7.5% OFF',
                      qty: 9,
                    },
                    {
                      key: '12',
                      label: 'Pack of 12',
                      price: 735,
                      oldPrice: 816,
                      discount: '10% OFF',
                      qty: 12,
                    },
                  ].map((pack) => {
                    const packId = `${card.id}-${pack.key}`
                    const state = openPacks[packId] ?? { open: false, qty: 1 }

                    return (
                      <div key={packId} className="space-y-2">
                        <button
                          type="button"
                          disabled={isSoldOut}
                          className={`w-full flex items-center justify-between rounded-xl border border-earthx-border px-3 py-2 text-left transition ${
                            isSoldOut
                              ? 'cursor-not-allowed opacity-60'
                              : 'hover:border-brand-red/60 hover:bg-earthx-bg'
                          }`}
                          onClick={() =>
                            setOpenPacks((prev) => ({
                              ...prev,
                              [packId]: { open: !state.open, qty: state.qty || 1 },
                            }))
                          }
                        >
                          <div>
                            <p className="text-sm font-medium text-earthx-dark">{pack.label}</p>
                            <div className="flex items-baseline gap-2 text-sm">
                              <span className="font-semibold text-earthx-dark">Rs. {pack.price}</span>
                              {pack.oldPrice && (
                                <span className="text-xs text-earthx-muted line-through">
                                  Rs. {pack.oldPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          {pack.discount && (
                            <span className="text-xs font-semibold text-brand-red bg-brand-red/10 rounded-full px-2 py-1">
                              {pack.discount}
                            </span>
                          )}
                        </button>

                        <div
                          className="ml-2 mr-1"
                          style={{
                            display: 'grid',
                            gridTemplateRows: state.open ? '1fr' : '0fr',
                            opacity: state.open ? 1 : 0,
                            marginTop: state.open ? '8px' : '0px',
                            transition:
                              'grid-template-rows 320ms cubic-bezier(0.4, 0, 0.2, 1), opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), margin-top 320ms cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          <div style={{ overflow: 'hidden' }}>
                            <div className="flex items-center justify-between gap-3 text-sm pb-1">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenPacks((prev) => ({
                                      ...prev,
                                      [packId]: {
                                        open: true,
                                        qty: Math.max(1, (state.qty || 1) - 1),
                                      },
                                    }))
                                  }
                                  className="w-7 h-7 rounded-full border border-earthx-border flex items-center justify-center text-earthx-dark hover:bg-earthx-bg"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-medium text-earthx-dark">
                                  {state.qty || 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenPacks((prev) => ({
                                      ...prev,
                                      [packId]: {
                                        open: true,
                                        qty: (state.qty || 1) + 1,
                                      },
                                    }))
                                  }
                                  className="w-7 h-7 rounded-full border border-earthx-border flex items-center justify-center text-earthx-dark hover:bg-earthx-bg"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                disabled={isSoldOut}
                                className={`h-8 px-3 rounded-xl text-xs font-semibold transition ${
                                  isSoldOut
                                    ? 'bg-earthx-border text-earthx-muted cursor-not-allowed'
                                    : 'bg-brand-red text-white hover:opacity-90'
                                }`}
                                onClick={() => {
                                  addToCart({
                                    id: packId,
                                    name: `${card.title} - ${pack.label}`,
                                    price: pack.price,
                                    qty: state.qty || 1,
                                  })
                                  showToast('Item added to cart successfully.')
                                }}
                              >
                                {isSoldOut
                                  ? 'Sold Out'
                                  : isPreOrder
                                  ? `Pre-Order ${state.qty || 1} pack${(state.qty || 1) > 1 ? 's' : ''}`
                                  : `Add ${state.qty || 1} pack${(state.qty || 1) > 1 ? 's' : ''}`}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
