import { useEffect, useState, createContext, useContext } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ChooseYourPower from './components/ChooseYourPower'
import PremiumNutrition from './components/PremiumNutrition'
import TrustedBy from './components/TrustedBy'
import StockUp from './components/StockUp'
import YourGoalOurFuel from './components/YourGoalOurFuel'
import Cart from './components/Cart'
import FAQ from './components/FAQ'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

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
          <YourGoalOurFuel />
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
                        Per 100g
                      </th>
                      <th className="border-b border-earthx-border/60 px-2 py-1 font-semibold">
                        Per 40g
                      </th>
                      <th className="border-b border-earthx-border/60 px-2 py-1 font-semibold">
                        As per RDA
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
                          <td className="border-t border-earthx-border/40 px-2 py-1">400.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">160.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.00%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Protein (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">25.4</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">20.30%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Carbs (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">46.5</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">18.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">6.20%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">22</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.8</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Added Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.5</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">4.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.40%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fibre (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">12.8</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">12.30%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">16</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">6.4</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">9.50%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Saturated Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">3.4</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">15.50%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            PUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">2.9</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">1.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            MUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">4.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">1.7</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Trans fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0.00%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sodium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">257</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">102.8</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.10%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Magnesium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">129</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">51.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Cholesterol (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                      </>
                    )}
                    {nutritionModal.product === 'cranberry' && (
                      <>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Energy (kcal)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">388.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">155.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">7.80%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Protein (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">25.3</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">20.30%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Carbs (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">48.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">19.4</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">6.50%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">24</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">9.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Added Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.5</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">4.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.40%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fibre (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">12.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">12.10%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">13.7</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.5</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.20%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Saturated Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">7.7</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">3.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">13.90%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            PUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">2.3</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0.9</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            MUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">3.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">1.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Trans fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0.00%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sodium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">259</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">103.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.20%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Magnesium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">129</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">51.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Cholesterol (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                      </>
                    )}
                    {nutritionModal.product === 'blueberry' && (
                      <>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Energy (kcal)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">388.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">155.3</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">7.80%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Protein (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">25.3</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">20.30%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Carbs (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">48.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">19.4</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">6.50%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">24</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">9.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Added Sugar (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">10.5</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">4.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.40%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fibre (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">12.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">12.00%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">13.7</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.5</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">8.20%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Saturated Fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">7.7</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">3.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">13.90%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            PUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">2.3</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0.9</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            MUFA (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">3.1</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">1.2</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Trans fat (g)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0.00%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Sodium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">256</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">102.4</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">5.10%</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Magnesium (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">129</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">51.6</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                        <tr>
                          <td className="border-t border-earthx-border/40 px-2 py-1 text-brand-red">
                            Cholesterol (mg)
                          </td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">0</td>
                          <td className="border-t border-earthx-border/40 px-2 py-1">-</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Floating Chat with Us button (WhatsApp-themed green card) */}
        <button
          type="button"
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-3 rounded-xl bg-[#25D366] text-white px-5 py-3 shadow-card hover:brightness-105 md:bottom-6 md:right-6"
          onClick={() => {
            const phone = '917385974015'
            const message = 'Hi, I would like to chat about Voltt protein bars.'
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
            window.open(url, '_blank')
          }}
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/15">
            <svg
              className="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.77 11.77 0 0 0 12 .75C6.57.75 2.25 5.07 2.25 10.5c0 1.83.48 3.6 1.39 5.17L2 22l6.49-1.6a10.2 10.2 0 0 0 4.01.8h0c5.43 0 9.75-4.32 9.75-9.75 0-2.61-1.02-5.07-2.73-6.97zM12.5 19.5h0c-1.27 0-2.52-.32-3.63-.93l-.26-.14-3.85.95 1.02-3.75-.17-.29A7.74 7.74 0 0 1 4 10.5C4 6.67 7.17 3.5 11 3.5c2.13 0 4.13.83 5.64 2.36A7.93 7.93 0 0 1 19.5 10.5c0 4.33-3.17 7.5-7 7.5zm4.01-5.59c-.22-.11-1.3-.64-1.5-.71-.2-.08-.34-.11-.48.1-.14.2-.55.71-.67.86-.12.14-.25.16-.47.05-.22-.11-.92-.34-1.76-1.09-.65-.58-1.09-1.29-1.22-1.51-.13-.22-.01-.33.1-.44.11-.11.22-.25.33-.38.11-.13.14-.22.22-.36.07-.14.04-.27-.02-.38-.06-.11-.48-1.16-.66-1.59-.17-.42-.35-.36-.48-.37h-.41c-.14 0-.38.05-.58.27-.2.22-.76.74-.76 1.8 0 1.06.78 2.09.89 2.24.11.14 1.54 2.35 3.73 3.29.52.23.92.37 1.23.47.52.17.99.15 1.36.09.41-.06 1.3-.53 1.48-1.05.18-.52.18-.96.13-1.05-.05-.09-.2-.15-.42-.26z" />
            </svg>
          </span>
          <span className="text-sm font-semibold hidden sm:inline">Chat with us</span>
          <span className="text-sm font-semibold sm:hidden">Chat</span>
        </button>
      </div>
    </CartContext.Provider>
  )
}

export default App
