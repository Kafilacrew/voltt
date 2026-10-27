import { useEffect, useState, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Zap } from 'lucide-react'
import AnnouncementBar from './components/AnnouncementBar'
import Nav from './components/Nav'
import { DiwaliBanner } from './components/diwali/DiwaliTheme'
import Hero from './components/Hero'
import ChooseYourPower from './components/ChooseYourPower'
import StockUp from './components/StockUp'
import IngredientStory from './components/IngredientStory'
import ProductBookingPage from './components/ProductBookingPage'
import TrustedBy from './components/TrustedBy'
import SocialProof from './components/SocialProof'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import CheckoutModal from './components/CheckoutModal'
import CartDrawer from './components/CartDrawer'
import CartToast from './components/CartToast'
import CustomerAuthModal from './components/CustomerAuthModal'
import AdminDashboard from './components/AdminDashboard'
import { WHATSAPP_PHONE } from './constants/contact'
import { PRODUCTS, getProductBySlug } from './data/products'

const AppContext = createContext(null)
const PRODUCT_ROUTE_PREFIX = '#/product/'
const PRODUCT_REFRESH_KEY = 'voltt:last-refreshed-product-hash'
const CART_STORAGE_KEY = 'voltt_cart_v1'

function loadSavedCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) => item && item.id && item.productId && Number(item.quantity) > 0
    )
  } catch (err) {
    console.warn('[Cart Persistence Error]:', err)
    return []
  }
}

function getProductRouteSlug(hash) {
  if (!hash.startsWith(PRODUCT_ROUTE_PREFIX)) {
    return null
  }

  const slug = decodeURIComponent(hash.slice(PRODUCT_ROUTE_PREFIX.length))
  return slug || null
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppContext.Provider')
  return ctx
}

