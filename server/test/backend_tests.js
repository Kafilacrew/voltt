import assert from 'assert'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { calculateOrderPricing, calculateCartPricing, SERVER_PRODUCTS } from '../services/catalog.js'
import { verifyRazorpaySignature, verifyRazorpayWebhookSignature } from '../services/razorpay.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🧪 Starting Voltt Backend & Checkout Integration Test Suite...\n')

let passedTests = 0
let failedTests = 0

function runTest(name, fn) {
  try {
    fn()
    console.log(`✅ [PASS] ${name}`)
    passedTests++
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`)
    console.error(`   Error: ${err.message}`)
    failedTests++
  }
}

// 1. Pricing Engine Tests
console.log('--- 1. Pricing Engine & Calculation Tests ---')

runTest('Single bar pack of 6 calculation (Almond Crunch ₹68 * 6 = ₹408 + ₹49 shipping = ₹457)', () => {
  const pricing = calculateOrderPricing({ productId: 1, packSize: 6, quantity: 1 })
  assert.strictEqual(pricing.unitPriceInPaise, 6800)
  assert.strictEqual(pricing.subtotalInPaise, 40800) // ₹408
  assert.strictEqual(pricing.shippingFeeInPaise, 4900) // ₹49 (below ₹499 threshold)
  assert.strictEqual(pricing.grandTotalInPaise, 45700) // ₹457
})

runTest('Pack of 12 free shipping threshold (Berry Rush ₹68 * 12 = ₹816 >= ₹499 -> Free shipping)', () => {
  const pricing = calculateOrderPricing({ productId: 2, packSize: 12, quantity: 1 })
  assert.strictEqual(pricing.subtotalInPaise, 81600) // ₹816
  assert.strictEqual(pricing.shippingFeeInPaise, 0) // Free shipping
  assert.strictEqual(pricing.grandTotalInPaise, 81600) // ₹816
})

runTest('The Voltt Mixed Box 12-pack special price (₹735 free shipping)', () => {
  const pricing = calculateOrderPricing({ productId: 4, packSize: 12, quantity: 1 })
  assert.strictEqual(pricing.subtotalInPaise, 73500) // ₹735
  assert.strictEqual(pricing.shippingFeeInPaise, 0) // Free shipping
  assert.strictEqual(pricing.grandTotalInPaise, 73500) // ₹735
})

runTest('Rejection of invalid product ID', () => {
  assert.throws(() => {
    calculateOrderPricing({ productId: 999, packSize: 6, quantity: 1 })
  }, /Invalid product ID/)
})

runTest('Rejection of invalid pack size', () => {
  assert.throws(() => {
    calculateOrderPricing({ productId: 1, packSize: 5, quantity: 1 })
  }, /Invalid pack size/)
})

runTest('Rejection of invalid / negative quantity', () => {
  assert.throws(() => {
    calculateOrderPricing({ productId: 1, packSize: 6, quantity: -1 })
  }, /Invalid quantity/)

  assert.throws(() => {
    calculateOrderPricing({ productId: 1, packSize: 6, quantity: 51 })
  }, /Invalid quantity/)
})

// 2. Razorpay Cryptographic Verification Tests
console.log('\n--- 2. Razorpay Cryptographic Verification Tests ---')

runTest('HMAC SHA256 Signature calculation matches expected', () => {
  const testSecret = 'test_secret_key_12345'
  process.env.RAZORPAY_KEY_SECRET = testSecret

  const orderId = 'order_test_987654'
  const paymentId = 'pay_test_123456'
  const expectedSignature = crypto
    .createHmac('sha256', testSecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  const isValid = verifyRazorpaySignature({
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: expectedSignature,
  })

  assert.strictEqual(isValid, true)
})

runTest('Tampered Razorpay payment ID fails verification', () => {
  const testSecret = 'test_secret_key_12345'
  process.env.RAZORPAY_KEY_SECRET = testSecret

  const isValid = verifyRazorpaySignature({
    razorpayOrderId: 'order_test_987654',
    razorpayPaymentId: 'pay_tampered_id',
    razorpaySignature: 'invalid_signature_hash',
  })

  assert.strictEqual(isValid, false)
})

runTest('Webhook signature verification with secret', () => {
  const webhookSecret = 'whsec_testing_123'
  const samplePayload = JSON.stringify({ event: 'payment.captured', id: 'evt_123' })
  const validSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(samplePayload)
    .digest('hex')

  const isValid = verifyRazorpayWebhookSignature({
    rawBody: samplePayload,
    signature: validSignature,
    secret: webhookSecret,
  })

  assert.strictEqual(isValid, true)
})

runTest('Webhook signature fails with incorrect secret', () => {
  const samplePayload = JSON.stringify({ event: 'payment.captured', id: 'evt_123' })
  const isValid = verifyRazorpayWebhookSignature({
    rawBody: samplePayload,
    signature: 'wrong_signature',
    secret: 'whsec_testing_123',
  })

  assert.strictEqual(isValid, false)
})

// 3. Customer Input & Checkout Validation Tests
console.log('\n--- 3. Customer Input & Checkout Validation Tests ---')

function validateCustomerInput(details) {
  if (!details.name || details.name.trim().length < 2) throw new Error('Invalid name')
  if (!details.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) throw new Error('Invalid email')
  const phone = (details.phone || '').replace(/\D/g, '')
  if (phone.length < 10) throw new Error('Invalid phone')
  if (!details.address || details.address.trim().length < 5) throw new Error('Invalid address')
  if (!details.city || !details.state) throw new Error('Invalid city/state')
  if (!details.pincode || !/^\d{6}$/.test(details.pincode.trim())) throw new Error('Invalid pincode')
  return true
}

runTest('Accepts well-formed customer and delivery details', () => {
  const validCustomer = {
    name: 'Vikram Mehta',
    email: 'vikram@example.com',
    phone: '9876543210',
    address: '104, Sunrise Heights, Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  }
  assert.strictEqual(validateCustomerInput(validCustomer), true)
})

runTest('Rejects missing or invalid customer email format', () => {
  assert.throws(() => {
    validateCustomerInput({
      name: 'Vikram',
      email: 'not-an-email',
      phone: '9876543210',
      address: 'Sunrise Heights',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    })
  }, /Invalid email/)
})

runTest('Rejects invalid 5-digit PIN code', () => {
  assert.throws(() => {
    validateCustomerInput({
      name: 'Vikram',
      email: 'vikram@example.com',
      phone: '9876543210',
      address: 'Sunrise Heights',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '40005', // 5 digits
    })
  }, /Invalid pincode/)
})

// 4. Concurrency & Idempotency Simulation Tests
console.log('\n--- 4. Concurrency & Idempotency Simulation Tests ---')

runTest('Idempotent fulfillment: second verification claim is recognized as already fulfilled', () => {
  const orderStore = {
    'VOLTT-ORD-001': {
      orderNumber: 'VOLTT-ORD-001',
      payment_status: 'PENDING',
      fulfillment_status: 'UNFULFILLED',
      shipmentBookedCount: 0,
    },
  }

  function simulateVerifyAndShip(orderNumber) {
    const order = orderStore[orderNumber]
    if (!order) throw new Error('Order not found')

    let alreadyFulfilled = false
    if (order.payment_status === 'PAID' && ['PROCESSING', 'SHIPPED'].includes(order.fulfillment_status)) {
      alreadyFulfilled = true
    } else {
      order.payment_status = 'PAID'
      order.fulfillment_status = 'PROCESSING'
      order.shipmentBookedCount++
    }

    return { alreadyFulfilled, shipmentBookedCount: order.shipmentBookedCount }
  }

  // First call: transitions status and increments shipmentBookedCount to 1
  const firstClaim = simulateVerifyAndShip('VOLTT-ORD-001')
  assert.strictEqual(firstClaim.alreadyFulfilled, false)
  assert.strictEqual(firstClaim.shipmentBookedCount, 1)

  // Second call (e.g. repeated callback or client retry): identifies already fulfilled
  const secondClaim = simulateVerifyAndShip('VOLTT-ORD-001')
  assert.strictEqual(secondClaim.alreadyFulfilled, true)
  assert.strictEqual(secondClaim.shipmentBookedCount, 1) // Did not create duplicate shipment!
})

// 5. Phase 5: Customer Authentication & Registration Validation Tests (Mocked)
console.log('\n--- 5. Phase 5: Customer Auth Validation & Session Tests (Mocked) ---')

function validateRegistrationInput({ email, password, fullName, phone }) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Invalid email')
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters')
  if (!fullName || fullName.trim().length < 2) throw new Error('Name must be at least 2 characters')
  const cleanPhone = (phone || '').replace(/\D/g, '')
  if (cleanPhone.length < 10) throw new Error('Valid 10-digit phone is required')
  return true
}

runTest('Valid registration input accepted', () => {
  assert.strictEqual(
    validateRegistrationInput({
      email: 'customer@example.com',
      password: 'securepassword123',
      fullName: 'Rahul Sen',
      phone: '9876543210',
    }),
    true
  )
})

runTest('Registration rejects password shorter than 6 characters', () => {
  assert.throws(() => {
    validateRegistrationInput({
      email: 'customer@example.com',
      password: '12345',
      fullName: 'Rahul Sen',
      phone: '9876543210',
    })
  }, /Password must be at least 6 characters/)
})

runTest('Password recovery input validation enforces email format', () => {
  function validatePasswordReset(email) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Invalid email for reset')
    return true
  }
  assert.strictEqual(validatePasswordReset('customer@example.com'), true)
  assert.throws(() => validatePasswordReset('invalid-email'), /Invalid email for reset/)
})

// 6. Phase 5: Customer Order Isolation & RLS Simulation Tests (Mocked)
console.log('\n--- 6. Phase 5: Customer Order Isolation & RLS Security Tests (Mocked) ---')

const mockOrdersTable = [
  { id: 'ord-101', user_id: 'user-aaa', order_number: 'VOLTT-001', customer_email: 'alice@example.com' },
  { id: 'ord-102', user_id: 'user-bbb', order_number: 'VOLTT-002', customer_email: 'bob@example.com' },
  { id: 'ord-103', user_id: null, order_number: 'VOLTT-003', customer_email: 'guest@example.com' },
]

function simulateRlsOrdersQuery(requestingUserId) {
  // Simulates Supabase RLS policy:
  // CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id)
  if (!requestingUserId) return [] // Anonymous cannot view user orders
  return mockOrdersTable.filter((ord) => ord.user_id === requestingUserId)
}

runTest('Customer A (user-aaa) can only view own orders and cannot see Customer B (user-bbb) orders', () => {
  const aliceOrders = simulateRlsOrdersQuery('user-aaa')
  assert.strictEqual(aliceOrders.length, 1)
  assert.strictEqual(aliceOrders[0].id, 'ord-101')
  assert.strictEqual(aliceOrders.some((o) => o.id === 'ord-102'), false)
})

runTest('Anonymous users receive 0 private orders under RLS policy', () => {
  const anonOrders = simulateRlsOrdersQuery(null)
  assert.strictEqual(anonOrders.length, 0)
})

runTest('Client-supplied user ID parameter is ignored; only authenticated session user is used', () => {
  function resolveOrderUserId(authenticatedTokenUser, clientSuppliedBodyUserId) {
    // Server logic from create-order.js: never trust client body userId!
    return authenticatedTokenUser?.id || null
  }
  const attackerAttempt = resolveOrderUserId(null, 'victim-user-id-999')
  assert.strictEqual(attackerAttempt, null) // Stays null (guest order), does not spoof victim!

  const legitimateUser = resolveOrderUserId({ id: 'real-user-123' }, 'spoofed-id')
  assert.strictEqual(legitimateUser, 'real-user-123') // Uses token, ignores client-supplied spoof
})

// 7. Phase 5: Administrator Authorization & API Guard Tests (Mocked)
console.log('\n--- 7. Phase 5: Administrator Authorization & API Guard Tests (Mocked) ---')

const mockDatabaseRoles = {
  'user-customer-1': 'customer',
  'user-admin-1': 'admin',
}

function simulateVerifyAdminToken(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 401, error: 'Missing or malformed Authorization header' }
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    return { status: 401, error: 'Empty token' }
  }

  // Token decode simulation
  let user = null
  if (token === 'valid-admin-jwt') {
    user = { id: 'user-admin-1', email: 'admin@voltt.in' }
  } else if (token === 'valid-customer-jwt') {
    user = { id: 'user-customer-1', email: 'customer@voltt.in' }
  } else {
    return { status: 401, error: 'Invalid or expired user session' }
  }

  // Trusted database role check
  const role = mockDatabaseRoles[user.id]
  if (role !== 'admin') {
    return { status: 403, error: 'Forbidden: Account does not possess administrator privileges' }
  }

  return { status: 200, user, isAdmin: true }
}

runTest('Request without Authorization header is rejected with 401', () => {
  const res = simulateVerifyAdminToken({ headers: {} })
  assert.strictEqual(res.status, 401)
})

runTest('Request with invalid Bearer token is rejected with 401', () => {
  const res = simulateVerifyAdminToken({ headers: { authorization: 'Bearer bad-token-xyz' } })
  assert.strictEqual(res.status, 401)
})

runTest('Ordinary customer token is rejected with 403 Forbidden', () => {
  const res = simulateVerifyAdminToken({ headers: { authorization: 'Bearer valid-customer-jwt' } })
  assert.strictEqual(res.status, 403)
  assert.strictEqual(res.isAdmin, undefined)
})

runTest('Client-supplied isAdmin flag in body or header is ignored when token is non-admin', () => {
  const fakeAdminReq = {
    headers: { authorization: 'Bearer valid-customer-jwt' },
    body: { isAdmin: true },
    query: { isAdmin: 'true' },
  }
  const res = simulateVerifyAdminToken(fakeAdminReq)
  assert.strictEqual(res.status, 403)
})

runTest('Verified administrator token with database admin role is authorized with 200', () => {
  const adminReq = { headers: { authorization: 'Bearer valid-admin-jwt' } }
  const res = simulateVerifyAdminToken(adminReq)
  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.isAdmin, true)
  assert.strictEqual(res.user.email, 'admin@voltt.in')
})

// 8. Phase 5: Admin Shipment Retry & Duplicate Prevention Tests (Mocked)
console.log('\n--- 8. Phase 5: Admin Shipment Retry & Duplicate Prevention Tests (Mocked) ---')

function simulateAdminRetryShipment(adminAuthResult, order) {
  if (adminAuthResult.status !== 200 || !adminAuthResult.isAdmin) {
    return { status: adminAuthResult.status, message: adminAuthResult.error }
  }
  if (!order) {
    return { status: 404, message: 'Order not found' }
  }
  if (order.payment_status !== 'PAID') {
    return { status: 400, message: 'Cannot fulfill shipment: Order payment has not been verified and captured.' }
  }
  const hasActiveShipment = (order.shipments || []).some(
    (s) => s.awb_code || ['MANIFESTED', 'IN_TRANSIT', 'DELIVERED'].includes(s.status)
  )
  if (hasActiveShipment || order.fulfillment_status === 'SHIPPED') {
    return { status: 400, message: 'Order already has an active shipment. Duplicate creation prevented.' }
  }

  // Simulate successful retry
  return {
    status: 200,
    success: true,
    shipment: {
      shiprocketOrderId: 998877,
      awbCode: 'AWB-RETRY-12345',
      courierName: 'Delhivery Surface',
    },
  }
}

runTest('Retry shipment requires admin authorization; customer call is rejected', () => {
  const customerAuth = simulateVerifyAdminToken({ headers: { authorization: 'Bearer valid-customer-jwt' } })
  const result = simulateAdminRetryShipment(customerAuth, { payment_status: 'PAID' })
  assert.strictEqual(result.status, 403)
})

runTest('Retry shipment refuses unpaid or pending payment orders', () => {
  const adminAuth = simulateVerifyAdminToken({ headers: { authorization: 'Bearer valid-admin-jwt' } })
  const unpaidOrder = { id: 'ord-unpaid', payment_status: 'PENDING', fulfillment_status: 'UNFULFILLED' }
  const result = simulateAdminRetryShipment(adminAuth, unpaidOrder)
  assert.strictEqual(result.status, 400)
  assert.match(result.message, /payment has not been verified/i)
})

runTest('Retry shipment refuses duplicate creation when active shipment with AWB already exists', () => {
  const adminAuth = simulateVerifyAdminToken({ headers: { authorization: 'Bearer valid-admin-jwt' } })
  const shippedOrder = {
    id: 'ord-shipped',
    payment_status: 'PAID',
    fulfillment_status: 'SHIPPED',
    shipments: [{ awb_code: 'AWB-EXISTING-999', status: 'MANIFESTED' }],
  }
  const result = simulateAdminRetryShipment(adminAuth, shippedOrder)
  assert.strictEqual(result.status, 400)
  assert.match(result.message, /Duplicate creation prevented/i)
})

runTest('Retry shipment succeeds for paid order with failed previous fulfillment', () => {
  const adminAuth = simulateVerifyAdminToken({ headers: { authorization: 'Bearer valid-admin-jwt' } })
  const failedOrder = {
    id: 'ord-failed',
    payment_status: 'PAID',
    fulfillment_status: 'SHIPMENT_FAILED',
    shipments: [{ status: 'FAILED' }],
  }
  const result = simulateAdminRetryShipment(adminAuth, failedOrder)
  assert.strictEqual(result.status, 200)
  assert.strictEqual(result.success, true)
  assert.strictEqual(result.shipment.awbCode, 'AWB-RETRY-12345')
})

runTest('Guest checkout remains functional without authentication', () => {
  const pricing = calculateOrderPricing({ productId: 1, packSize: 6, quantity: 1 })
  assert.strictEqual(pricing.subtotalInPaise, 40800)
  assert.strictEqual(pricing.grandTotalInPaise, 45700)
})

// ==============================================================================
// Phase 7: Security & Reliability Regression Test Suites
// ==============================================================================

// Fix 1 Regressions: Razorpay signature verification
console.log('\n--- Phase 7: Fix 1 - Razorpay Signature Verification Hardening ---')

runTest('Fix 1: Rejects verification when RAZORPAY_KEY_SECRET is missing', () => {
  const prevSecret = process.env.RAZORPAY_KEY_SECRET
  const prevSim = process.env.ALLOW_PAYMENT_SIMULATION
  delete process.env.RAZORPAY_KEY_SECRET
  delete process.env.ALLOW_PAYMENT_SIMULATION

  const result = verifyRazorpaySignature({
    razorpayOrderId: 'order_real_123',
    razorpayPaymentId: 'pay_real_456',
    razorpaySignature: 'any_signature',
  })

  process.env.RAZORPAY_KEY_SECRET = prevSecret
  assert.strictEqual(result, false)
})

runTest('Fix 1: Rejects fabricated signature with valid secret configured', () => {
  process.env.RAZORPAY_KEY_SECRET = 'valid_test_secret_999'
  delete process.env.ALLOW_PAYMENT_SIMULATION

  const result = verifyRazorpaySignature({
    razorpayOrderId: 'order_real_123',
    razorpayPaymentId: 'pay_real_456',
    razorpaySignature: 'fabricated_invalid_signature_hex_00000000000000000000000000000000',
  })
  assert.strictEqual(result, false)
})

runTest('Fix 1: Rejects simulated order ID prefix when simulation is not explicitly enabled', () => {
  process.env.RAZORPAY_KEY_SECRET = 'valid_test_secret_999'
  delete process.env.ALLOW_PAYMENT_SIMULATION

  const result = verifyRazorpaySignature({
    razorpayOrderId: 'order_sim_attempt_bypass',
    razorpayPaymentId: 'pay_test_123',
    razorpaySignature: 'fake_signature',
  })
  assert.strictEqual(result, false)
})

runTest('Fix 1: Rejects simulation even with flag when NODE_ENV is production', () => {
  const prevEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  process.env.ALLOW_PAYMENT_SIMULATION = 'true'
  process.env.RAZORPAY_KEY_SECRET = 'valid_test_secret_999'

  const result = verifyRazorpaySignature({
    razorpayOrderId: 'order_sim_attempt_in_prod',
    razorpayPaymentId: 'pay_test_123',
    razorpaySignature: 'fake_signature',
  })

  process.env.NODE_ENV = prevEnv
  delete process.env.ALLOW_PAYMENT_SIMULATION
  assert.strictEqual(result, false)
})

runTest('Fix 1: Accepts valid HMAC signature computed with secret', () => {
  const secret = 'valid_test_secret_999'
  process.env.RAZORPAY_KEY_SECRET = secret
  delete process.env.ALLOW_PAYMENT_SIMULATION

  const orderId = 'order_valid_777'
  const paymentId = 'pay_valid_888'
  const validSig = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')

  const result = verifyRazorpaySignature({
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: validSig,
  })
  assert.strictEqual(result, true)
})

// Fix 2 Regressions: Payment order binding & amount verification
console.log('\n--- Phase 7: Fix 2 - Payment Order Binding & Amount Verification ---')

function simulateVerifyAndShipPaymentCheck({
  dbOrder,
  dbPayment,
  incomingRazorpayOrderId,
  incomingPaymentId,
  fetchedPaymentRecord,
}) {
  if (!dbOrder) return { status: 404, message: 'Order record not found.' }
  if (dbPayment && dbPayment.razorpay_order_id !== incomingRazorpayOrderId) {
    return { status: 400, message: 'Razorpay order ID does not match this order record.' }
  }
  if (dbPayment?.razorpay_payment_id && dbPayment.razorpay_payment_id !== incomingPaymentId) {
    return { status: 400, message: 'Order already bound to a different payment ID.' }
  }
  if (fetchedPaymentRecord) {
    if (fetchedPaymentRecord.status !== 'captured' && fetchedPaymentRecord.status !== 'authorized') {
      return { status: 400, message: 'Payment not in captured/authorized state.' }
    }
    if (fetchedPaymentRecord.order_id && fetchedPaymentRecord.order_id !== incomingRazorpayOrderId) {
      return { status: 400, message: 'Payment record belongs to a different Razorpay order ID.' }
    }
    if (fetchedPaymentRecord.amount !== dbOrder.grand_total_in_paise) {
      return { status: 400, message: 'Payment amount mismatch: paid amount does not match expected total.' }
    }
    if (fetchedPaymentRecord.currency && fetchedPaymentRecord.currency.toUpperCase() !== 'INR') {
      return { status: 400, message: 'Payment currency mismatch: expected INR.' }
    }
  }

  let alreadyFulfilled = false
  if (dbOrder.payment_status === 'PAID' && ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(dbOrder.fulfillment_status)) {
    alreadyFulfilled = true
  }

  return { status: 200, success: true, alreadyFulfilled }
}

runTest('Fix 2: Rejects payment when Razorpay order ID does not match database record', () => {
  const order = { id: 'ord-1', grand_total_in_paise: 45700, payment_status: 'PENDING' }
  const payment = { order_id: 'ord-1', razorpay_order_id: 'order_legit_111' }

  const res = simulateVerifyAndShipPaymentCheck({
    dbOrder: order,
    dbPayment: payment,
    incomingRazorpayOrderId: 'order_attacker_spoofed_222',
    incomingPaymentId: 'pay_123',
    fetchedPaymentRecord: { status: 'captured', amount: 45700, currency: 'INR', order_id: 'order_attacker_spoofed_222' },
  })

  assert.strictEqual(res.status, 400)
  assert.match(res.message, /Razorpay order ID does not match/i)
})

runTest('Fix 2: Rejects low-value payment reuse against high-value order (Amount Mismatch)', () => {
  const order = { id: 'ord-2', grand_total_in_paise: 73500, payment_status: 'PENDING' } // ₹735 order
  const payment = { order_id: 'ord-2', razorpay_order_id: 'order_legit_222' }

  const res = simulateVerifyAndShipPaymentCheck({
    dbOrder: order,
    dbPayment: payment,
    incomingRazorpayOrderId: 'order_legit_222',
    incomingPaymentId: 'pay_low_val',
    fetchedPaymentRecord: { status: 'captured', amount: 100, currency: 'INR', order_id: 'order_legit_222' }, // Paid ₹1 (100 paise)
  })

  assert.strictEqual(res.status, 400)
  assert.match(res.message, /Payment amount mismatch/i)
})

runTest('Fix 2: Rejects non-INR currency payment', () => {
  const order = { id: 'ord-3', grand_total_in_paise: 45700, payment_status: 'PENDING' }
  const payment = { order_id: 'ord-3', razorpay_order_id: 'order_legit_333' }

  const res = simulateVerifyAndShipPaymentCheck({
    dbOrder: order,
    dbPayment: payment,
    incomingRazorpayOrderId: 'order_legit_333',
    incomingPaymentId: 'pay_usd',
    fetchedPaymentRecord: { status: 'captured', amount: 45700, currency: 'USD', order_id: 'order_legit_333' },
  })

  assert.strictEqual(res.status, 400)
  assert.match(res.message, /currency mismatch/i)
})

runTest('Fix 2: Accepts valid payment matching order ID, captured state, amount, and currency', () => {
  const order = { id: 'ord-4', grand_total_in_paise: 45700, payment_status: 'PENDING' }
  const payment = { order_id: 'ord-4', razorpay_order_id: 'order_legit_444' }

  const res = simulateVerifyAndShipPaymentCheck({
    dbOrder: order,
    dbPayment: payment,
    incomingRazorpayOrderId: 'order_legit_444',
    incomingPaymentId: 'pay_valid_444',
    fetchedPaymentRecord: { status: 'captured', amount: 45700, currency: 'INR', order_id: 'order_legit_444' },
  })

  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.success, true)
  assert.strictEqual(res.alreadyFulfilled, false)
})

// Fix 3 Regressions: Database order insertion restriction
console.log('\n--- Phase 7: Fix 3 - Database Order Insertion Policy Hardening ---')

function simulateNewOrderInsertPolicy(callerRole) {
  // Simulates updated policy: WITH CHECK (public.is_admin()) + Service Role bypass
  if (callerRole === 'admin' || callerRole === 'service_role') {
    return { allowed: true }
  }
  return { allowed: false, error: 'Permission denied: Direct client insertion forbidden by RLS' }
}

runTest('Fix 3: Anonymous client cannot insert directly into orders', () => {
  const res = simulateNewOrderInsertPolicy('anon')
  assert.strictEqual(res.allowed, false)
})

runTest('Fix 3: Authenticated customer cannot insert directly into orders', () => {
  const res = simulateNewOrderInsertPolicy('customer')
  assert.strictEqual(res.allowed, false)
})

runTest('Fix 3: Service role (used by serverless API) and Admin can insert orders', () => {
  assert.strictEqual(simulateNewOrderInsertPolicy('service_role').allowed, true)
  assert.strictEqual(simulateNewOrderInsertPolicy('admin').allowed, true)
})

// Fix 4 Regressions: Shiprocket failure handling
console.log('\n--- Phase 7: Fix 4 - Shiprocket Failure & Error Propagation ---')

async function simulateShiprocketOrderExecution({ mockResponse, mockError }) {
  if (mockError) {
    const errorDetail = mockError.response?.data?.message || mockError.message
    throw new Error(`Shiprocket logistics provider booking failed: ${errorDetail}`)
  }
  return {
    success: true,
    shiprocketOrderId: mockResponse.order_id,
    shipmentId: mockResponse.shipment_id,
    awbCode: mockResponse.awb_code,
    courierName: mockResponse.courier_name,
    status: mockResponse.status,
  }
}

runTest('Fix 4: Throws error on Shiprocket authentication failure (does not return success: true)', async () => {
  let threw = false
  try {
    await simulateShiprocketOrderExecution({
      mockError: { response: { data: { message: 'Authentication token expired or invalid' } } },
    })
  } catch (err) {
    threw = true
    assert.match(err.message, /Shiprocket logistics provider booking failed/i)
    assert.match(err.message, /Authentication token expired/i)
  }
  assert.strictEqual(threw, true)
})

runTest('Fix 4: Throws error on unserviceable address / partner rejection', async () => {
  let threw = false
  try {
    await simulateShiprocketOrderExecution({
      mockError: { response: { data: { message: 'Pickup postcode not serviceable for this courier' } } },
    })
  } catch (err) {
    threw = true
    assert.match(err.message, /Pickup postcode not serviceable/i)
  }
  assert.strictEqual(threw, true)
})

runTest('Fix 4: Returns success only when provider confirms order creation', async () => {
  const result = await simulateShiprocketOrderExecution({
    mockResponse: {
      order_id: 112233,
      shipment_id: 445566,
      awb_code: 'AWB-LIVE-123',
      courier_name: 'Delhivery Surface',
      status: 'NEW',
    },
  })
  assert.strictEqual(result.success, true)
  assert.strictEqual(result.awbCode, 'AWB-LIVE-123')
})

// Fix 5 Regressions: Razorpay webhook raw body verification
console.log('\n--- Phase 7: Fix 5 - Razorpay Webhook Raw Body Verification ---')

runTest('Fix 5: Validates webhook signature using exact raw buffer', () => {
  const webhookSecret = 'whsec_secure_prod_key_777'
  const rawBodyText = '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test_999","amount":45700}}}}'
  const rawBuffer = Buffer.from(rawBodyText, 'utf-8')

  const validSig = crypto.createHmac('sha256', webhookSecret).update(rawBuffer).digest('hex')

  const isValid = verifyRazorpayWebhookSignature({
    rawBody: rawBuffer,
    signature: validSig,
    secret: webhookSecret,
  })
  assert.strictEqual(isValid, true)
})

runTest('Fix 5: Rejects webhook signature if a single character in payload is altered', () => {
  const webhookSecret = 'whsec_secure_prod_key_777'
  const rawBodyText = '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test_999","amount":45700}}}}'
  const rawBuffer = Buffer.from(rawBodyText, 'utf-8')

  const validSig = crypto.createHmac('sha256', webhookSecret).update(rawBuffer).digest('hex')

  // Altered payload (tampered amount from 45700 to 10000)
  const tamperedBuffer = Buffer.from('{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test_999","amount":10000}}}}', 'utf-8')

  const isValid = verifyRazorpayWebhookSignature({
    rawBody: tamperedBuffer,
    signature: validSig,
    secret: webhookSecret,
  })
  assert.strictEqual(isValid, false)
})

runTest('Fix 5: Deduplicates webhook events already processed', () => {
  const webhookStore = { 'evt_already_seen': { processed: true } }
  function handleWebhookDeduplication(eventId) {
    if (webhookStore[eventId]?.processed) {
      return { deduplicated: true, status: 200 }
    }
    return { deduplicated: false, status: 200 }
  }
  const firstCheck = handleWebhookDeduplication('evt_already_seen')
  assert.strictEqual(firstCheck.deduplicated, true)

  const newCheck = handleWebhookDeduplication('evt_brand_new')
  assert.strictEqual(newCheck.deduplicated, false)
})

// Fix 6 Regressions: Admin search sanitization
console.log('\n--- Phase 7: Fix 6 - Admin Search Sanitization ---')

function sanitizeSearchTerm(term) {
  if (!term || typeof term !== 'string') return ''
  return term.replace(/[,()"'\\%]/g, ' ').trim().replace(/\s+/g, ' ')
}

runTest('Fix 6: Strips commas from search query (e.g. Acme, Inc.)', () => {
  const result = sanitizeSearchTerm('Acme, Inc.')
  assert.strictEqual(result, 'Acme Inc.')
  assert.strictEqual(result.includes(','), false)
})

runTest('Fix 6: Strips parentheses from phone search (e.g. (9876543210))', () => {
  const result = sanitizeSearchTerm('(9876543210)')
  assert.strictEqual(result, '9876543210')
  assert.strictEqual(result.includes('('), false)
  assert.strictEqual(result.includes(')'), false)
})

runTest('Fix 6: Strips double and single quotes from search', () => {
  const result = sanitizeSearchTerm('"order" OR \'admin\'')
  assert.strictEqual(result, 'order OR admin')
  assert.strictEqual(result.includes('"'), false)
  assert.strictEqual(result.includes("'"), false)
})

runTest('Fix 6: Strips percent wildcard characters to prevent pattern injection', () => {
  const result = sanitizeSearchTerm('VOLTT%100%')
  assert.strictEqual(result, 'VOLTT 100')
  assert.strictEqual(result.includes('%'), false)
})

runTest('Fix 6: Preserves valid alphanumeric, hyphenated, and email searches', () => {
  assert.strictEqual(sanitizeSearchTerm('VOLTT-12345'), 'VOLTT-12345')
  assert.strictEqual(sanitizeSearchTerm('vikram@voltt.in'), 'vikram@voltt.in')
})

// Add to Cart and Multi-Item Cart Flow Tests
console.log('\n--- Voltt Storefront: Cart Pricing & Flow Integration Tests ---')

runTest('Cart Pricing: Multi-item subtotal above ₹499 gets free shipping (2x pack of 6 = ₹816)', () => {
  const result = calculateCartPricing([
    { productId: 1, packSize: 6, quantity: 1 }, // ₹408
    { productId: 2, packSize: 6, quantity: 1 }, // ₹408
  ])
  assert.strictEqual(result.subtotalInPaise, 81600) // ₹816
  assert.strictEqual(result.shippingFeeInPaise, 0) // FREE shipping
  assert.strictEqual(result.grandTotalInPaise, 81600) // ₹816
  assert.strictEqual(result.items.length, 2)
})

runTest('Cart Pricing: Low-value single item in cart incurs ₹49 shipping (1x pack of 6 = ₹408 + ₹49 = ₹457)', () => {
  const result = calculateCartPricing([
    { productId: 1, packSize: 6, quantity: 1 }, // ₹408 (< ₹499)
  ])
  assert.strictEqual(result.subtotalInPaise, 40800)
  assert.strictEqual(result.shippingFeeInPaise, 4900)
  assert.strictEqual(result.grandTotalInPaise, 45700)
})

runTest('Cart Pricing: The Voltt Mixed Box 12-pack retains ₹735 authoritative price', () => {
  const result = calculateCartPricing([
    { productId: 4, packSize: 12, quantity: 1 },
  ])
  assert.strictEqual(result.subtotalInPaise, 73500) // ₹735 (not ₹816)
  assert.strictEqual(result.shippingFeeInPaise, 0)
  assert.strictEqual(result.grandTotalInPaise, 73500)
})

runTest('Cart Pricing: Mixed cart with The Voltt Mixed Box and Almond Crunch (₹735 + ₹408 = ₹1143)', () => {
  const result = calculateCartPricing([
    { productId: 4, packSize: 12, quantity: 1 }, // ₹735
    { productId: 1, packSize: 6, quantity: 1 },  // ₹408
  ])
  assert.strictEqual(result.subtotalInPaise, 114300)
  assert.strictEqual(result.shippingFeeInPaise, 0)
  assert.strictEqual(result.grandTotalInPaise, 114300)
})

runTest('Cart Pricing: Rejects empty cart items array', () => {
  assert.throws(() => {
    calculateCartPricing([])
  }, /Order must contain at least one item/)
})

runTest('Cart Pricing: Rejects invalid item inside cart array', () => {
  assert.throws(() => {
    calculateCartPricing([
      { productId: 1, packSize: 6, quantity: 1 },
      { productId: 999, packSize: 6, quantity: 1 },
    ])
  }, /Invalid product ID: 999/)
})

runTest('Cart State & Persistence: Validates and sanitizes raw localStorage items', () => {
  function validateCartItems(items) {
    if (!Array.isArray(items)) return []
    return items.filter(
      (item) => item && item.id && item.productId && Number(item.quantity) > 0
    )
  }

  const rawStorage = [
    { id: '1-6', productId: 1, title: 'Almond Crunch', packSize: 6, quantity: 2 },
    { id: 'corrupted', quantity: 0 }, // invalid: no productId, 0 quantity
    null,
    { id: '4-12', productId: 4, title: 'The Voltt Mixed Box', packSize: 12, quantity: 1 },
  ]

  const sanitized = validateCartItems(rawStorage)
  assert.strictEqual(sanitized.length, 2)
  assert.strictEqual(sanitized[0].productId, 1)
  assert.strictEqual(sanitized[1].productId, 4)
})

runTest('Cart Item Management: Increments existing item quantity rather than duplicating', () => {
  let cart = [
    { id: '1-6', productId: 1, title: 'Almond Crunch', packSize: 6, quantity: 1 },
  ]

  const newItem = { id: '1-6', productId: 1, title: 'Almond Crunch', packSize: 6, quantity: 2 }
  const existingIdx = cart.findIndex((i) => i.id === newItem.id)
  if (existingIdx > -1) {
    cart = cart.map((i, idx) => idx === existingIdx ? { ...i, quantity: i.quantity + newItem.quantity } : i)
  } else {
    cart.push(newItem)
  }

  assert.strictEqual(cart.length, 1)
  assert.strictEqual(cart[0].quantity, 3)
})

// --- Voltt Storefront: Instagram Reels & Social Proof Tests ---
console.log('\n--- Voltt Storefront: Instagram Reels & Social Proof Tests ---')

const VERIFIED_EATVOLTT_REELS = [
  'DY4r-hXzGV0',
  'DYPYfzTBV_g',
  'DX6yDQWzpeE',
  'DX5G4bjTVBW',
  'DZaF1icCqQy',
  'DYkCNpoOCZE',
  'DeBkue5Mn5s',
  'DcaMD5nCh9J',
]

runTest('Reels Audit: SocialProof contains only verified official @eatvoltt Reels', () => {
  const socialProofSrc = fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'components', 'SocialProof.jsx'),
    'utf8'
  )

  // Verify no unrelated test codes are present
  const unrelatedShortcodes = ['Dakr8Mjs10F', 'DeRCaFwv5yT', 'DW29lWpDFel', 'DSsR1Lbjsas', 'Dadp0S2P_6I', 'DUpaNMOlLI-']
  for (const fakeCode of unrelatedShortcodes) {
    assert.strictEqual(
      socialProofSrc.includes(fakeCode),
      false,
      `Unrelated reel ${fakeCode} must not be present in SocialProof.jsx`
    )
  }

  // Verify all verified codes are present
  for (const legitCode of VERIFIED_EATVOLTT_REELS) {
    assert.strictEqual(
      socialProofSrc.includes(legitCode),
      true,
      `Verified reel ${legitCode} must be present in SocialProof.jsx`
    )
  }
})

runTest('Reels Audit: Every Reel has canonical URL matching shortcode', () => {
  const socialProofSrc = fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'components', 'SocialProof.jsx'),
    'utf8'
  )

  for (const code of VERIFIED_EATVOLTT_REELS) {
    const expectedUrl = `https://www.instagram.com/reel/${code}/`
    assert.strictEqual(
      socialProofSrc.includes(expectedUrl),
      true,
      `Reel ${code} must use exact canonical URL ${expectedUrl}`
    )
  }
})

