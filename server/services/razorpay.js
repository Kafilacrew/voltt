import Razorpay from 'razorpay'
import crypto from 'crypto'

try {
  const { default: dotenv } = await import('dotenv')
  dotenv?.config()
} catch (_) {
  // In serverless runtimes (e.g. Vercel), env vars are provided natively via process.env
}

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
 * @param {number} amountInPaise - Exact amount in paise (e.g. 40800 for ₹408)
 * @param {string} receipt - Internal unique order reference
 * @param {string} currency - Default 'INR'
 */
export async function createRazorpayOrder({ amountInPaise, currency = 'INR', receipt }) {
  const instance = getRazorpayInstance()

  // If Razorpay keys aren't set up yet, provide a simulated order response for testing
  if (!instance) {
    console.warn('[Razorpay] Keys not configured in .env. Operating in test simulation mode.')
    const mockOrderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    return {
      success: true,
      simulated: true,
      id: mockOrderId,
      amount: amountInPaise,
      currency,
      receipt,
      keyId: process.env.RAZORPAY_KEY_ID || 'placeholder_key_id',
    }
  }

  try {
    const options = {
      amount: Math.round(amountInPaise),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment on success
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
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const isExplicitSimulation =
    process.env.ALLOW_PAYMENT_SIMULATION === 'true' &&
    !isProduction &&
    typeof razorpayOrderId === 'string' &&
    razorpayOrderId.startsWith('order_sim_')

  if (isExplicitSimulation) {
    console.warn('[Razorpay Signature Verification]: Explicit simulation mode active in non-production.')
    return true
  }

  const secret = process.env.RAZORPAY_KEY_SECRET

  if (!secret || secret === 'YourKeySecretHere' || secret === 'your_razorpay_key_secret_here') {
    console.error('[Razorpay Signature Verification]: Missing or placeholder RAZORPAY_KEY_SECRET. Signature rejected.')
    return false
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    if (generatedSignature.length !== razorpaySignature.length) {
      return false
    }

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf-8'),
      Buffer.from(razorpaySignature, 'utf-8')
    )
  } catch (err) {
    console.error('[Razorpay Signature Verification Error]:', err.message)
    return false
  }
}

/**
 * Verify Razorpay Webhook Signature
 */
export function verifyRazorpayWebhookSignature({ rawBody, signature, secret }) {
  const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.warn('[Razorpay Webhook]: RAZORPAY_WEBHOOK_SECRET not configured.')
    return false
  }

  if (!rawBody || !signature) {
    return false
  }

  try {
    const dataToSign = Buffer.isBuffer(rawBody)
      ? rawBody
      : typeof rawBody === 'string'
      ? Buffer.from(rawBody, 'utf-8')
      : Buffer.from(JSON.stringify(rawBody), 'utf-8')

    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(dataToSign)
      .digest('hex')

    if (generatedSignature.length !== signature.length) {
      return false
    }

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    )
  } catch (err) {
    console.error('[Razorpay Webhook Signature Error]:', err.message)
    return false
  }
}

/**
 * Fetch Payment Status directly from Razorpay API
 */
export async function fetchRazorpayPayment(paymentId) {
  const instance = getRazorpayInstance()
  if (!instance) {
    if (paymentId.startsWith('pay_sim_')) {
      return { id: paymentId, status: 'captured', amount: 40800, currency: 'INR' }
    }
    return null
  }

  try {
    const payment = await instance.payments.fetch(paymentId)
    return payment
  } catch (error) {
    console.error('[Razorpay Fetch Payment Error]:', error)
    return null
  }
}
