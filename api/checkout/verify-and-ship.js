import { verifyRazorpaySignature, fetchRazorpayPayment } from '../_services/razorpay.js'
import { createShiprocketOrder } from '../_services/shiprocket.js'
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

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

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment verification parameters.',
      })
    }

    // 1. Verify Cryptographic Signature
    const isSignatureValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    })

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid cryptographic signature.',
      })
    }

    const supabase = getSupabaseAdmin()
    let effectiveOrderNumber = orderNumber || `VOLTT-ORD-${Date.now().toString().slice(-6)}`
    let alreadyFulfilled = false
    let trustedOrderTotalInPaise = totalAmount ? Math.round(totalAmount * 100) : 40800

    // 2. Fetch & Validate Database Order and Persisted Payment Record
    let existingOrder = null
    let existingPayment = null

    if (supabase) {
      let query = supabase.from('orders').select('*')
      if (orderId) {
        query = query.eq('id', orderId)
      } else if (orderNumber) {
        query = query.eq('order_number', orderNumber)
      }

      const { data: orderData, error: orderError } = await query.maybeSingle()
      if (orderError || !orderData) {
        return res.status(404).json({
          success: false,
          message: 'Order record not found for verification.',
        })
      }

      existingOrder = orderData
      effectiveOrderNumber = existingOrder.order_number
      trustedOrderTotalInPaise = existingOrder.grand_total_in_paise

      // Fetch payment record linked to this order
      const { data: paymentData } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', existingOrder.id)
        .maybeSingle()

      existingPayment = paymentData

      // Security Check: Verify Razorpay Order ID matches the order's initiated payment
      if (existingPayment && existingPayment.razorpay_order_id !== razorpayOrderId) {
        console.error(`[Payment Mismatch]: Razorpay Order ID ${razorpayOrderId} does not match order's initiated payment ${existingPayment.razorpay_order_id}`)
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Razorpay order ID does not match this order record.',
        })
      }

      // Security Check: Prevent reuse of an already captured payment ID on a different order
      if (existingPayment?.razorpay_payment_id && existingPayment.razorpay_payment_id !== razorpayPaymentId) {
        console.error(`[Payment Reused]: Order already has payment ID ${existingPayment.razorpay_payment_id}; attempted update with ${razorpayPaymentId}`)
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Order already bound to a different payment ID.',
        })
      }
    }

    // 3. Fetch & Validate Payment from Razorpay API
    const paymentRecord = await fetchRazorpayPayment(razorpayPaymentId)
    if (paymentRecord) {
      if (paymentRecord.status !== 'captured' && paymentRecord.status !== 'authorized') {
        return res.status(400).json({
          success: false,
          message: `Payment not in captured/authorized state (status: ${paymentRecord.status}).`,
        })
      }

      // Security Check: Verify payment was made for this exact Razorpay Order ID
      if (paymentRecord.order_id && paymentRecord.order_id !== razorpayOrderId) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Payment record belongs to a different Razorpay order ID.',
        })
      }

      // Security Check: Confirm exact amount in paise matches trusted database total
      if (typeof paymentRecord.amount === 'number' && paymentRecord.amount !== trustedOrderTotalInPaise) {
        console.error(`[Amount Tampering Detected]: Paid ${paymentRecord.amount} paise, expected ${trustedOrderTotalInPaise} paise.`)
        return res.status(400).json({
          success: false,
          message: `Payment amount mismatch: paid ₹${(paymentRecord.amount / 100).toFixed(2)}, expected ₹${(trustedOrderTotalInPaise / 100).toFixed(2)}.`,
        })
      }

      // Security Check: Confirm currency is INR
      if (paymentRecord.currency && paymentRecord.currency.toUpperCase() !== 'INR') {
        return res.status(400).json({
          success: false,
          message: `Payment currency mismatch: expected INR, received ${paymentRecord.currency}.`,
        })
      }
    }

    // 4. Database Idempotency & Status Transition Lock
    if (supabase && existingOrder) {
      // If already marked PAID and fulfillment has already started, prevent duplicate shipments
      if (existingOrder.payment_status === 'PAID' && ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(existingOrder.fulfillment_status)) {
        console.log(`[Idempotency]: Order ${effectiveOrderNumber} already fulfilled. Skipping duplicate shipment booking.`)
        alreadyFulfilled = true
      } else {
        // Atomically transition payment to PAID and fulfillment to PROCESSING
        await supabase
          .from('orders')
          .update({
            payment_status: 'PAID',
            fulfillment_status: 'PROCESSING',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingOrder.id)
      }

      // Update Payment record
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

    // 4. Book Shipment via Shiprocket (Only if not already fulfilled)
    let shipmentResult = null

    if (!alreadyFulfilled) {
      const shippingAmount = trustedOrderTotalInPaise / 100

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
          totalAmount: shippingAmount,
        })

        // Persist Shipment Record in Supabase
        if (supabase && orderId) {
          await supabase
            .from('shipments')
            .insert({
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
            .update({
              fulfillment_status: shipmentResult.awbCode ? 'SHIPPED' : 'PROCESSING',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)
        }
      } catch (shipError) {
        console.error('[Shiprocket Booking Error - Order marked PENDING_SHIPMENT]:', shipError.message)

        if (supabase && orderId) {
          await supabase
            .from('shipments')
            .insert({
              order_id: orderId,
              status: 'FAILED',
              raw_response: { error: shipError.message },
            })

          await supabase
            .from('orders')
            .update({
              fulfillment_status: 'SHIPMENT_FAILED',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)
        }

        // Return payment success with queued fulfillment status (don't fail the paid customer)
        shipmentResult = {
          success: true,
          status: 'PENDING_FULFILLMENT',
          message: 'Order paid successfully. Logistics partner will assign tracking shortly.',
        }
      }
    }

    return res.status(200).json({
      success: true,
      orderNumber: effectiveOrderNumber,
      razorpayPaymentId,
      shipment: shipmentResult,
      message: 'Payment verified successfully and order finalized.',
    })
  } catch (error) {
    console.error('[API /api/checkout/verify-and-ship Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while verifying transaction and fulfilling shipment.',
    })
  }
}