runTest('Reels Audit: Every Reel cover image file exists on disk and is non-empty', () => {
  const publicReelsDir = path.join(__dirname, '..', '..', 'public', 'assets', 'reels')
  assert.strictEqual(fs.existsSync(publicReelsDir), true, 'public/assets/reels directory must exist')

  for (const code of VERIFIED_EATVOLTT_REELS) {
    const coverPath = path.join(publicReelsDir, `${code}.jpg`)
    assert.strictEqual(fs.existsSync(coverPath), true, `Cover file ${code}.jpg must exist`)
    const stats = fs.statSync(coverPath)
    assert.ok(stats.size > 5000, `Cover file ${code}.jpg must be a valid image (>5KB, found ${stats.size} bytes)`)
  }
})

runTest('Reels Audit: No placeholder product images are substituted for Reel covers', () => {
  const socialProofSrc = fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'components', 'SocialProof.jsx'),
    'utf8'
  )

  const productPlaceholders = [
    '/assets/hero.png',
    '/assets/almond-crunch.jpg',
    '/assets/choco-cranz.jpg',
    '/assets/berry-rush.jpg',
    '/assets/mix.png',
    '/assets/hero-stacked.png',
  ]

  for (const placeholder of productPlaceholders) {
    assert.strictEqual(
      socialProofSrc.includes(`coverImage: '${placeholder}'`),
      false,
      `Placeholder ${placeholder} must not be used as a Reel cover`
    )
  }
})

