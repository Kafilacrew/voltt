import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { checkPincodeServiceability, createShiprocketOrder } from './services/shiprocket.js'
import { createRazorpayOrder, verifyRazorpaySignature } from './services/razorpay.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Voltt Checkout Backend Server (Razorpay + Shiprocket)',
    timestamp: new Date().toISOString(),
  })
})

/**
 * Endpoint: Check Pincode Serviceability with Shiprocket
 */
app.post('/api/pincode/check', async (req, res) => {
  try {
    const { pincode } = req.body

    if (!pincode || typeof pincode !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid pincode is required.' })
    }

    const result = await checkPincodeServiceability({ deliveryPincode: pincode.trim() })
    return res.json(result)
  } catch (error) {
    console.error('[API /api/pincode/check Error]:', error)
    return res.status(500).json({ success: false, message: 'Failed to verify pincode serviceability.' })
  }
})

/**
 * Endpoint: Create Razorpay Payment Order
 */
app.post('/api/checkout/create-order', async (req, res) => {
  try {
    const { amount, items, customerDetails } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid order amount is required.' })
    }

    const receipt = `VOLTT-${Date.now()}`
    const orderData = await createRazorpayOrder({ amount, receipt })

    return res.json({
      success: true,
      order: orderData,
    })
  } catch (error) {
    console.error('[API /api/checkout/create-order Error]:', error)
    return res.status(500).json({ success: false, message: 'Could not create Razorpay order.' })
  }
})

/**
 * Endpoint: Verify Razorpay Payment Signature & Book Shiprocket Shipment
 */
app.post('/api/checkout/verify-and-ship', async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerDetails,
      items,
      totalAmount,
    } = req.body

    // 1. Verify Payment Signature
    const isPaymentValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    })

    if (!isPaymentValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid transaction signature.',
      })
    }

    const orderId = `VOLTT-ORD-${Date.now().toString().slice(-6)}`

    // 2. Book Shipment on Shiprocket
    const shippingResult = await createShiprocketOrder({
      orderId,
      customerName: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone,
      address: customerDetails.address,
      city: customerDetails.city,
      state: customerDetails.state,
      pincode: customerDetails.pincode,
      items,
      totalAmount,
    })

    return res.json({
      success: true,
      orderId,
      razorpayPaymentId,
      shipment: shippingResult,
      message: 'Payment verified and shipment booked successfully!',
    })
  } catch (error) {
    console.error('[API /api/checkout/verify-and-ship Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while finalizing order and booking shipment.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`⚡ Voltt Server running on http://localhost:${PORT}`)
})
