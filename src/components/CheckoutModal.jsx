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
  RefreshCw,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { PRODUCTS } from '../data/products'
import { supabase } from '../lib/supabaseClient'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true })
      existingScript.addEventListener('error', () => resolve(false), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function resolveProduct(item) {
  if (!item) return PRODUCTS[0]
  if (item.id) return PRODUCTS.find((p) => p.id === item.id) || item
  if (item.eventSlug) return PRODUCTS.find((p) => p.eventSlug === item.eventSlug) || item
  return PRODUCTS[0]
}

export default function CheckoutModal({
  isOpen,
  onClose,
  initialProduct = null,
  cartItems = null,
  onOrderSuccess = null,
}) {
  const isCartMode = Boolean(cartItems && cartItems.length > 0)
  const [selectedProduct, setSelectedProduct] = useState(() => resolveProduct(initialProduct))
  const [quantity, setQuantity] = useState(1)
  const [packSize, setPackSize] = useState(() => (resolveProduct(initialProduct)?.id === 4 ? 12 : 6))

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

  // Steps: 'form' | 'processing' | 'pending_verification' | 'success'
  const [checkoutStep, setCheckoutStep] = useState('form')
  const [orderResult, setOrderResult] = useState(null)
  const [pendingVerification, setPendingVerification] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialProduct) {
      const resolved = resolveProduct(initialProduct)
      setSelectedProduct(resolved)
      if (resolved.id === 4) {
        setPackSize(12)
      }
    }
  }, [initialProduct])

  useEffect(() => {
    if (isOpen) {
      setCheckoutStep('form')
      setOrderResult(null)
      setPendingVerification(null)
      setErrorMessage('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Real-time debounced PIN code lookup
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
            setPincodeState({
              loading: false,
              checked: true,
              serviceable: true,
              message: data.message || 'Serviceable for express delivery!',
              courierName: data.courierName || 'Shiprocket Express',
              estimatedDelivery: data.estimatedDelivery || '3-5 Business Days',
            })
          } else {
            setPincodeState({
              loading: false,
              checked: true,
              serviceable: false,
              message: data.message || 'Delivery currently unavailable for this PIN code.',
              courierName: '',
              estimatedDelivery: '',
            })
          }
        }
      } catch (err) {
        if (isMounted) {
          setPincodeState({
            loading: false,
            checked: true,
            serviceable: true,
            message: 'PIN code serviceable for standard shipping.',
            courierName: 'Shiprocket Logistics',
            estimatedDelivery: '3 - 5 Days',
          })
        }
      }
    }, 400)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [customerDetails.pincode])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCustomerDetails((prev) => ({ ...prev, [name]: value }))
  }

  // Authoritative display price calculation (matches server catalog strictly)
  let subtotal = 0
  if (isCartMode) {
    subtotal = cartItems.reduce((acc, item) => {
      const isMixed12 = Number(item.productId || item.id) === 4 && Number(item.packSize) === 12
      const unitTotal = isMixed12 ? 735 : (item.price || 68) * Number(item.packSize)
      return acc + unitTotal * Number(item.quantity)
    }, 0)
  } else if (selectedProduct?.id === 4 && packSize === 12) {
    subtotal = 735 * quantity // Special price for 12-bar Mixed Box
  } else {
    const unitPrice = selectedProduct?.price || 68
    subtotal = unitPrice * packSize * quantity
  }
  const shippingFee = subtotal >= 499 ? 0 : 49
  const grandTotal = subtotal + shippingFee

  // Re-verify payment if previous verification timed out
  const handleRetryVerification = async () => {
    if (!pendingVerification) return
    setIsSubmitting(true)
    setErrorMessage('')
    setCheckoutStep('processing')

    await executeVerification(pendingVerification)
  }

  const executeVerification = async (verifyPayload) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // 20s timeout

    try {
      const verifyRes = await fetch('/api/checkout/verify-and-ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyPayload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const verifyData = await verifyRes.json()

      if (verifyData.success) {
        setOrderResult(verifyData)
        setCheckoutStep('success')
        if (typeof onOrderSuccess === 'function') {
          onOrderSuccess()
        }
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      } else {
        setErrorMessage(verifyData.message || 'Payment verification failed. Please contact support.')
        setCheckoutStep('form')
      }
    } catch (err) {
      clearTimeout(timeoutId)
      console.warn('[Checkout Verification Timeout / Network Failure]:', err)
      // Transition to pending verification state with safe retry button
      setPendingVerification(verifyPayload)
      setCheckoutStep('pending_verification')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInitiatePayment = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    // 1. Validation
    if (!customerDetails.name.trim() || customerDetails.name.trim().length < 2) {
      setErrorMessage('Please enter your full name.')
      return
    }

    if (!customerDetails.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email.trim())) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    const cleanPhone = customerDetails.phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.')
      return
    }

    if (!customerDetails.address.trim() || customerDetails.address.trim().length < 5) {
      setErrorMessage('Please enter your complete flat/street address.')
      return
    }

    if (!customerDetails.city.trim() || !customerDetails.state.trim()) {
      setErrorMessage('Please enter your City and State.')
      return
    }

    if (customerDetails.pincode.trim().length !== 6 || !/^\d{6}$/.test(customerDetails.pincode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.')
      return
    }

    if (pincodeState.checked && !pincodeState.serviceable) {
      setErrorMessage('The delivery PIN code entered is currently not serviceable for shipping.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      // 2. Request backend to create Razorpay Order (attaching authenticated user ID if logged in)
      const { data: authData } = supabase ? await supabase.auth.getSession() : { data: {} }
      const accessToken = authData?.session?.access_token || null

      const requestHeaders = { 'Content-Type': 'application/json' }
      if (accessToken) {
        requestHeaders['Authorization'] = `Bearer ${accessToken}`
      }

      const orderPayload = isCartMode
        ? {
            items: cartItems.map((item) => ({
              productId: Number(item.productId || item.id),
              packSize: Number(item.packSize),
              quantity: Number(item.quantity),
            })),
            customerDetails: {
              name: customerDetails.name.trim(),
              email: customerDetails.email.trim(),
              phone: cleanPhone,
              address: customerDetails.address.trim(),
              city: customerDetails.city.trim(),
              state: customerDetails.state.trim(),
              pincode: customerDetails.pincode.trim(),
            },
          }
        : {
            productId: selectedProduct.id,
            packSize,
            quantity,
            customerDetails: {
              name: customerDetails.name.trim(),
              email: customerDetails.email.trim(),
              phone: cleanPhone,
              address: customerDetails.address.trim(),
              city: customerDetails.city.trim(),
              state: customerDetails.state.trim(),
              pincode: customerDetails.pincode.trim(),
            },
          }

      const createRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(orderPayload),
      })

      const createData = await createRes.json()

      if (!createData.success) {
        throw new Error(createData.message || 'Could not initiate order. Please try again.')
      }

      const { orderId, orderNumber, razorpayOrderId, amount, currency, keyId } = createData

      // 3. Ensure Razorpay Checkout SDK is ready
      const sdkReady = await loadRazorpayScript()
      if (!sdkReady || !window.Razorpay) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.')
      }

      // 4. Configure Razorpay modal
      const options = {
        key: keyId || 'rzp_test_placeholder',
        amount,
        currency: currency || 'INR',
        name: 'Voltt Protein Co.',
        description: isCartMode
          ? `${cartItems.length} Cart Item${cartItems.length > 1 ? 's' : ''}`
          : `${selectedProduct.title} (Pack of ${packSize} × ${quantity})`,
        image: '/assets/volt-logo-light.png',
        order_id: razorpayOrderId,
        prefill: {
          name: customerDetails.name.trim(),
          email: customerDetails.email.trim(),
          contact: cleanPhone,
        },
        theme: {
          color: '#2A1646',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false)
            setErrorMessage('Payment was cancelled or closed. You can review your details and proceed when ready.')
          },
        },
        handler: async function (response) {
          // Razorpay returned success callback; now verify with backend
          setCheckoutStep('processing')

          const verifyPayload = {
            orderId,
            orderNumber,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            customerDetails: {
              name: customerDetails.name.trim(),
              email: customerDetails.email.trim(),
              phone: cleanPhone,
              address: customerDetails.address.trim(),
              city: customerDetails.city.trim(),
              state: customerDetails.state.trim(),
              pincode: customerDetails.pincode.trim(),
            },
            items: isCartMode
              ? cartItems.map((item) => {
                  const isMixed12 = Number(item.productId || item.id) === 4 && Number(item.packSize) === 12
                  return {
                    id: Number(item.productId || item.id),
                    title: item.title,
                    quantity: Number(item.quantity) * Number(item.packSize),
                    price: isMixed12 ? Math.round(735 / 12) : (item.price || 68),
                  }
                })
              : [
                  {
                    id: selectedProduct.id,
                    title: selectedProduct.title,
                    quantity: quantity * packSize,
                    price: selectedProduct.price || 68,
                  },
                ],
            totalAmount: amount / 100,
          }

          setPendingVerification(verifyPayload)
          await executeVerification(verifyPayload)
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', function (failRes) {
        setIsSubmitting(false)
        const desc = failRes.error?.description || 'Payment was declined. Please try a different card, UPI or NetBanking.'
        setErrorMessage(desc)
      })

      rzp.open()
    } catch (err) {
      console.error('[Checkout Error]:', err)
      setErrorMessage(err.message || 'Something went wrong while initiating checkout.')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  /* ─── Brand Tokens ─── */
  const navy = '#2A1646'
  const coral = '#F95738'
  const cream = '#F5F2EB'
  const creamCard = '#FAF8F3'
  const border = '#E6DFD3'
  const gold = '#D9A441'
  const green = '#5D8C4A'
  const muted = '#71717A'

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
                alt="Voltt Logo"
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
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Modal Body ── */}
          <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8" style={{ background: cream }}>
            
            {/* Step: Order Form */}
            {checkoutStep === 'form' && (
              <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6">

                  {/* Step 1: Flavour & Pack Size OR Cart Items Review */}
                  <div className="rounded-2xl p-5 space-y-4" style={{ background: '#fff', border: `1px solid ${border}` }}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: navy }}>
                        <Package className="w-4 h-4" style={{ color: gold }} />
                        {isCartMode ? `1. Review Cart Items (${cartItems.length})` : '1. Select Flavour & Pack Size'}
                      </h4>
                      {isCartMode && (
                        <span className="text-[11px] font-medium" style={{ color: muted }}>
                          Manage items in cart drawer
                        </span>
                      )}
                    </div>

                    {isCartMode ? (
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {cartItems.map((item) => {
                          const isMixed12 = Number(item.productId || item.id) === 4 && Number(item.packSize) === 12
                          const itemUnit = isMixed12 ? 735 : (item.price || 68) * item.packSize
                          const itemTotal = itemUnit * item.quantity
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 rounded-xl gap-3"
                              style={{ background: creamCard, border: `1px solid ${border}` }}
                            >
                              <img
                                src={item.image || '/assets/almond-crunch.png'}
                                alt={item.title}
                                className="w-11 h-11 object-contain rounded-lg p-0.5 bg-white border border-[#E6DFD3]"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-display font-bold text-xs truncate" style={{ color: navy }}>
                                  {item.title}
                                </p>
                                <p className="text-[11px]" style={{ color: muted }}>
                                  {isMixed12 ? '12-Pack Mixed Box' : `Pack of ${item.packSize}`} × {item.quantity}
                                </p>
                              </div>
                              <span className="font-mono text-xs font-bold shrink-0" style={{ color: navy }}>
                                ₹{itemTotal}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {PRODUCTS.map((prod) => {
                            const active = selectedProduct.id === prod.id
                            return (
                              <button
                                key={prod.id}
                                type="button"
                                onClick={() => {
                                  setSelectedProduct(prod)
                                  if (prod.id === 4) setPackSize(12)
                                }}
                                className="p-3.5 rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer"
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
                                  {prod.id === 4 ? (
                                    <>₹735 <span className="text-[10px] font-normal" style={{ color: muted }}>/ 12-bar box</span></>
                                  ) : (
                                    <>₹{prod.price} <span className="text-[10px] font-normal" style={{ color: muted }}>/ bar</span></>
                                  )}
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
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
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
                              <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center transition-colors hover:bg-white cursor-pointer"
                                style={{ border: `1px solid ${border}`, background: creamCard, color: navy }}
                              >
                                −
                              </button>
                              <span className="font-mono text-sm font-bold px-2" style={{ color: navy }}>{quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                                className="w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center transition-colors hover:bg-white cursor-pointer"
                                style={{ border: `1px solid ${border}`, background: creamCard, color: navy }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Step 2: Delivery Address */}
                  <div className="rounded-2xl p-5 space-y-4" style={{ background: '#fff', border: `1px solid ${border}` }}>
                    <h4 className="font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: navy }}>
                      <Truck className="w-4 h-4" style={{ color: gold }} />
                      2. Delivery Address
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { label: 'Full Name *', name: 'name', placeholder: 'Arjun Sharma', type: 'text', span: false },
                        { label: 'Mobile Phone *', name: 'phone', placeholder: '9876543210', type: 'tel', span: false },
                        { label: 'Email Address *', name: 'email', placeholder: 'arjun@example.com', type: 'email', span: true },
                        { label: 'Flat / Street / Landmark *', name: 'address', placeholder: 'Flat 402, Green Valley Apartments, MG Road', type: 'text', span: true },
                        { label: 'City *', name: 'city', placeholder: 'Mumbai / Bengaluru / Pune', type: 'text', span: false },
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
                            style={{ background: cream, border: `1px solid ${border}`, color: navy }}
                            onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = navy; e.target.style.boxShadow = `0 0 0 3px ${navy}12` }}
                            onBlur={(e) => { e.target.style.background = cream; e.target.style.borderColor = border; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                      ))}

                      {/* PIN Code */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                          Delivery PIN Code *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="pincode"
                            required
                            maxLength={6}
                            placeholder="6 Digit PIN Code (e.g. 110001)"
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
                          <div
                            className="mt-2.5 p-3 rounded-xl border text-xs flex items-center justify-between"
                            style={
                              pincodeState.serviceable
                                ? { background: `${green}12`, border: `1px solid ${green}30`, color: '#2D5A1E' }
                                : { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }
                            }
                          >
                            <div className="flex items-center gap-2">
                              {pincodeState.serviceable ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: green }} />
                              ) : (
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                              )}
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

                    {/* Product Preview */}
                    {isCartMode ? (
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {cartItems.map((item) => {
                          const isMixed12 = Number(item.productId || item.id) === 4 && Number(item.packSize) === 12
                          const itemUnit = isMixed12 ? 735 : (item.price || 68) * item.packSize
                          const itemTotal = itemUnit * item.quantity
                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              <img
                                src={item.image || '/assets/almond-crunch.png'}
                                alt={item.title}
                                className="w-11 h-11 object-contain p-1 rounded-xl shrink-0"
                                style={{ border: `1px solid ${border}`, background: cream }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-display font-bold text-xs truncate" style={{ color: navy }}>{item.title}</p>
                                <p className="text-[11px]" style={{ color: muted }}>
                                  {isMixed12 ? '12-Pack Mixed Box' : `Pack of ${item.packSize}`} × {item.quantity}
                                </p>
                              </div>
                              <p className="font-mono font-bold text-xs" style={{ color: navy }}>₹{itemTotal}</p>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.title}
                          className="w-14 h-14 object-contain p-1 rounded-xl"
                          style={{ border: `1px solid ${border}`, background: cream }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-sm truncate" style={{ color: navy }}>{selectedProduct.title}</p>
                          <p className="text-xs" style={{ color: muted }}>Pack of {packSize} × {quantity}</p>
                        </div>
                        <p className="font-mono font-bold text-sm" style={{ color: navy }}>₹{subtotal}</p>
                      </div>
                    )}

                    {/* Price Breakdown */}
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

                    {/* Error Display */}
                    {errorMessage && (
                      <div className="p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full py-4 px-5 rounded-2xl flex items-center justify-between transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.985] hover:scale-[1.01] cursor-pointer"
                      style={{ background: navy, color: '#fff', boxShadow: `0 8px 24px ${navy}35` }}
                    >
                      {isSubmitting ? (
                        <div className="w-full flex items-center justify-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" style={{ color: gold }} />
                          <span className="font-display font-extrabold text-sm tracking-wide">Initiating Payment...</span>
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

                    {/* Trust Badges */}
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

            {/* Step: Processing Payment Signature & Shipment */}
            {checkoutStep === 'processing' && (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: navy }} />
                <h3 className="font-display font-extrabold text-2xl" style={{ color: navy }}>
                  Verifying Payment &amp; Booking Shipment...
                </h3>
                <p className="text-sm max-w-md mx-auto" style={{ color: muted }}>
                  Please hold tight while our backend confirms your transaction with Razorpay and generates your Shiprocket logistics record.
                </p>
              </div>
            )}

            {/* Step: Pending Verification (Timeout / Network Interruption Recovery) */}
            {checkoutStep === 'pending_verification' && (
              <div className="py-12 text-center max-w-lg mx-auto space-y-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                  <AlertCircle className="w-8 h-8" style={{ color: gold }} />
                </div>

                <div>
                  <h3 className="font-display font-black text-2xl" style={{ color: navy }}>
                    Verification Check In Progress
                  </h3>
                  <p className="text-sm mt-2" style={{ color: muted }}>
                    Your payment was received, but our server confirmation check took longer than usual. Your funds and order reference are safe.
                  </p>
                </div>

                {pendingVerification?.razorpayPaymentId && (
                  <div className="p-4 rounded-xl text-xs text-left bg-white border border-[#E6DFD3] space-y-1.5 font-mono">
                    <p className="text-gray-500">Razorpay Payment ID: <span className="font-bold text-gray-800">{pendingVerification.razorpayPaymentId}</span></p>
                    <p className="text-gray-500">Order Reference: <span className="font-bold text-gray-800">{pendingVerification.orderNumber}</span></p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetryVerification}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: navy }}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>Check Verification Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white border border-[#E6DFD3] cursor-pointer"
                    style={{ color: navy }}
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}

            {/* Step: Order Confirmed & Booked */}
            {checkoutStep === 'success' && orderResult && (
              <div className="py-8 text-center max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: `${green}15`, border: `1px solid ${green}30` }}>
                  <CheckCircle2 className="w-10 h-10" style={{ color: green }} />
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${green}15`, color: green, border: `1px solid ${green}20` }}>
                    Order Confirmed &amp; Paid
                  </span>
                  <h3 className="font-display font-black text-3xl mt-3" style={{ color: navy }}>
                    Thank You For Your Order!
                  </h3>
                  <p className="text-sm mt-2" style={{ color: muted }}>
                    Your payment was verified and your order is securely recorded.
                  </p>
                </div>

                <div className="rounded-2xl p-6 text-left space-y-3 text-xs" style={{ background: '#fff', border: `1px solid ${border}` }}>
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: border }}>
                    <span style={{ color: muted }}>Order Number:</span>
                    <span className="font-mono font-bold text-sm" style={{ color: navy }}>{orderResult.orderNumber}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span style={{ color: muted }}>{isCartMode ? 'Items Ordered:' : 'Item Ordered:'}</span>
                    <span className="font-semibold text-right max-w-[65%] truncate" style={{ color: navy }}>
                      {isCartMode
                        ? `${cartItems.length} items (${cartItems.map((i) => i.title).join(', ')})`
                        : `${selectedProduct.title} (Pack of ${packSize} × ${quantity})`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span style={{ color: muted }}>Total Paid:</span>
                    <span className="font-mono font-bold" style={{ color: navy }}>₹{grandTotal}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span style={{ color: muted }}>Payment Reference:</span>
                    <span className="font-mono font-semibold" style={{ color: navy }}>{orderResult.razorpayPaymentId}</span>
                  </div>

                  {orderResult.shipment?.shipmentId && (
                    <div className="flex items-center justify-between">
                      <span style={{ color: muted }}>Shipment ID:</span>
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
                    <span style={{ color: muted }}>Delivery Address:</span>
                    <span className="font-medium text-right max-w-[65%] truncate" style={{ color: navy }}>
                      {customerDetails.name}, {customerDetails.address}, {customerDetails.city} - {customerDetails.pincode}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {orderResult.shipment?.trackingUrl && (
                    <a
                      href={orderResult.shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      style={{ background: navy }}
                    >
                      <Truck className="w-4 h-4" style={{ color: gold }} />
                      Track on Shiprocket
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                    style={{ border: `1px solid ${border}`, background: '#fff', color: navy }}
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