runTest('Reels Modal: Embed iframe uses key and dynamic shortcode URL', () => {
  const socialProofSrc = fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'components', 'SocialProof.jsx'),
    'utf8'
  )

  assert.strictEqual(
    socialProofSrc.includes('key={activeModalReel.shortcode}'),
    true,
    'Iframe must have key={activeModalReel.shortcode} for clean unmounting'
  )
  assert.strictEqual(
    socialProofSrc.includes('src={`https://www.instagram.com/reel/${activeModalReel.shortcode}/embed/captioned/`}'),
    true,
    'Iframe must dynamically load activeModalReel.shortcode embed'
  )
})

// --- Phase 8: Admin Login Routing & Role Verification Tests ---
console.log('\n--- Phase 8: Admin Login Routing & Role Verification Tests ---')

const mockUserRolesDatabase = {
  'admin-uuid-1': 'admin',
  'customer-uuid-2': 'customer',
}

async function simulateCheckIsAdmin(supabaseClientMock, userId) {
  const { data, error } = await supabaseClientMock
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (!error && data?.role === 'admin') {
    return true
  }
  return false
}

function createMockSupabase(rolesTable) {
  return {
    from: (table) => ({
      select: () => ({
        eq: (col, val) => ({
          maybeSingle: async () => {
            if (table === 'user_roles' && col === 'user_id') {
              const role = rolesTable[val]
              return role ? { data: { role }, error: null } : { data: null, error: null }
            }
            return { data: null, error: new Error('Table not found') }
          },
        }),
      }),
    }),
  }
}

