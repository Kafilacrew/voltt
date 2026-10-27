import axios from 'axios'

try {
  const { default: dotenv } = await import('dotenv')
  dotenv?.config()
} catch (_) {
  // In serverless runtimes (e.g. Vercel), env vars are provided natively via process.env
}

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

let cachedToken = null
let tokenExpiresAt = null
let lastAuthErrorDetail = null

function cleanEnv(val) {
  if (!val || typeof val !== 'string') return ''
  return val.trim().replace(/^["']|["']$/g, '')
}

/**
 * Invalidate cached token on 401 or token refresh
 */
export function invalidateShiprocketToken() {
  cachedToken = null
  tokenExpiresAt = null
}

/**
 * Get Shiprocket JWT Authentication Token with caching, alias support, and sanitization
 */
export async function getShiprocketToken() {
  // 1. Check for pre-generated / direct Bearer token in environment variables
  const directToken = cleanEnv(
    process.env.SHIPROCKET_TOKEN ||
    process.env.SHIPROCKET_API_TOKEN ||
    process.env.SHIPROCKET_BEARER_TOKEN ||
    process.env.SHIPROCKET_AUTH_TOKEN
  )

  if (directToken && directToken !== 'your-token-here' && !directToken.includes('your_')) {
    lastAuthErrorDetail = null
    return directToken
  }

  // 2. Resolve credentials from standard names or environment aliases
  const email = cleanEnv(
    process.env.SHIPROCKET_EMAIL ||
    process.env.SHIPROCKET_USER ||
    process.env.SHIPROCKET_USERNAME ||
    process.env.SHIPROCKET_API_EMAIL ||
    process.env.SHIPROCKET_API_USER
  )

  const password = cleanEnv(
    process.env.SHIPROCKET_PASSWORD ||
    process.env.SHIPROCKET_PASS ||
    process.env.SHIPROCKET_PWD ||
    process.env.SHIPROCKET_SECRET ||
    process.env.SHIPROCKET_API_PASSWORD
  )

  if (!email || !password || email === 'your-email@example.com' || email.includes('your_')) {
    lastAuthErrorDetail = 'Credentials missing or unconfigured (expected SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD, or SHIPROCKET_TOKEN)'
    console.warn(`[Shiprocket] ${lastAuthErrorDetail}. Running in simulation mode in test environments.`)
    return null
  }

  // Return cached token if valid
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  try {
    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/auth/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    )

    if (response.data && response.data.token) {
      cachedToken = response.data.token
      // Set expiration to 9 days (Shiprocket tokens expire in 10 days)
      tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000
      lastAuthErrorDetail = null
      console.log('[Shiprocket] Successfully authenticated & token cached.')
      return cachedToken
    } else {
      lastAuthErrorDetail = response.data?.message || 'Login request succeeded but no token returned.'
      return null
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : error.message)
    lastAuthErrorDetail = errorMsg
    console.error('[Shiprocket Auth Error]:', errorMsg)
    return null
  }
}

/**
 * Retrieve registered pickup locations from Shiprocket account
 */
export async function getShiprocketPickupLocations(token) {
  if (!token) return []
  try {
    const response = await axios.get(`${SHIPROCKET_BASE_URL}/settings/company/pickup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    })
    const addresses = response.data?.data?.shipping_address || []
    return addresses.map((addr) => addr.pickup_location).filter(Boolean)
  } catch (err) {
    console.warn('[Shiprocket Pickup Locations Warning]:', err.response?.data?.message || err.message)
    return []
  }
}

/**
 * Check delivery pincode serviceability
 */
export async function checkPincodeServiceability({ deliveryPincode, pickupPincode, weight = 0.5 }) {
  const token = await getShiprocketToken()
  const effectivePickupPincode = cleanEnv(
    pickupPincode ||
    process.env.SHIPROCKET_PICKUP_PINCODE ||
    process.env.SHIPROCKET_WAREHOUSE_PINCODE ||
    '110001'
  )

  // Simulation mode if credentials not active
  if (!token) {
    const isValid = /^\d{6}$/.test(deliveryPincode)
    return {
      success: true,
      simulated: true,
      serviceable: isValid,
      courierName: isValid ? 'Voltt Express Delivery (Shiprocket Partner)' : null,
      estimatedDelivery: isValid ? '3 - 5 Business Days' : null,
      message: isValid
        ? 'Pincode is serviceable'
        : 'Please enter a valid 6-digit Indian Pincode',
    }
  }

  try {
    const response = await axios.get(`${SHIPROCKET_BASE_URL}/courier/serviceability`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pickup_postcode: effectivePickupPincode,
        delivery_postcode: deliveryPincode,
        weight: weight,
        cod: 0,
      },
      timeout: 15000,
    })

    const data = response.data
    const availableCouriers = data?.data?.available_courier_companies || []
    const isServiceable = availableCouriers.length > 0

    return {
      success: true,
      serviceable: isServiceable,
      courierName: isServiceable ? availableCouriers[0].courier_name : null,
      estimatedDelivery: isServiceable ? availableCouriers[0].etd : null,
      availableCouriersCount: availableCouriers.length,
      message: isServiceable
        ? `Delivery available via ${availableCouriers[0].courier_name}`
        : 'Delivery is currently not available to this pincode.',
    }
  } catch (error) {
    console.error('[Shiprocket Pincode Error]:', error.response?.data || error.message)
    const isValid = /^\d{6}$/.test(deliveryPincode)
    return {
      success: true,
      simulated: true,
      serviceable: isValid,
      courierName: 'Voltt Express Delivery',
      estimatedDelivery: '3 - 5 Business Days',
      message: 'Pincode validated.',
    }
  }
}

/**
 * Format any field errors from Shiprocket into a readable detail string
 */
function extractErrorDetail(error) {
  let errorDetail = error.response?.data?.message
  if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
    const fieldErrors = Object.entries(error.response.data.errors)
      .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
      .join('; ')
    errorDetail = `${errorDetail ? errorDetail + ' - ' : ''}${fieldErrors}`
  } else if (!errorDetail) {
    errorDetail = typeof error.response?.data === 'string' ? error.response.data : error.message
  }
  return errorDetail
}

/**
 * Create an Ad-Hoc Order in Shiprocket
 */
export async function createShiprocketOrder({
  orderId,
  customerName,
  email,
  phone,
  address,
  city,
  state,
  pincode,
  items = [],
  totalAmount = 0,
  shippingCharges = 0,
}) {
  const token = await getShiprocketToken()

  const configuredPickup = cleanEnv(
    process.env.SHIPROCKET_PICKUP_LOCATION ||
    process.env.SHIPROCKET_PICKUP_NAME ||
    process.env.SHIPROCKET_WAREHOUSE
  )

  let pickupLocation = configuredPickup || 'Primary'

  // If live token is active, ensure pickup location matches an existing registered address
  if (token) {
    const availableLocations = await getShiprocketPickupLocations(token)
    if (availableLocations.length > 0) {
      if (configuredPickup && availableLocations.includes(configuredPickup)) {
        pickupLocation = configuredPickup
      } else if (availableLocations.includes('Primary')) {
        pickupLocation = 'Primary'
      } else {
        pickupLocation = availableLocations[0]
        console.log(`[Shiprocket] Active pickup location resolved to '${pickupLocation}' from account settings.`)
      }
    }
  }

  const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ')

  const nameParts = (customerName || 'Valued Customer').trim().split(/\s+/)
  const firstName = nameParts[0] || 'Valued'
  const lastName = nameParts.slice(1).join(' ') || 'Customer'

  const cleanPhone = (phone || '').toString().replace(/\D/g, '').slice(-10) || '9876543210'
  const cleanPincode = (pincode || '').toString().replace(/\D/g, '').slice(0, 6)
  const cleanAddress = (address || '').trim().length >= 5 ? address.trim() : `${(address || '').trim()} Street Address`
  const cleanCity = (city || 'City').trim()
  const cleanState = (state || 'State').trim()
  const cleanEmail = (email || 'orders@eatvoltt.com').trim()

  const safeItems = Array.isArray(items) && items.length > 0
    ? items
    : [{ title: 'Voltt Protein Bars', sku: 'VOLTT-BARS', quantity: 1, price: totalAmount }]

  const orderItems = safeItems.map((item) => {
    const units = Math.max(1, parseInt(item.units || item.quantity || 1, 10))
    const itemPrice = item.selling_price !== undefined
      ? parseFloat(item.selling_price)
      : (item.price !== undefined
          ? parseFloat(item.price)
          : (parseFloat(totalAmount || 0) > 0 ? parseFloat(totalAmount) / units : 1))

    return {
      name: (item.title || item.name || 'Voltt Bar').trim(),
      sku: (item.sku || `VOLTT-${item.id || 'BAR'}`).trim(),
      units,
      selling_price: Math.max(1, Math.round(itemPrice * 100) / 100),
      discount: 0,
      tax: 0,
      hsn: 1905,
    }
  })

  // Calculate sum of item totals (units * selling_price)
  const itemsSubtotal = orderItems.reduce((acc, i) => acc + (i.units * i.selling_price), 0)
  const parsedTotal = parseFloat(totalAmount) || 0
  const parsedShipping = parseFloat(shippingCharges) || 0

  let effectiveSubTotal = Math.round(itemsSubtotal * 100) / 100
  let effectiveShippingCharges = 0

  if (parsedShipping > 0) {
    effectiveShippingCharges = Math.round(parsedShipping * 100) / 100
  } else if (parsedTotal > effectiveSubTotal) {
    effectiveShippingCharges = Math.round((parsedTotal - effectiveSubTotal) * 100) / 100
  }

  if (effectiveSubTotal <= 0) {
    effectiveSubTotal = Math.max(1, parsedTotal)
  }

  const payload = {
    order_id: orderId,
    order_date: formattedDate,
    pickup_location: pickupLocation,
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: cleanAddress,
    billing_address_2: '',
    billing_city: cleanCity,
    billing_pincode: cleanPincode,
    billing_state: cleanState,
    billing_country: 'India',
    billing_email: cleanEmail,
    billing_phone: cleanPhone,
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: 'Prepaid',
    sub_total: effectiveSubTotal,
    shipping_charges: effectiveShippingCharges,
    total_discount: 0,
    length: 15,
    breadth: 10,
    height: 5,
    weight: 0.5,
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const allowSimulation = process.env.ALLOW_SHIPROCKET_SIMULATION === 'true' || (!isProduction && !process.env.SHIPROCKET_EMAIL && !process.env.SHIPROCKET_TOKEN)

  // Simulation mode strictly restricted to non-production test configurations
  if (!token) {
    if (!isProduction && allowSimulation) {
      console.warn('[Shiprocket Simulation] Mock order booked in non-production:', orderId)
      return {
        success: true,
        simulated: true,
        shiprocketOrderId: `SR-SIM-${Date.now()}`,
        shipmentId: `SHP-SIM-${Math.floor(100000 + Math.random() * 900000)}`,
        awbCode: `AWB${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        courierName: 'Voltt Express Shipping',
        trackingUrl: `https://shiprocket.co/tracking/${orderId}`,
        status: 'NEW',
      }
    }
    const reason = lastAuthErrorDetail ? ` (${lastAuthErrorDetail})` : ''
    throw new Error(`Shiprocket credentials are not configured or authentication failed${reason}.`)
  }

  // Attempt Order Creation with automatic retry handling for duplicate IDs
  async function dispatchOrder(targetOrderId) {
    payload.order_id = targetOrderId
    const res = await axios.post(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    })

    if (res.data?.status_code === 0 || (!res.data?.order_id && !res.data?.shipment_id)) {
      const msg = res.data?.message || (res.data?.errors ? JSON.stringify(res.data.errors) : 'Shiprocket order creation returned status code 0')
      const err = new Error(msg)
      err.response = res
      throw err
    }
    return res
  }

  try {
    let response
    try {
      response = await dispatchOrder(orderId)
    } catch (firstErr) {
      const errText = extractErrorDetail(firstErr).toLowerCase()
      // If order already exists in Shiprocket (e.g. from a previous retry attempt), retry with unique reference
      if (
        errText.includes('already exists') ||
        errText.includes('duplicate') ||
        errText.includes('already been taken')
      ) {
        const retrySuffix = `R${Math.floor(Date.now() / 1000).toString().slice(-4)}`
        const retryOrderId = `${orderId}-${retrySuffix}`
        console.warn(`[Shiprocket Order Exists]: Retrying with unique reference ${retryOrderId}`)
        response = await dispatchOrder(retryOrderId)
      } else {
        throw firstErr
      }
    }

    const data = response.data

    console.log('[Shiprocket Order Created Successfully]:', data)

    return {
      success: true,
      shiprocketOrderId: data.order_id,
      shipmentId: data.shipment_id,
      awbCode: data.awb_code || null,
      courierName: data.courier_name || 'Shiprocket Logistics',
      trackingUrl: `https://shiprocket.co/tracking/${payload.order_id}`,
      status: data.status,
    }
  } catch (error) {
    if (error.response?.status === 401) {
      invalidateShiprocketToken()
    }
    const errorDetail = extractErrorDetail(error)
    console.error('[Shiprocket Order Creation Error]:', errorDetail)
    throw new Error(`Shiprocket logistics provider booking failed: ${errorDetail}`)
  }
}