function App() {
  const [nutritionModal, setNutritionModal] = useState({
    open: false,
    product: null,
  })
  const [cart, setCart] = useState(loadSavedCart)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [checkoutModal, setCheckoutModal] = useState({
    open: false,
    product: null,
    isCartMode: false,
  })
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [selectedFlavorSlug, setSelectedFlavorSlug] = useState('almond-crunch')
  const [currentHash, setCurrentHash] = useState(() => window.location.hash)

  const activeRouteProduct = getProductBySlug(getProductRouteSlug(currentHash))
  const selectedFlavorProduct = getProductBySlug(selectedFlavorSlug) || PRODUCTS[0]

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
      setNutritionModal({ open: false, product: null })
      setCheckoutModal({ open: false, product: null, isCartMode: false })
      setIsCartOpen(false)
      setAuthModalOpen(false)

      const routeSlug = getProductRouteSlug(window.location.hash)
      if (routeSlug) {
        setSelectedFlavorSlug(routeSlug)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    if (activeRouteProduct) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return undefined
    }

    const sectionId = currentHash && !currentHash.startsWith('#/') ? currentHash.slice(1) : ''
    if (!sectionId) {
      return undefined
    }

    const scrollTimeout = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)

    return () => {
      window.clearTimeout(scrollTimeout)
    }
  }, [activeRouteProduct, currentHash])

  useEffect(() => {
    const productHash = currentHash.startsWith(PRODUCT_ROUTE_PREFIX) ? currentHash : null

    if (!productHash) {
      window.sessionStorage.removeItem(PRODUCT_REFRESH_KEY)
      return
    }

    const lastRefreshedHash = window.sessionStorage.getItem(PRODUCT_REFRESH_KEY)
    if (lastRefreshedHash === productHash) {
      return
    }

    window.sessionStorage.setItem(PRODUCT_REFRESH_KEY, productHash)
    window.location.reload()
  }, [currentHash])

  // Persist cart to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (err) {
      console.warn('[Cart Persistence Save Error]:', err)
    }
  }, [cart])

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast.show) return
    const timer = setTimeout(() => {
      setToast({ show: false, message: '' })
    }, 3500)
    return () => clearTimeout(timer)
  }, [toast.show])

  const showToast = (message) => {
    setToast({ show: true, message })
  }

  const dismissToast = () => {
    setToast({ show: false, message: '' })
  }

  const addToCart = (product, packSize = 6, quantity = 1) => {
    if (!product) return
    const resolvedProduct = getProductBySlug(product.eventSlug) || PRODUCTS.find((p) => p.id === product.id) || product
    const size = resolvedProduct.id === 4 ? 12 : Number(packSize) || 6
    const qty = Math.max(1, Number(quantity) || 1)
    const cartItemId = `${resolvedProduct.id}-${size}`

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId)
      if (existingIndex > -1) {
        const nextCart = [...prevCart]
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: Math.min(50, nextCart[existingIndex].quantity + qty),
        }
        return nextCart
      }

      const rawBarPrice = resolvedProduct.id === 4 ? 735 : (resolvedProduct.price || 68)
      const packUnitPrice = resolvedProduct.id === 4 ? 735 : rawBarPrice * size

      const newItem = {
        id: cartItemId,
        productId: resolvedProduct.id,
        flavour: resolvedProduct.title,
        title: resolvedProduct.title,
        image: resolvedProduct.image,
        price: rawBarPrice,
        unitPrice: packUnitPrice,
        packSize: size,
        quantity: qty,
      }
      return [...prevCart, newItem]
    })

    showToast(`${resolvedProduct.title} (${size === 12 && resolvedProduct.id === 4 ? '12-Pack Mixed Box' : `Pack of ${size}`})`)
  }

  const updateCartPackSize = (itemId, newPackSize) => {
    const size = Number(newPackSize)
    if (![6, 12, 24].includes(size)) return

    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.id === itemId)
      if (itemIndex === -1) return prevCart

      const currentItem = prevCart[itemIndex]
      if (Number(currentItem.productId) === 4) return prevCart // Mixed Box is fixed 12 bars

      const targetId = `${currentItem.productId}-${size}`
      const existingTargetIndex = prevCart.findIndex((item) => item.id === targetId)

      if (existingTargetIndex > -1 && existingTargetIndex !== itemIndex) {
        // Merge quantities into the target variant
        const nextCart = prevCart.filter((_, idx) => idx !== itemIndex)
        const targetItem = nextCart.find((item) => item.id === targetId)
        if (targetItem) {
          targetItem.quantity = Math.min(50, targetItem.quantity + currentItem.quantity)
        }
        return nextCart
      }

      // Update pack size of current variant
      return prevCart.map((item, idx) => {
        if (idx !== itemIndex) return item
        const perBarPrice = item.price || 68
        return {
          ...item,
          id: targetId,
          packSize: size,
          unitPrice: perBarPrice * size,
        }
      })
    })
  }

  const updateCartQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.min(50, newQty) } : item
      )
    )
  }

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY)
    } catch (_) {}
  }

  const cartTotalCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0)

  const cartSubtotal = cart.reduce((sum, item) => {
    const isMixed12 = Number(item.productId) === 4 && Number(item.packSize) === 12
    const unitPrice = isMixed12 ? 735 : (item.price || 68) * Number(item.packSize)
    return sum + unitPrice * Number(item.quantity)
  }, 0)

  const cartShippingFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 49
  const cartGrandTotal = cartSubtotal + cartShippingFee

  const openCheckout = (product) => {
    if (product) {
      setCheckoutModal({ open: true, product, isCartMode: false })
    } else {
      setCheckoutModal({ open: true, product: null, isCartMode: true })
    }
  }

  const closeCheckout = () => {
    setCheckoutModal({ open: false, product: null, isCartMode: false })
  }

  const handleOrderSuccess = () => {
    if (checkoutModal.isCartMode) {
      clearCart()
    }
  }

  if (currentHash === '#/admin') {
    return <AdminDashboard />
  }

  return (
    <AppContext.Provider
      value={{
        openNutrition: (product) => setNutritionModal({ open: true, product }),
        openCheckout,
        openAuth: () => setAuthModalOpen(true),
        cart,
        addToCart,
        updateCartQuantity,
        updateCartPackSize,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        cartTotalCount,
        cartSubtotal,
        cartShippingFee,
        cartGrandTotal,
      }}
    >
      <div className="min-h-screen bg-[#F6F3EC] text-[#1F2937] selection:bg-[#123D87] selection:text-white">
        <DiwaliBanner />
        <Nav />
        <AnnouncementBar />
        <main>
          {activeRouteProduct ? (
            <ProductBookingPage product={activeRouteProduct} />
          ) : (
            <>
              <Hero
                selectedProduct={selectedFlavorProduct}
                onSelectFlavor={(slug) => setSelectedFlavorSlug(slug)}
                products={PRODUCTS}
              />
              <ChooseYourPower />
              <StockUp />
              <IngredientStory />
              <TrustedBy />
              <SocialProof />
              <Newsletter />
            </>
          )}
        </main>
        <Footer />

        {/* Brand Aligned Nutrition Modal Dialog */}
        <AnimatePresence>
          {nutritionModal.open && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md px-4"
              onClick={() => setNutritionModal({ open: false, product: null })}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl w-full rounded-3xl bg-white border border-[#E5DFC9] shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5DFC9] bg-[#123D87] text-white">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#D9A441]" />
                    <h3 className="font-display font-bold text-white text-base sm:text-lg">
                      {nutritionModal.product === 'almond' && 'Almond Crunch – Nutritional Breakdown'}
                      {nutritionModal.product === 'cranberry' && 'Choco Cranz – Nutritional Breakdown'}
                      {nutritionModal.product === 'blueberry' && 'Berry Rush – Nutritional Breakdown'}
                      {nutritionModal.product === 'mix' && 'Voltt Range – Nutritional Breakdown'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    onClick={() => setNutritionModal({ open: false, product: null })}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-auto bg-[#F6F3EC] p-6 text-xs sm:text-sm text-[#1F2937]">
                  <table className="w-full border border-[#E5DFC9] text-left rounded-xl overflow-hidden bg-white shadow-sm">
                    <thead className="bg-[#123D87] text-white font-display">
                      <tr>
                        <th className="px-4 py-3 font-bold">Nutrient</th>
                        <th className="px-4 py-3 font-bold">Per 40g Bar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DFC9] font-mono text-xs text-[#1F2937]">
                      {nutritionModal.product === 'almond' && (
                        <>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Energy (kcal)</td>
                            <td className="px-4 py-2.5">160.1</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Protein (g)</td>
                            <td className="px-4 py-2.5 font-bold text-[#5D8C4A]">10.1</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Carbs (g)</td>
                            <td className="px-4 py-2.5">18.6</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Sugar (g)</td>
                            <td className="px-4 py-2.5">8.8</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Fibre (g)</td>
                            <td className="px-4 py-2.5 text-[#5D8C4A] font-bold">5.1</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Sodium (mg)</td>
                            <td className="px-4 py-2.5 text-[#D9A441] font-bold">102.8</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Magnesium (mg)</td>
                            <td className="px-4 py-2.5 text-[#D9A441] font-bold">51.6</td>
                          </tr>
                        </>
                      )}
                      {(nutritionModal.product === 'cranberry' ||
                        nutritionModal.product === 'mix') && (
                        <>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Energy (kcal)</td>
                            <td className="px-4 py-2.5">155.2</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Protein (g)</td>
                            <td className="px-4 py-2.5 font-bold text-[#5D8C4A]">10.1</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Carbs (g)</td>
                            <td className="px-4 py-2.5">19.4</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Sugar (g)</td>
                            <td className="px-4 py-2.5">9.6</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Fibre (g)</td>
                            <td className="px-4 py-2.5 text-[#5D8C4A] font-bold">5.0</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Sodium (mg)</td>
                            <td className="px-4 py-2.5 text-[#D9A441] font-bold">103.6</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Magnesium (mg)</td>
                            <td className="px-4 py-2.5 text-[#D9A441] font-bold">51.6</td>
                          </tr>
                        </>
                      )}
                      {nutritionModal.product === 'blueberry' && (
                        <>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Energy (kcal)</td>
                            <td className="px-4 py-2.5 font-bold">155.3</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Protein (g)</td>
                            <td className="px-4 py-2.5 font-bold text-[#5D8C4A]">10.1</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Carbs (g)</td>
                            <td className="px-4 py-2.5">19.4</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Sugar (g)</td>
                            <td className="px-4 py-2.5">9.6</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Fibre (g)</td>
                            <td className="px-4 py-2.5 text-[#5D8C4A] font-bold">5.0</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Sodium (mg)</td>
                            <td className="px-4 py-2.5 text-[#D9A441] font-bold">102.4</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-[#123D87] font-bold font-sans">Magnesium (mg)</td>
                            <td className="px-4 py-2.5 text-[#D9A441] font-bold">51.6</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* WhatsApp Chat Button */}
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-[#123D87] text-white px-5 py-3.5 shadow-xl border border-[#D9A441]/40 hover:bg-[#0E2954] hover:scale-105 active:scale-95 transition-all duration-200"
          onClick={() => {
            const message = 'Hi, I would like to chat about Voltt protein bars.'
            const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
            window.open(url, '_blank')
          }}
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#D9A441] text-[#123D87]">
            <MessageCircle className="w-4 h-4 fill-[#123D87]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Chat with us</span>
        </button>

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />

        {/* Cart Action Toast Notification */}
        <CartToast
          toast={toast}
          onDismiss={dismissToast}
        />

        {/* Voltt Express Checkout Modal */}
        <CheckoutModal
          isOpen={checkoutModal.open}
          onClose={closeCheckout}
          initialProduct={checkoutModal.product}
          cartItems={checkoutModal.isCartMode ? cart : null}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* Customer Account & Authentication Modal */}
        <CustomerAuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    </AppContext.Provider>
  )
}

export default App