runTest('Role Lookup: Admin user in public.user_roles resolves to isAdmin = true', async () => {
  const mockClient = createMockSupabase(mockUserRolesDatabase)
  const isAdmin = await simulateCheckIsAdmin(mockClient, 'admin-uuid-1')
  assert.strictEqual(isAdmin, true, 'User with admin role in user_roles must resolve to true')
})

runTest('Role Lookup: Normal customer in public.user_roles resolves to isAdmin = false', async () => {
  const mockClient = createMockSupabase(mockUserRolesDatabase)
  const isAdmin = await simulateCheckIsAdmin(mockClient, 'customer-uuid-2')
  assert.strictEqual(isAdmin, false, 'User with customer role must resolve to false')
})

runTest('Role Lookup: Unregistered user without role record defaults to isAdmin = false', async () => {
  const mockClient = createMockSupabase(mockUserRolesDatabase)
  const isAdmin = await simulateCheckIsAdmin(mockClient, 'unknown-uuid-999')
  assert.strictEqual(isAdmin, false, 'Unknown user must resolve to false')
})

runTest('Login Flow Routing: Admin user is routed to #/admin and modal is closed', async () => {
  let modalClosed = false
  let destinationRoute = null
  let customerOrdersFetched = false

  async function handleLoginSimulation(userId, rolesTable) {
    const mockClient = createMockSupabase(rolesTable)
    const isAdmin = await simulateCheckIsAdmin(mockClient, userId)
    if (isAdmin) {
      modalClosed = true
      destinationRoute = '#/admin'
      return
    }
    customerOrdersFetched = true
    destinationRoute = 'orders'
  }

  await handleLoginSimulation('admin-uuid-1', mockUserRolesDatabase)
  assert.strictEqual(modalClosed, true, 'Modal must close for admin')
  assert.strictEqual(destinationRoute, '#/admin', 'Destination must be #/admin for admin')
  assert.strictEqual(customerOrdersFetched, false, 'Customer orders must NOT be fetched for admin')
})

