import Razorpay from 'razorpay'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Initialize Razorpay Instance
 */
export function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret || keyId === 'your_razorpay_key_id_here') {
    return null
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

/**
 * Create Razorpay Order
 */
export async function createRazorpayOrder({ amount, currency = 'INR', receipt }) {
  const instance = getRazorpayInstance()

  // If Razorpay keys aren't set up yet, provide a simulated order response
  if (!instance) {
    console.warn('[Razorpay] Keys not configured in .env. Operating in test simulation mode.')
    const mockOrderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    return {
      success: true,
      simulated: true,
      id: mockOrderId,
      amount: Math.round(amount * 100),
      currency,
      receipt,
      keyId: process.env.RAZORPAY_KEY_ID || 'placeholder_key_id',
    }
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Amount in paise (e.g. 499 INR = 49900 paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    }

    const order = await instance.orders.create(options)
    return {
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: process.env.RAZORPAY_KEY_ID,
    }
  } catch (error) {
    console.error('[Razorpay Order Creation Error]:', error)
    throw error
  }
}

/**
 * Verify Razorpay Cryptographic Payment Signature
 */
export function verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const secret = process.env.RAZORPAY_KEY_SECRET

  // Simulated mode
  if (!secret || secret === 'YourKeySecretHere' || razorpayOrderId.startsWith('order_sim_')) {
    console.log('[Razorpay Signature Verification]: Test mode auto-approved signature.')
    return true
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  return generatedSignature === razorpaySignature
}
