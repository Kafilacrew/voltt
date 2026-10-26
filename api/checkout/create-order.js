import { calculateOrderPricing, calculateCartPricing } from '../_services/catalog.js'
import { createRazorpayOrder } from '../_services/razorpay.js'
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const {
      items = null,
      productId,
      packSize = 6,
      quantity = 1,
      customerDetails = {},
      userId = null,
    } = req.body || {}

    // 1. Validate Customer Details
    const { name, email, phone, address, city, state, pincode } = customerDetails

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'A valid customer name is required.' })
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' })
    }

    const cleanPhone = (phone || '').toString().replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'A valid 10-digit mobile phone number is required.' })
    }

    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'A complete delivery address is required.' })
    }

    if (!city || !state) {
      return res.status(400).json({ success: false, message: 'City and State are required for delivery.' })
    }

    if (!pincode || !/^\d{6}$/.test(pincode.toString().trim())) {
      return res.status(400).json({ success: false, message: 'A valid 6-digit Indian PIN code is required.' })
    }

    // 2. Calculate Trusted Pricing (Never trust client prices)
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

    // Extract & verify authenticated user token server-side (never trust unverified client user IDs)
    if (supabase) {
      const authHeader = req.headers?.authorization || req.headers?.Authorization
      if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace(/^Bearer\s+/i, '').trim()
        if (token) {
          try {
            const { data: { user } } = await supabase.auth.getUser(token)
            if (user) {
              verifiedUserId = user.id
            }
          } catch (authErr) {
            // Silently fall back to guest order
          }
        }
      }
    }

    // 3. Persist Pending Order to Supabase (if configured)
    if (supabase) {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: verifiedUserId,
          customer_name: name.trim(),
          customer_email: email.trim().toLowerCase(),
          customer_phone: cleanPhone,
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
        console.error('[Supabase Order Insert Error]:', orderError)
        return res.status(500).json({
          success: false,
          message: 'Could not initialize order record. Please try again.',
        })
      }

      internalOrderId = orderData.id

      // Insert Order Items
      const orderItemsToInsert = processedItems.map((pi) => ({
        order_id: internalOrderId,
        product_id: pi.product.id,
        product_title: pi.product.title,
        pack_size: pi.packSize,
        quantity: pi.quantity,
        unit_price_in_paise: pi.unitPriceInPaise,
        total_price_in_paise: pi.subtotalInPaise,
      }))

      const { error: itemError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)

      if (itemError) {
        console.error('[Supabase Order Items Insert Error]:', itemError)
      }
    }

    // 4. Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder({
      amountInPaise: grandTotalInPaise,
      currency: 'INR',
      receipt: orderNumber,
    })

    // 5. Persist Payment Record in Supabase
    if (supabase && internalOrderId) {
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: internalOrderId,
          razorpay_order_id: razorpayOrder.id,
          payment_status: 'INITIATED',
          amount_in_paise: grandTotalInPaise,
          currency: 'INR',
        })

      if (paymentError) {
        console.error('[Supabase Payment Insert Error]:', paymentError)
      }
    }

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message: 'Failed to create checkout order. Please try again.',
    })
  }
}