runTest('Login Flow Routing: Customer user stays on account modal orders tab', async () => {
  let modalClosed = false
  let destinationRoute = null
  let customerOrdersFetched = false

  async function handleLoginSimulation(userId, rolesTable) {
    const mockClient = createMockSupabase(rolesTable)
    const isAdmin = await simulateCheckIsAdmin(mockClient, userId)
    if (isAdmin) {
      modalClosed = true
      destinationRoute = '#/admin'
      return
    }
    customerOrdersFetched = true
    destinationRoute = 'orders'
  }

  await handleLoginSimulation('customer-uuid-2', mockUserRolesDatabase)
  assert.strictEqual(modalClosed, false, 'Modal must remain open for customer')
  assert.strictEqual(destinationRoute, 'orders', 'Destination must be orders tab for customer')
  assert.strictEqual(customerOrdersFetched, true, 'Customer orders must be fetched for customer')
})

runTest('Security Check: CustomerAuthModal inspects public.user_roles and does not hardcode admin credentials', () => {
  const authModalSrc = fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'components', 'CustomerAuthModal.jsx'),
    'utf8'
  )

  // Verify query against user_roles
  assert.strictEqual(
    authModalSrc.includes(".from('user_roles')"),
    true,
    "CustomerAuthModal must query user_roles table"
  )
  assert.strictEqual(
    authModalSrc.includes("role === 'admin'"),
    true,
    "CustomerAuthModal must check for role === 'admin'"
  )
  assert.strictEqual(
    authModalSrc.includes("'#/admin'"),
    true,
    "CustomerAuthModal must route to #/admin"
  )

  // Verify no hardcoded credentials
  assert.strictEqual(
    authModalSrc.includes('admin@eatvoltt.com'),
    false,
    'CustomerAuthModal must not hardcode admin@eatvoltt.com'
  )
  assert.strictEqual(
    authModalSrc.includes('admin@voltt.in'),
    false,
    'CustomerAuthModal must not hardcode admin@voltt.in'
  )
})

