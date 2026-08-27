import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  CreditCard,
  ChevronRight,
  Zap,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { PRODUCTS } from '../data/products'
import OrdersStartSoonModal from './OrdersStartSoonModal'

export default function CheckoutModal({ isOpen, onClose, initialProduct }) {
  const [selectedProduct, setSelectedProduct] = useState(
    initialProduct || PRODUCTS[0]
  )
  const [quantity, setQuantity] = useState(1)
  const [packSize, setPackSize] = useState(6)
  const [ordersSoonOpen, setOrdersSoonOpen] = useState(false)

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [pincodeState, setPincodeState] = useState({
    loading: false,
    checked: false,
    serviceable: false,
    message: '',
    courierName: '',
    estimatedDelivery: '',
  })

  const [checkoutStep, setCheckoutStep] = useState('form')
  const [orderResult, setOrderResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialProduct) setSelectedProduct(initialProduct)
  }, [initialProduct])

  useEffect(() => {
    if (isOpen) {
      setCheckoutStep('form')
      setOrderResult(null)
      setErrorMessage('')
    }
  }, [isOpen])

  useEffect(() => {
    const pincode = customerDetails.pincode.trim()

    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeState({ loading: false, checked: false, serviceable: false, message: '', courierName: '', estimatedDelivery: '' })
      return
    }

    let isMounted = true
    setPincodeState((prev) => ({ ...prev, loading: true }))

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/pincode/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pincode }),
        })
        const data = await response.json()

        if (isMounted) {
          if (data.success && data.serviceable) {
            setPincodeState({ loading: false, checked: true, serviceable: true, message: data.message || 'Serviceable for express delivery!', courierName: data.courierName || 'Shiprocket Express', estimatedDelivery: data.estimatedDelivery || '3-5 Business Days' })
          } else {
            setPincodeState({ loading: false, checked: true, serviceable: false, message: data.message || 'Delivery currently unavailable for this pincode.', courierName: '', estimatedDelivery: '' })
          }
        }
      } catch (err) {
        if (isMounted) {
          setPincodeState({ loading: false, checked: true, serviceable: true, message: 'Pincode serviceable for standard shipping', courierName: 'Shiprocket Logistics', estimatedDelivery: '3 - 5 Days' })
        }
      }
    }, 400)

    return () => { isMounted = false; clearTimeout(timer) }
  }, [customerDetails.pincode])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCustomerDetails((prev) => ({ ...prev, [name]: value }))
  }

  const unitPrice = selectedProduct?.price || 150
  const packPrice = unitPrice * packSize
  const subtotal = packPrice * quantity
  const shippingFee = subtotal >= 499 ? 0 : 49
  const grandTotal = subtotal + shippingFee

  const handleInitiatePayment = (e) => {
    e.preventDefault()

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address || !customerDetails.city || !customerDetails.state || !customerDetails.pincode) {
      setErrorMessage('Please fill in all shipping details before proceeding.')
      return
    }

    if (customerDetails.pincode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian Pincode.')
      return
    }

    setErrorMessage('')
    setOrdersSoonOpen(true)
  }

  if (!isOpen) return null

  /* ─── Brand tokens ─── */
  const navy    = '#2A1646'
  const coral   = '#F95738'
  const cream   = '#F5F2EB'
  const creamCard = '#FAF8F3'
  const border  = '#E6DFD3'
  const gold    = '#D9A441'
  const green   = '#5D8C4A'
  const muted   = '#71717A'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl my-auto"
          style={{ border: `1px solid ${border}` }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 text-white" style={{ background: navy }}>
            <div className="flex items-center gap-3">
              <img
                src="/assets/volt-logo-light.png"
                alt="Volt Logo"
                className="h-6 sm:h-7 w-auto object-contain"
              />
              <div className="h-4 w-px bg-white/20" />
              <div>
                <h3 className="font-display font-extrabold text-base tracking-tight text-white">
                  Express Checkout
                </h3>
                <p className="text-[11px] text-white/60 font-medium">
                  Direct Shipping &amp; Order Review
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Modal Body ── */}
          <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8" style={{ background: cream }}>
            {checkoutStep === 'form' && (
              <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6">

                  {/* Step 1: Flavor & Pack Size */}
                  <div className="rounded-2xl p-5 space-y-4" style={{ background: '#fff', border: `1px solid ${border}` }}>
                    <h4 className="font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: navy }}>
                      <Package className="w-4 h-4" style={{ color: gold }} />
                      1. Select Flavor &amp; Pack Size
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PRODUCTS.map((prod) => {
                        const active = selectedProduct.id === prod.id
                        return (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => setSelectedProduct(prod)}
                            className="p-3 rounded-xl text-left transition-all flex flex-col justify-between"
                            style={{
                              background: active ? `${navy}08` : creamCard,
                              border: `${active ? '2px' : '1px'} solid ${active ? navy : border}`,
                              boxShadow: active ? `0 0 0 3px ${navy}15` : 'none',
                            }}
                          >
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: gold }}>
                                {prod.eyebrow}
                              </span>
                              <p className="font-display font-bold text-xs mt-0.5" style={{ color: navy }}>
                                {prod.title}
                              </p>
                            </div>
                            <p className="text-xs font-mono font-bold mt-2" style={{ color: navy }}>
                              ₹{prod.price} <span className="text-[10px] font-normal" style={{ color: muted }}>/bar</span>
                            </p>
                          </button>
                        )
                      })}
                    </div>

                    {/* Pack + Quantity */}
                    <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: border }}>
                      <div>
                        <span className="text-xs font-semibold" style={{ color: navy }}>Pack Configuration:</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          {[6, 12, 24].map((size) => {
                            const active = packSize === size
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setPackSize(size)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                style={{
                                  background: active ? navy : '#fff',
                                  color: active ? '#fff' : navy,
                                  border: `1px solid ${active ? navy : border}`,
                                }}
                              >
                                Pack of {size}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold" style={{ color: navy }}>Quantity:</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center transition-colors hover:bg-white"
                            style={{ border: `1px solid ${border}`, background: creamCard, color: navy }}>
                            −
                          </button>
                          <span className="font-mono text-sm font-bold px-2" style={{ color: navy }}>{quantity}</span>
                          <button type="button" onClick={() => setQuantity((q) => q + 1)}
                            className="w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center transition-colors hover:bg-white"
                            style={{ border: `1px solid ${border}`, background: creamCard, color: navy }}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Delivery Address */}
                  <div className="rounded-2xl p-5 space-y-4" style={{ background: '#fff', border: `1px solid ${border}` }}>
                    <h4 className="font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: navy }}>
                      <Truck className="w-4 h-4" style={{ color: gold }} />
                      2. Delivery Address
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

                      {[
                        { label: 'Full Name *', name: 'name', placeholder: 'John Doe', type: 'text', span: false },
                        { label: 'Mobile Phone *', name: 'phone', placeholder: '9876543210', type: 'tel', span: false },
                        { label: 'Email Address *', name: 'email', placeholder: 'john@example.com', type: 'email', span: true },
                        { label: 'Flat / Street / Landmark Address *', name: 'address', placeholder: 'House No, Street, Flat Name, Landmark', type: 'text', span: true },
                        { label: 'City *', name: 'city', placeholder: 'Mumbai / Delhi / Bengaluru', type: 'text', span: false },
                        { label: 'State *', name: 'state', placeholder: 'Maharashtra / Karnataka', type: 'text', span: false },
                      ].map((field) => (
                        <div key={field.name} className={field.span ? 'sm:col-span-2' : ''}>
                          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            required
                            placeholder={field.placeholder}
                            value={customerDetails[field.name]}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2.5 rounded-xl outline-none transition-all text-sm"
                            style={{
                              background: cream,
                              border: `1px solid ${border}`,
                              color: navy,
                            }}
                            onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = navy; e.target.style.boxShadow = `0 0 0 3px ${navy}12` }}
                            onBlur={(e) => { e.target.style.background = cream; e.target.style.borderColor = border; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                      ))}

                      {/* Pincode */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                          Delivery Pincode *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="pincode"
                            required
                            maxLength={6}
                            placeholder="6 Digit Indian Pincode (e.g. 110001)"
                            value={customerDetails.pincode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2.5 pr-10 rounded-xl outline-none font-mono text-sm transition-all"
                            style={{ background: cream, border: `1px solid ${border}`, color: navy }}
                            onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = navy; e.target.style.boxShadow = `0 0 0 3px ${navy}12` }}
                            onBlur={(e) => { e.target.style.background = cream; e.target.style.borderColor = border; e.target.style.boxShadow = 'none' }}
                          />
                          {pincodeState.loading && (
                            <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3" style={{ color: navy }} />
                          )}
                        </div>

                        {pincodeState.checked && (
                          <div className={`mt-2.5 p-3 rounded-xl border text-xs flex items-center justify-between`}
                            style={pincodeState.serviceable
                              ? { background: `${green}12`, border: `1px solid ${green}30`, color: '#2D5A1E' }
                              : { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }
                            }>
                            <div className="flex items-center gap-2">
                              {pincodeState.serviceable
                                ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: green }} />
                                : <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                              }
                              <span>{pincodeState.message}</span>
                            </div>
                            {pincodeState.serviceable && pincodeState.estimatedDelivery && (
                              <span className="font-bold text-[11px] bg-white px-2 py-0.5 rounded shadow-xs" style={{ border: `1px solid ${green}20` }}>
                                {pincodeState.estimatedDelivery}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl p-6 space-y-5 sticky top-4" style={{ background: '#fff', border: `1px solid ${border}` }}>
                    <h4 className="font-display text-sm font-bold uppercase tracking-wider pb-3 border-b" style={{ color: coral, borderColor: border }}>
                      ORDER SUMMARY
                    </h4>

                    {/* Product item */}
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        className="w-14 h-14 object-cover rounded-xl"
                        style={{ border: `1px solid ${border}`, background: cream }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm truncate" style={{ color: navy }}>{selectedProduct.title}</p>
                        <p className="text-xs" style={{ color: muted }}>Pack of {packSize} × {quantity}</p>
                      </div>
                      <p className="font-mono font-bold text-sm" style={{ color: navy }}>₹{subtotal}</p>
                    </div>

                    {/* Price breakdown */}
                    <div className="space-y-2 pt-4 border-t text-xs" style={{ borderColor: border }}>
                      <div className="flex items-center justify-between" style={{ color: muted }}>
                        <span>Subtotal</span>
                        <span className="font-mono font-medium" style={{ color: navy }}>₹{subtotal}</span>
                      </div>

                      <div className="flex items-center justify-between" style={{ color: muted }}>
                        <span className="flex items-center gap-1.5">
                          Shiprocket Logistics
                          {shippingFee === 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${green}15`, color: green }}>
                              FREE
                            </span>
                          )}
                        </span>
                        <span className="font-mono font-medium" style={{ color: navy }}>
                          {shippingFee === 0 ? '₹0' : `₹${shippingFee}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t font-bold" style={{ borderColor: border }}>
                        <span className="text-sm" style={{ color: navy }}>Total Payable</span>
                        <span className="font-mono text-xl" style={{ color: navy }}>₹{grandTotal}</span>
                      </div>
                    </div>

                    {/* Error */}
                    {errorMessage && (
                      <div className="p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Pay button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full py-4 px-5 rounded-2xl flex items-center justify-between transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.985] hover:scale-[1.01]"
                      style={{ background: navy, color: '#fff', boxShadow: `0 8px 24px ${navy}35` }}
                    >
                      {isSubmitting ? (
                        <div className="w-full flex items-center justify-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" style={{ color: gold }} />
                          <span className="font-display font-extrabold text-sm tracking-wide">Initiating Razorpay...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <CreditCard className="w-4 h-4" style={{ color: gold }} />
                          </div>
                          <span className="flex-1 text-center font-display font-black text-sm tracking-tight uppercase">
                            PLACE ORDER — ₹{grandTotal}
                          </span>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <ChevronRight className="w-4 h-4 text-white/80" />
                          </div>
                        </>
                      )}
                    </button>

                    {/* Trust badges */}
                    <div className="pt-1 text-center text-[11px] space-y-1">
                      <div className="flex items-center justify-center gap-2 font-semibold" style={{ color: green }}>
                        <ShieldCheck className="w-4 h-4" />
                        <span>256-Bit SSL Encrypted &amp; Shiprocket Verified</span>
                      </div>
                      <p style={{ color: muted }}>Fulfillment &amp; Real-time Tracking via Shiprocket Logistics</p>
                    </div>
                  </div>
                </div>

              </form>
            )}

            {/* Processing */}
            {checkoutStep === 'processing' && (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: navy }} />
                <h3 className="font-display font-extrabold text-2xl" style={{ color: navy }}>
                  Verifying Payment &amp; Booking Shipment...
                </h3>
                <p className="text-sm max-w-md mx-auto" style={{ color: muted }}>
                  Please hold tight while we confirm your signature and generate your Shiprocket shipping AWB tracking code.
                </p>
              </div>
            )}

            {/* Success */}
            {checkoutStep === 'success' && orderResult && (
              <div className="py-8 text-center max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: `${green}15`, border: `1px solid ${green}30` }}>
                  <CheckCircle2 className="w-10 h-10" style={{ color: green }} />
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${green}15`, color: green, border: `1px solid ${green}20` }}>
                    Order Confirmed &amp; Booked
                  </span>
                  <h3 className="font-display font-black text-3xl mt-3" style={{ color: navy }}>
                    Thank You For Your Order!
                  </h3>
                  <p className="text-sm mt-2" style={{ color: muted }}>
                    Your payment was successfully processed and your package is being prepped for shipment.
                  </p>
                </div>

                <div className="rounded-2xl p-6 text-left space-y-3 text-xs" style={{ background: '#fff', border: `1px solid ${border}` }}>
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: border }}>
                    <span style={{ color: muted }}>Volt Order Reference:</span>
                    <span className="font-mono font-bold text-sm" style={{ color: navy }}>{orderResult.orderId}</span>
                  </div>
                  {orderResult.shipment?.shipmentId && (
                    <div className="flex items-center justify-between">
                      <span style={{ color: muted }}>Shiprocket Shipment ID:</span>
                      <span className="font-mono font-semibold" style={{ color: navy }}>{orderResult.shipment.shipmentId}</span>
                    </div>
                  )}
                  {orderResult.shipment?.courierName && (
                    <div className="flex items-center justify-between">
                      <span style={{ color: muted }}>Courier Partner:</span>
                      <span className="font-semibold" style={{ color: navy }}>{orderResult.shipment.courierName}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: border }}>
                    <span style={{ color: muted }}>Deliver To:</span>
                    <span className="font-medium text-right" style={{ color: navy }}>{customerDetails.name}, {customerDetails.pincode}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                  {orderResult.shipment?.trackingUrl && (
                    <a
                      href={orderResult.shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md"
                      style={{ background: navy }}
                    >
                      <Truck className="w-4 h-4" style={{ color: gold }} />
                      Track Order on Shiprocket
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider"
                    style={{ border: `1px solid ${border}`, background: '#fff', color: navy }}
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pre-deployment disabled checkout popup */}
          <OrdersStartSoonModal
            isOpen={ordersSoonOpen}
            onClose={() => {
              setOrdersSoonOpen(false)
              onClose()
            }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
