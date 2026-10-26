import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { checkPincodeServiceability } from './services/shiprocket.js'
import { calculateOrderPricing, calculateCartPricing } from './services/catalog.js'
import { createRazorpayOrder, verifyRazorpaySignature, fetchRazorpayPayment, verifyRazorpayWebhookSignature } from './services/razorpay.js'
import { getSupabaseAdmin, verifyAdminToken } from './lib/supabaseAdmin.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
)

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Voltt Checkout Backend Server (Razorpay + Shiprocket + Supabase)',
    timestamp: new Date().toISOString(),
  })
})

// 2. Check Pincode Serviceability with Shiprocket
app.post('/api/pincode/check', async (req, res) => {
  try {
    const { pincode } = req.body || {}

    if (!pincode || typeof pincode !== 'string' || !/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({ success: false, message: 'Valid 6-digit Indian PIN code is required.' })
    }

    const result = await checkPincodeServiceability({ deliveryPincode: pincode.trim() })
    return res.json(result)
  } catch (error) {
    console.error('[API /api/pincode/check Error]:', error)
    return res.status(500).json({ success: false, message: 'Failed to verify pincode serviceability.' })
  }
})

// 3. Create Razorpay Payment Order with Trusted Server-Side Pricing & Supabase Persistence
app.post('/api/checkout/create-order', async (req, res) => {
  try {
    const {
      items = null,
      productId,
      packSize = 6,
      quantity = 1,
      customerDetails = {},
      userId = null,
    } = req.body || {}

    const { name, email, phone, address, city, state, pincode } = customerDetails

    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'All customer shipping details are required.' })
    }

    // Trusted Pricing Calculation
    let pricing
    try {
      if (Array.isArray(items) && items.length > 0) {
        pricing = calculateCartPricing(items)
      } else {
        pricing = calculateCartPricing([{ productId, packSize, quantity }])
      }
    } catch (calcError) {
      return res.status(400).json({ success: false, message: calcError.message })
    }

    const {
      subtotalInPaise,
      shippingFeeInPaise,
      grandTotalInPaise,
      items: processedItems,
    } = pricing

    const orderNumber = `VOLTT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
    const supabase = getSupabaseAdmin()
    let internalOrderId = null
    let verifiedUserId = null

    if (supabase) {
      const authHeader = req.headers?.authorization || req.headers?.Authorization
      if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace(/^Bearer\s+/i, '').trim()
        if (token) {
          try {
            const { data: { user } } = await supabase.auth.getUser(token)
            if (user) verifiedUserId = user.id
          } catch (e) {
            // guest order fallback
          }
        }
      }
    }

    if (supabase) {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: verifiedUserId,
          customer_name: name.trim(),
          customer_email: email.trim().toLowerCase(),
          customer_phone: phone.toString().replace(/\D/g, ''),
          shipping_address: address.trim(),
          shipping_city: city.trim(),
          shipping_state: state.trim(),
          shipping_pincode: pincode.toString().trim(),
          subtotal_in_paise: subtotalInPaise,
          shipping_fee_in_paise: shippingFeeInPaise,
          grand_total_in_paise: grandTotalInPaise,
          payment_status: 'PENDING',
          fulfillment_status: 'UNFULFILLED',
        })
        .select('id')
        .single()

      if (orderError) {
        console.error('[Supabase Order Error]:', orderError)
      } else {
        internalOrderId = orderData.id

        const orderItemsToInsert = processedItems.map((pi) => ({
          order_id: internalOrderId,
          product_id: pi.product.id,
          product_title: pi.product.title,
          pack_size: pi.packSize,
          quantity: pi.quantity,
          unit_price_in_paise: pi.unitPriceInPaise,
          total_price_in_paise: pi.subtotalInPaise,
        }))

        await supabase.from('order_items').insert(orderItemsToInsert)
      }
    }

    const razorpayOrder = await createRazorpayOrder({
      amountInPaise: grandTotalInPaise,
      currency: 'INR',
      receipt: orderNumber,
    })

    if (supabase && internalOrderId) {
      await supabase.from('payments').insert({
        order_id: internalOrderId,
        razorpay_order_id: razorpayOrder.id,
        payment_status: 'INITIATED',
        amount_in_paise: grandTotalInPaise,
        currency: 'INR',
      })
    }

    return res.json({
      success: true,
      orderId: internalOrderId,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: grandTotalInPaise,
      currency: 'INR',
      keyId: razorpayOrder.keyId || process.env.RAZORPAY_KEY_ID,
      pricing: {
        subtotal: subtotalInPaise / 100,
        shippingFee: shippingFeeInPaise / 100,
        grandTotal: grandTotalInPaise / 100,
      },
    })
  } catch (error) {
    console.error('[API /api/checkout/create-order Error]:', error)
    return res.status(500).json({ success: false, message: 'Could not create checkout order.' })
  }
})

// 4. Verify Payment & Idempotently Book Shipment
app.post('/api/checkout/verify-and-ship', async (req, res) => {
  try {
    const {
      orderId,
      orderNumber,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerDetails = {},
      items = [],
      totalAmount,
    } = req.body || {}

    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    })

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid cryptographic signature.',
      })
    }

    const supabase = getSupabaseAdmin()
    let effectiveOrderNumber = orderNumber || `VOLTT-ORD-${Date.now().toString().slice(-6)}`
    let alreadyFulfilled = false
    let trustedOrderTotalInPaise = totalAmount ? Math.round(totalAmount * 100) : 40800

    let existingOrder = null
    let existingPayment = null

    if (supabase) {
      let query = supabase.from('orders').select('*')
      if (orderId) query = query.eq('id', orderId)
      else if (orderNumber) query = query.eq('order_number', orderNumber)

      const { data: orderData, error: orderError } = await query.maybeSingle()
      if (orderError || !orderData) {
        return res.status(404).json({ success: false, message: 'Order record not found for verification.' })
      }

      existingOrder = orderData
      effectiveOrderNumber = existingOrder.order_number
      trustedOrderTotalInPaise = existingOrder.grand_total_in_paise

      const { data: paymentData } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', existingOrder.id)
        .maybeSingle()

      existingPayment = paymentData

      if (existingPayment && existingPayment.razorpay_order_id !== razorpayOrderId) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Razorpay order ID does not match this order record.',
        })
      }

      if (existingPayment?.razorpay_payment_id && existingPayment.razorpay_payment_id !== razorpayPaymentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Order already bound to a different payment ID.',
        })
      }
    }

    const paymentRecord = await fetchRazorpayPayment(razorpayPaymentId)
    if (paymentRecord) {
      if (paymentRecord.status !== 'captured' && paymentRecord.status !== 'authorized') {
        return res.status(400).json({ success: false, message: `Payment not in captured/authorized state.` })
      }
      if (paymentRecord.order_id && paymentRecord.order_id !== razorpayOrderId) {
        return res.status(400).json({ success: false, message: 'Payment record belongs to a different Razorpay order ID.' })
      }
      if (typeof paymentRecord.amount === 'number' && paymentRecord.amount !== trustedOrderTotalInPaise) {
        return res.status(400).json({
          success: false,
          message: `Payment amount mismatch: paid ₹${(paymentRecord.amount / 100).toFixed(2)}, expected ₹${(trustedOrderTotalInPaise / 100).toFixed(2)}.`,
        })
      }
      if (paymentRecord.currency && paymentRecord.currency.toUpperCase() !== 'INR') {
        return res.status(400).json({ success: false, message: 'Payment currency mismatch: expected INR.' })
      }
    }

    if (supabase && existingOrder) {
      if (existingOrder.payment_status === 'PAID' && ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(existingOrder.fulfillment_status)) {
        alreadyFulfilled = true
      } else {
        await supabase
          .from('orders')
          .update({ payment_status: 'PAID', fulfillment_status: 'PROCESSING', updated_at: new Date().toISOString() })
          .eq('id', existingOrder.id)
      }

      await supabase
        .from('payments')
        .update({
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          payment_status: 'CAPTURED',
          raw_response: paymentRecord || { verified: true },
          updated_at: new Date().toISOString(),
        })
        .eq('order_id', existingOrder.id)
    }

    let shipmentResult = null
    if (!alreadyFulfilled) {
      try {
        shipmentResult = await createShiprocketOrder({
          orderId: effectiveOrderNumber,
          customerName: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          city: customerDetails.city,
          state: customerDetails.state,
          pincode: customerDetails.pincode,
          items,
          totalAmount: totalAmount || 408,
        })

        if (supabase && orderId) {
          await supabase.from('shipments').insert({
            order_id: orderId,
            shiprocket_order_id: shipmentResult.shiprocketOrderId,
            shipment_id: shipmentResult.shipmentId,
            awb_code: shipmentResult.awbCode,
            courier_name: shipmentResult.courierName,
            tracking_url: shipmentResult.trackingUrl,
            status: shipmentResult.awbCode ? 'MANIFESTED' : 'PENDING',
            raw_response: shipmentResult,
          })

          await supabase
            .from('orders')
            .update({ fulfillment_status: shipmentResult.awbCode ? 'SHIPPED' : 'PROCESSING', updated_at: new Date().toISOString() })
            .eq('id', orderId)
        }
      } catch (shipError) {
        console.error('[Shiprocket Booking Warning]:', shipError.message)
        shipmentResult = {
          success: true,
          status: 'PENDING_FULFILLMENT',
          message: 'Order paid successfully. Shipment will be processed shortly.',
        }
      }
    }

    return res.json({
      success: true,
      orderNumber: effectiveOrderNumber,
      razorpayPaymentId,
      shipment: shipmentResult,
      message: 'Payment verified and order finalized!',
    })
  } catch (error) {
    console.error('[API /api/checkout/verify-and-ship Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while finalizing order and booking shipment.',
    })
  }
})

// 5. Razorpay Webhook Endpoint
app.post('/api/webhooks/razorpay', async (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing signature header' })
  }

  const rawBody = req.rawBody || req.body
  const isValid = verifyRazorpayWebhookSignature({
    rawBody,
    signature,
    secret: process.env.RAZORPAY_WEBHOOK_SECRET,
  })

  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' })
  }

  const event = req.body
  const eventId = event.event_id || event.id || `evt_${Date.now()}`
  const eventType = event.event
  const supabase = getSupabaseAdmin()

  if (supabase) {
    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id, processed')
      .eq('event_id', eventId)
      .maybeSingle()

    if (existingEvent?.processed) {
      return res.json({ received: true, deduplicated: true })
    }

    await supabase.from('webhook_events').upsert({
      event_id: eventId,
      event_type: eventType,
      provider: 'razorpay',
      payload: event,
      processed: true,
      processed_at: new Date().toISOString(),
    })
  }

  return res.json({ received: true, event: eventType })
})

// 6. Admin: List Orders & Metrics (Protected)
app.get('/api/admin/orders', async (req, res) => {
  const auth = await verifyAdminToken(req)
  if (auth.error) {
    const statusCode = auth.user ? 403 : 401
    return res.status(statusCode).json({ success: false, message: auth.error })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Database service is unconfigured.' })
  }

  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '25', 10)))
    const statusFilter = (req.query.status || 'ALL').toUpperCase()
    const rawSearch = (req.query.search || '').trim().toLowerCase()
    const cleanSearch = rawSearch.replace(/[,()"'\\%]/g, ' ').trim().replace(/\s+/g, ' ')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('orders')
      .select('*, order_items(*), payments(*), shipments(*)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (statusFilter === 'PAID') query = query.eq('payment_status', 'PAID')
    else if (statusFilter === 'PENDING') query = query.eq('payment_status', 'PENDING')
    else if (statusFilter === 'SHIPPED') query = query.eq('fulfillment_status', 'SHIPPED')
    else if (statusFilter === 'SHIPMENT_FAILED') query = query.eq('fulfillment_status', 'SHIPMENT_FAILED')

    if (cleanSearch) {
      query = query.or(`order_number.ilike.%${cleanSearch}%,customer_name.ilike.%${cleanSearch}%,customer_email.ilike.%${cleanSearch}%`)
    }

    const { data: orders, count: totalCount, error } = await query.range(from, to)
    if (error) {
      return res.status(500).json({ success: false, message: 'Could not retrieve orders.' })
    }

    const { data: allOrders } = await supabase.from('orders').select('payment_status, fulfillment_status, grand_total_in_paise')
    let verifiedRevenueInPaise = 0
    let totalOrders = 0
    let paidOrdersCount = 0
    let pendingShipmentsCount = 0
    let failedShipmentsCount = 0

    if (allOrders) {
      totalOrders = allOrders.length
      allOrders.forEach((ord) => {
        if (ord.payment_status === 'PAID') {
          verifiedRevenueInPaise += ord.grand_total_in_paise || 0
          paidOrdersCount++
          if (['UNFULFILLED', 'PROCESSING'].includes(ord.fulfillment_status)) pendingShipmentsCount++
          else if (ord.fulfillment_status === 'SHIPMENT_FAILED') failedShipmentsCount++
        }
      })
    }

    return res.json({
      success: true,
      metrics: {
        verifiedRevenue: verifiedRevenueInPaise / 100,
        totalOrders,
        paidOrdersCount,
        pendingShipmentsCount,
        failedShipmentsCount,
      },
      orders: orders || [],
      pagination: { page, limit, total: totalCount || 0, totalPages: Math.ceil((totalCount || 0) / limit) },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error retrieving orders.' })
  }
})

// 7. Admin: Retry Shipment (Protected & Concurrency-Safe)
app.post('/api/admin/retry-shipment', async (req, res) => {
  const auth = await verifyAdminToken(req)
  if (auth.error) {
    const statusCode = auth.user ? 403 : 401
    return res.status(statusCode).json({ success: false, message: auth.error })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) return res.status(500).json({ success: false, message: 'Database service is unconfigured.' })

  const { orderId } = req.body || {}
  if (!orderId) return res.status(400).json({ success: false, message: 'orderId is required.' })

  try {
    const { data: order } = await supabase.from('orders').select('*, order_items(*), shipments(*)').eq('id', orderId).maybeSingle()
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    if (order.payment_status !== 'PAID') {
      return res.status(400).json({ success: false, message: 'Cannot ship unpaid order.' })
    }

    const hasActive = (order.shipments || []).some(s => s.awb_code || ['MANIFESTED', 'IN_TRANSIT', 'DELIVERED'].includes(s.status))
    if (hasActive || order.fulfillment_status === 'SHIPPED') {
      return res.status(400).json({ success: false, message: 'Order already has an active shipment.' })
    }

    await supabase.from('orders').update({ fulfillment_status: 'PROCESSING', updated_at: new Date().toISOString() }).eq('id', order.id)

    const items = (order.order_items || []).map(i => ({
      id: i.product_id,
      title: i.product_title,
      quantity: i.quantity * (i.pack_size || 1),
      price: (i.unit_price_in_paise || 6800) / 100,
    }))

    try {
      const shipmentResult = await createShiprocketOrder({
        orderId: order.order_number,
        customerName: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        address: order.shipping_address,
        city: order.shipping_city,
        state: order.shipping_state,
        pincode: order.shipping_pincode,
        items,
        totalAmount: (order.grand_total_in_paise || 40800) / 100,
      })

      await supabase.from('shipments').insert({
        order_id: order.id,
        shiprocket_order_id: shipmentResult.shiprocketOrderId,
        shipment_id: shipmentResult.shipmentId,
        awb_code: shipmentResult.awbCode,
        courier_name: shipmentResult.courierName,
        tracking_url: shipmentResult.trackingUrl,
        status: shipmentResult.awbCode ? 'MANIFESTED' : 'PENDING',
        raw_response: shipmentResult,
      })

      await supabase.from('orders').update({
        fulfillment_status: shipmentResult.awbCode ? 'SHIPPED' : 'PROCESSING',
        updated_at: new Date().toISOString(),
      }).eq('id', order.id)

      await supabase.from('admin_audit_logs').insert({
        admin_user_id: auth.user.id,
        action: 'RETRY_SHIPMENT_SUCCESS',
        target_resource: 'orders',
        target_id: order.id,
        changes: { awbCode: shipmentResult.awbCode },
      })

      return res.json({ success: true, shipment: shipmentResult, message: 'Shipment booked successfully.' })
    } catch (shipErr) {
      await supabase.from('shipments').insert({ order_id: order.id, status: 'FAILED', raw_response: { error: shipErr.message } })
      await supabase.from('orders').update({ fulfillment_status: 'SHIPMENT_FAILED', updated_at: new Date().toISOString() }).eq('id', order.id)
      return res.status(502).json({ success: false, message: `Shiprocket error: ${shipErr.message}` })
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal error processing retry.' })
  }
})

app.listen(PORT, () => {
  console.log(`⚡ Voltt Server running on http://localhost:${PORT}`)
})