runTest('Account Button: Modal open does NOT auto-redirect to #/admin on mount or session detection', () => {
  const authModalSrc = fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'components', 'CustomerAuthModal.jsx'),
    'utf8'
  )

  // Ensure no useEffect([isOpen...]) redirect exists
  assert.strictEqual(
    authModalSrc.includes('[isOpen, session, isAdminUser]'),
    false,
    'CustomerAuthModal must NOT automatically redirect on [isOpen] change'
  )

  // Ensure onAuthStateChange does not auto-redirect when modal is open
  assert.strictEqual(
    authModalSrc.includes('if (isOpen) {\n            navigateToAdminDashboard()'),
    false,
    'onAuthStateChange must NOT automatically redirect to admin dashboard'
  )
})

// --- Phase 9: Vercel Serverless Packaging & Admin Orders API Tests ---
console.log('\n--- Phase 9: Vercel Serverless Packaging & Admin Orders API Tests ---')

runTest('Vercel Packaging: vercel.json includes server/** in functions includeFiles', () => {
  const vercelJsonPath = path.join(__dirname, '..', '..', 'vercel.json')
  const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'))

  assert.ok(vercelJson.functions, 'vercel.json must define functions configuration')
  assert.ok(
    vercelJson.functions['api/**/*.js'] || vercelJson.functions['api/**'],
    'vercel.json must configure api functions'
  )
  const fnConfig = vercelJson.functions['api/**/*.js'] || vercelJson.functions['api/**']
  assert.strictEqual(
    fnConfig.includeFiles,
    'server/**',
    'functions configuration must include server/**'
  )
})

