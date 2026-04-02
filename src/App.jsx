import { useEffect, useState, createContext, useContext } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ChooseYourPower from './components/ChooseYourPower'
import PremiumNutrition from './components/PremiumNutrition'
import TrustedBy from './components/TrustedBy'
import StockUp from './components/StockUp'
import Cart from './components/Cart'
import FAQ from './components/FAQ'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import { WHATSAPP_PHONE } from './constants/contact'

const CartContext = createContext(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

function App() {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = window.sessionStorage.getItem('voltt-cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      window.sessionStorage.setItem('voltt-cart', JSON.stringify(cart))
    } catch {
      // ignore
    }
  }, [cart])

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, qty: p.qty + (item.qty ?? 1) }
            : p,
        )
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }]
    })
  }

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item,
        )
        .filter((item) => item.qty > 0)
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const [toast, setToast] = useState({ open: false, message: '' })
  const [nutritionModal, setNutritionModal] = useState({
    open: false,
    product: null,
  })

  const showToast = (message) => {
    setToast({ open: true, message })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartCount,
        showToast,
        openNutrition: (product) => setNutritionModal({ open: true, product }),
      }}
    >
      <div className="min-h-screen bg-white">
        <Nav />
        <main>
          <Hero />
          <ChooseYourPower />
          <PremiumNutrition />
          <TrustedBy />
          <StockUp />
          <Cart />
          <FAQ />
          <Newsletter />
          <Footer />
        </main>

        {toast.open && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/20">
            <div className="mb-6 sm:mb-0 max-w-sm w-full rounded-2xl bg-white shadow-card border border-earthx-border px-4 py-3">
              <p className="text-sm font-medium text-earthx-dark">
                {toast.message || 'Item added to cart successfully.'}
              </p>
              <div className="mt-3 flex justify-end gap-2 text-sm">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-earthx-border text-earthx-dark hover:bg-earthx-bg"
                  onClick={() => setToast({ open: false, message: '' })}
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-brand-red text-white font-semibold hover:opacity-90"
                  onClick={() => {
                    setToast({ open: false, message: '' })
                    const el = document.getElementById('cart')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Go to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {nutritionModal.open && (
          <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 px-4">
            <div className="max-w-2xl w-full rounded-2xl bg-white shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-red/40 bg-brand-red/5">
                <h3 className="font-display font-semibold text-earthx-dark text-sm md:text-base">
                  {nutritionModal.product === 'almond' && 'Almond Crunch – Nutrition'}
                  {nutritionModal.product === 'cranberry' &&
                    'Choco Cranz (Cranberry) – Nutrition'}
                  {nutritionModal.product === 'blueberry' &&
                    'Berry Rush (Blueberry) – Nutrition'}
                </h3>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-earthx-muted hover:bg-earthx-bg"
                  onClick={() => setNutritionModal({ open: false, product: null })}
                >
                  ×
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto bg-white px-4 py-4 text-xs sm:text-sm text-earthx-dark">
                <table className="w-full border border-earthx-border/60 text-left">
                  <thead className="bg-brand-red/5 text-earthx-dark">
                    <tr>
                      <th className="border-b border-earthx-border/60 px-2 py-1 font-semibold">
                        Nutrient
                      </th>
                      <th className="border-b border-earthx-border/60 px-2 py-1 font-semibold">
                        Per 40g
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionModal.product === 'almond' && (
                      <>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Energy (kcal)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">160.1</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Protein (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.1</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Carbs (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">18.6</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.8</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Added Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">4.2</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fibre (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.1</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">6.4</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Saturated Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">3.4</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            PUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">1.2</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            MUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">1.7</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Trans fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sodium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">102.8</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Magnesium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">51.6</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Cholesterol (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                        </tr>
                      </>
                    )}
                    {nutritionModal.product === 'cranberry' && (
                      <>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Energy (kcal)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">155.2</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Protein (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.1</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Carbs (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">19.4</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">9.6</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Added Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">4.2</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fibre (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.5</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Saturated Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">3.1</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            PUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0.9</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            MUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">1.2</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Trans fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sodium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">103.6</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Magnesium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">51.6</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Cholesterol (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                        </tr>
                      </>
                    )}
                    {nutritionModal.product === 'blueberry' && (
                      <>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Energy (kcal)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">155.3</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Protein (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.1</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Carbs (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">19.4</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">9.6</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Added Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">4.2</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fibre (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.5</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Saturated Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">3.1</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            PUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0.9</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            MUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">1.2</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Trans fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sodium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">102.4</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Magnesium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">51.6</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Cholesterol (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Floating WhatsApp button */}
        <button
          type="button"
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-white shadow-card hover:brightness-105 md:bottom-6 md:right-6"
          onClick={() => {
            const message = 'Hi, I would like to chat about Voltt protein bars.'
            const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
            window.open(url, '_blank')
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4c/WhatsApp_Logo_green.svg"
            alt=""
            className="h-6 w-6 rounded-full bg-white"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold hidden sm:inline">Chat with us</span>
          <span className="text-sm font-semibold sm:hidden">Chat</span>
        </button>
      </div>
    </CartContext.Provider>
  )
}

export default App
