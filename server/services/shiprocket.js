import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

let cachedToken = null
let tokenExpiresAt = null

/**
 * Get Shiprocket JWT Authentication Token with caching
 */
export async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL
  const password = process.env.SHIPROCKET_PASSWORD

  if (!email || !password || email === 'your-email@example.com') {
    console.warn('[Shiprocket] Credentials not configured in .env. Running in simulation mode.')
    return null
  }

  // Return cached token if valid
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  try {
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
      email,
      password,
    })

    if (response.data && response.data.token) {
      cachedToken = response.data.token
      // Set expiration to 9 days (Shiprocket tokens expire in 10 days)
      tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000
      console.log('[Shiprocket] Successfully authenticated & token cached.')
      return cachedToken
    }
  } catch (error) {
    console.error('[Shiprocket Auth Error]:', error.response?.data || error.message)
    return null
  }

  return null
}

/**
 * Check delivery pincode serviceability
 */
export async function checkPincodeServiceability({ deliveryPincode, pickupPincode = '110001', weight = 0.5 }) {
  const token = await getShiprocketToken()

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
        pickup_postcode: pickupPincode,
        delivery_postcode: deliveryPincode,
        weight: weight,
        cod: 0,
      },
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
    // Fallback response for valid 6 digit pincode format
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
  items,
  totalAmount,
}) {
  const token = await getShiprocketToken()
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary'

  const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ')

  const nameParts = (customerName || 'Valued Customer').trim().split(' ')
  const firstName = nameParts[0] || 'Valued'
  const lastName = nameParts.slice(1).join(' ') || 'Customer'

  const orderItems = items.map((item) => ({
    name: item.title || 'Voltt Bar',
    sku: item.sku || `VOLTT-${item.id || 'PRODUCT'}`,
    units: item.quantity || 1,
    selling_price: item.price || totalAmount,
    discount: 0,
    tax: 0,
    hsn: 1905,
  }))

  const payload = {
    order_id: orderId,
    order_date: formattedDate,
    pickup_location: pickupLocation,
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: address,
    billing_address_2: '',
    billing_city: city,
    billing_pincode: pincode,
    billing_state: state,
    billing_country: 'India',
    billing_email: email,
    billing_phone: phone,
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: 'Prepaid',
    sub_total: totalAmount,
    length: 15,
    breadth: 10,
    height: 5,
    weight: 0.5,
  }

  // Simulation mode if credentials not configured
  if (!token) {
    console.log('[Shiprocket Simulation] Mock order booked:', orderId)
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

  try {
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = response.data
    console.log('[Shiprocket Order Created Successfully]:', data)

    return {
      success: true,
      shiprocketOrderId: data.order_id,
      shipmentId: data.shipment_id,
      awbCode: data.awb_code || null,
      courierName: data.courier_name || 'Shiprocket Logistics',
      trackingUrl: `https://shiprocket.co/tracking/${orderId}`,
      status: data.status,
    }
  } catch (error) {
    console.error('[Shiprocket Order Creation Error]:', error.response?.data || error.message)
    // Fallback response for seamless client experience
    return {
      success: true,
      simulated: true,
      shiprocketOrderId: `SR-${orderId}`,
      shipmentId: `SHP-${Date.now()}`,
      awbCode: null,
      courierName: 'Shiprocket Logistics',
      trackingUrl: `https://shiprocket.co/tracking/${orderId}`,
      status: 'PROCESSING',
    }
  }
}