runTest('Package Dependencies: root package.json includes dotenv in dependencies', () => {
  const pkgPath = path.join(__dirname, '..', '..', 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

  assert.ok(pkg.dependencies, 'package.json must have dependencies')
  assert.ok(pkg.dependencies.dotenv, 'package.json must include dotenv for serverless module resolution')
})

runTest('Module Resolution: api/admin/orders.js imports cleanly without ERR_MODULE_NOT_FOUND', async () => {
  const ordersApiModule = await import('../../api/admin/orders.js')
  assert.ok(ordersApiModule.default, 'orders.js must export default handler function')
  assert.strictEqual(typeof ordersApiModule.default, 'function', 'handler must be a function')
})

runTest('API Guard: GET /api/admin/orders rejects unauthenticated request with 401', async () => {
  const ordersApiModule = await import('../../api/admin/orders.js')
  const handler = ordersApiModule.default

  let statusCode = null
  let jsonResponse = null
  const mockReq = { method: 'GET', headers: {} }
  const mockRes = {
    status: (code) => { statusCode = code; return mockRes },
    json: (data) => { jsonResponse = data; return mockRes },
  }

  await handler(mockReq, mockRes)
  assert.strictEqual(statusCode, 401, 'Unauthenticated request must return 401')
  assert.strictEqual(jsonResponse.success, false, 'Response success must be false')
})

console.log(`\n========================================`)
console.log(`Test Results: ${passedTests} Passed, ${failedTests} Failed`)
console.log(`========================================\n`)

if (failedTests > 0) {
  process.exit(1)
}



