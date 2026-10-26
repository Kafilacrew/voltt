import { checkPincodeServiceability } from '../_services/shiprocket.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { pincode } = req.body || {}

    if (!pincode || typeof pincode !== 'string' || !/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        message: 'A valid 6-digit Indian delivery PIN code is required.',
      })
    }

    const cleanPincode = pincode.trim()
    const result = await checkPincodeServiceability({ deliveryPincode: cleanPincode })

    return res.status(200).json(result)
  } catch (error) {
    console.error('[API /api/pincode/check Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to verify PIN code serviceability. Please try again.',
    })
  }
}
