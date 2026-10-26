/**
 * Trusted Server-Side Product Catalog & Price Engine
 * Monetary values are handled strictly in integer paise (₹1 = 100 paise).
 */

export const SERVER_PRODUCTS = {
  1: {
    id: 1,
    title: 'Almond Crunch',
    eventSlug: 'almond-crunch',
    priceInPaise: 6800, // ₹68
    eyebrow: 'Nutty Clean Fuel',
  },
  2: {
    id: 2,
    title: 'Berry Rush',
    eventSlug: 'berry-rush',
    priceInPaise: 6800, // ₹68
    eyebrow: 'Berry-Forward Recovery',
  },
  3: {
    id: 3,
    title: 'Choco Cranz',
    eventSlug: 'choco-cranz',
    priceInPaise: 6800, // ₹68
    eyebrow: 'Cranberry Cocoa Energy',
  },
  4: {
    id: 4,
    title: 'The Voltt Mixed Box',
    eventSlug: 'mixed-flavours',
    priceInPaise: 6800, // ₹68 base per bar
    mixedBox12PriceInPaise: 73500, // ₹735 for 12-bar mixed box
    eyebrow: 'Mixed Flavour Starter',
  },
}

export const VALID_PACK_SIZES = [1, 6, 12, 24]
export const FREE_SHIPPING_THRESHOLD_IN_PAISE = 49900 // ₹499
export const STANDARD_SHIPPING_FEE_IN_PAISE = 4900 // ₹49

/**
 * Calculate trusted server-side pricing in paise
 */
export function calculateOrderPricing({ productId, packSize = 6, quantity = 1 }) {
  const product = SERVER_PRODUCTS[productId]
  if (!product) {
    throw new Error(`Invalid product ID: ${productId}`)
  }

  const parsedPackSize = Number(packSize)
  const parsedQuantity = Number(quantity)

  if (!VALID_PACK_SIZES.includes(parsedPackSize) || parsedPackSize <= 0) {
    throw new Error(`Invalid pack size: ${packSize}. Must be one of [${VALID_PACK_SIZES.join(', ')}]`)
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 50) {
    throw new Error(`Invalid quantity: ${quantity}. Must be an integer between 1 and 50`)
  }

  // Handle special 12-pack pricing for The Voltt Mixed Box (₹735)
  let unitPriceInPaise = product.priceInPaise
  let itemSubtotalInPaise = 0

  if (product.id === 4 && parsedPackSize === 12 && product.mixedBox12PriceInPaise) {
    itemSubtotalInPaise = product.mixedBox12PriceInPaise * parsedQuantity
  } else {
    itemSubtotalInPaise = unitPriceInPaise * parsedPackSize * parsedQuantity
  }

  const shippingFeeInPaise = itemSubtotalInPaise >= FREE_SHIPPING_THRESHOLD_IN_PAISE
    ? 0
    : STANDARD_SHIPPING_FEE_IN_PAISE

  const grandTotalInPaise = itemSubtotalInPaise + shippingFeeInPaise

  return {
    product,
    packSize: parsedPackSize,
    quantity: parsedQuantity,
    unitPriceInPaise,
    subtotalInPaise: itemSubtotalInPaise,
    shippingFeeInPaise,
    grandTotalInPaise,
  }
}

/**
 * Calculate trusted server-side pricing for an array of cart items
 */
export function calculateCartPricing(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item.')
  }

  let subtotalInPaise = 0
  const processedItems = []

  for (const item of items) {
    const single = calculateOrderPricing({
      productId: item.productId || item.id,
      packSize: item.packSize || (Number(item.productId || item.id) === 4 ? 12 : 6),
      quantity: item.quantity || 1,
    })
    subtotalInPaise += single.subtotalInPaise
    processedItems.push(single)
  }

  const shippingFeeInPaise = subtotalInPaise >= FREE_SHIPPING_THRESHOLD_IN_PAISE
    ? 0
    : STANDARD_SHIPPING_FEE_IN_PAISE

  const grandTotalInPaise = subtotalInPaise + shippingFeeInPaise

  return {
    items: processedItems,
    subtotalInPaise,
    shippingFeeInPaise,
    grandTotalInPaise,
  }
}

