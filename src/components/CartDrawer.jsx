import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react'
import { useAppContext } from '../App'

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    updateCartQuantity,
    updateCartPackSize,
    removeFromCart,
    cartSubtotal,
    cartShippingFee,
    cartGrandTotal,
    cartTotalCount,
    openCheckout,
  } = useAppContext()

  const navy = '#2A1646'
  const coral = '#F95738'
  const border = '#E6DFD3'
  const cream = '#F5F2EB'
  const creamCard = '#FAF8F3'

  const freeShippingThreshold = 499
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal)
  const shippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))

  const handleProceedToCheckout = () => {
    onClose()
    openCheckout() // opens checkout with full cart contents
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-md bg-[#FAF8F3] border-l border-[#E6DFD3] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div
                className="px-6 py-4 border-b border-[#E6DFD3] flex items-center justify-between"
                style={{ background: navy }}
              >
                <div className="flex items-center gap-2.5 text-white">
                  <ShoppingBag className="w-5 h-5 text-[#D9A441]" />
                  <h2 className="font-display font-extrabold text-base tracking-tight uppercase">
                    Your Cart ({cartTotalCount})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-white border-b border-[#E6DFD3] px-6 py-3">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5" style={{ color: navy }}>
                    <Truck className="w-3.5 h-3.5 text-[#F95738]" />
                    {amountToFreeShipping > 0 ? (
                      <span>
                        Add <strong className="text-[#F95738]">₹{amountToFreeShipping}</strong> more for <strong>FREE Express Shipping</strong>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Unlocked FREE Express Shipping across India!
                      </span>
                    )}
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">{shippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${shippingProgress}%`,
                      background: shippingProgress >= 100 ? '#5D8C4A' : coral,
                    }}
                  />
                </div>
              </div>

              {/* Items List / Empty State */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-[#E6DFD3]/40 flex items-center justify-center text-gray-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-lg text-[#2A1646]">
                        Your Voltt Box is Empty
                      </h3>
                      <p className="text-xs text-gray-500 max-w-xs">
                        Fuel your active performance with our clean electrolyte protein bars.
                      </p>
                    </div>
                    <a
                      href="#shop"
                      onClick={onClose}
                      className="px-6 py-3 rounded-full text-white font-display font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity mt-2"
                      style={{ background: coral }}
                    >
                      Explore Flavours
                    </a>
                  </div>
                ) : (
                  cart.map((item) => {
                    const isMixed12 = Number(item.productId) === 4 && Number(item.packSize) === 12
                    const itemUnitTotal = isMixed12 ? 735 : (item.price || 68) * item.packSize
                    const itemLineTotal = itemUnitTotal * item.quantity

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-[#E6DFD3] p-4 flex gap-3.5 shadow-xs relative group"
                      >
                        {/* Image Thumbnail */}
                        <div className="w-20 h-20 rounded-xl bg-[#FAF8F3] border border-[#E6DFD3]/60 flex items-center justify-center shrink-0 p-1.5 overflow-hidden">
                          <img
                            src={item.image || '/assets/almond-crunch.png'}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-display font-bold text-sm text-[#2A1646] truncate">
                                {item.title}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Pack Size Display & Selector */}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              {isMixed12 ? (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-[#2A1646]/5 text-[#2A1646] font-mono text-[10px] font-bold">
                                  12-Pack Mixed Box
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <label htmlFor={`pack-select-${item.id}`} className="text-[10px] font-bold text-gray-400 uppercase">
                                    Pack:
                                  </label>
                                  <select
                                    id={`pack-select-${item.id}`}
                                    value={item.packSize}
                                    onChange={(e) => updateCartPackSize && updateCartPackSize(item.id, Number(e.target.value))}
                                    className="text-[11px] font-bold font-mono bg-[#FAF8F3] border border-[#E6DFD3] rounded-md px-1.5 py-0.5 text-[#2A1646] cursor-pointer focus:outline-none focus:border-[#2A1646]"
                                  >
                                    <option value={6}>Pack of 6 (₹408)</option>
                                    <option value={12}>Pack of 12 (₹816)</option>
                                    <option value={24}>Pack of 24 (₹1,632)</option>
                                  </select>
                                </div>
                              )}
                              <span className="text-[10px] text-gray-500 font-mono">
                                • {item.packSize * item.quantity} bars total
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-[#E6DFD3] rounded-lg bg-[#FAF8F3]">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-mono text-xs font-bold text-[#2A1646]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="font-mono font-black text-sm text-[#2A1646]">
                                ₹{itemLineTotal.toLocaleString('en-IN')}
                              </span>
                              <span className="block text-[10px] text-gray-400 font-mono">
                                ₹{itemUnitTotal}/pack
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer Summary & Checkout CTA */}
              {cart.length > 0 && (
                <div className="bg-white border-t border-[#E6DFD3] p-6 space-y-4 shadow-lg">
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono font-bold text-gray-900">
                        ₹{cartSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        Shipping
                        {cartShippingFee === 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                            FREE
                          </span>
                        )}
                      </span>
                      <span className="font-mono font-bold text-gray-900">
                        {cartShippingFee === 0 ? '₹0' : `₹${cartShippingFee}`}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-[#2A1646]">
                      <span>Estimated Total</span>
                      <span className="font-mono font-black text-base text-[#2A1646]">
                        ₹{cartGrandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-4 rounded-full text-white font-display font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    style={{ background: coral }}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-gray-400">
                    ⚡ Express Shipping &amp; 100% Secure Checkout via Razorpay
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
