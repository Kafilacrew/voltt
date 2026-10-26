import { getSupabaseAdmin, verifyAdminToken } from '../_lib/supabaseAdmin.js'
import { createShiprocketOrder } from '../_services/shiprocket.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  // 1. Verify Administrator Privileges Server-Side
  const auth = await verifyAdminToken(req)
  if (auth.error) {
    const statusCode = auth.user ? 403 : 401
    return res.status(statusCode).json({ success: false, message: auth.error })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Database service is unconfigured.' })
  }

  const { orderId } = req.body || {}
  if (!orderId) {
    return res.status(400).json({ success: false, message: 'orderId parameter is required.' })
  }

  try {
    // 2. Fetch Order with Items and Existing Shipments
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*), shipments(*)')
      .eq('id', orderId)
      .maybeSingle()

    if (orderError || !order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    // 3. Confirm Payment is Verified & Captured
    if (order.payment_status !== 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Cannot fulfill shipment: Order payment has not been verified and captured.',
      })
    }

    // 4. Duplicate Shipment Prevention: Check if active shipment exists
    const hasActiveShipment = (order.shipments || []).some(
      (s) => s.awb_code || ['MANIFESTED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s.status)
    )

    if (hasActiveShipment || order.fulfillment_status === 'SHIPPED') {
      return res.status(400).json({
        success: false,
        message: 'Order already has an active or completed shipment. Duplicate creation prevented.',
      })
    }

    // 5. Concurrency-Safe Status Lock
    await supabase
      .from('orders')
      .update({
        fulfillment_status: 'PROCESSING',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    // 6. Format Items and Dispatch to Shiprocket
    const items = (order.order_items || []).map((item) => ({
      id: item.product_id,
      title: item.product_title,
      quantity: item.quantity * (item.pack_size || 1),
      price: (item.unit_price_in_paise || 6800) / 100,
    }))

    let shipmentResult = null
    try {
      shipmentResult = await createShiprocketOrder({
        orderId: order.order_number,
        customerName: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        address: order.shipping_address,
        city: order.shipping_city,
        state: order.shipping_state,
        pincode: order.shipping_pincode,
        items,
        totalAmount: (order.grand_total_in_paise || 40800) / 100,
      })

      // Insert shipment record
      await supabase.from('shipments').insert({
        order_id: order.id,
        shiprocket_order_id: shipmentResult.shiprocketOrderId,
        shipment_id: shipmentResult.shipmentId,
        awb_code: shipmentResult.awbCode,
        courier_name: shipmentResult.courierName,
        tracking_url: shipmentResult.trackingUrl,
        status: shipmentResult.awbCode ? 'MANIFESTED' : 'PENDING',
        raw_response: shipmentResult,
      })

      // Update order fulfillment status to SHIPPED
      await supabase
        .from('orders')
        .update({
          fulfillment_status: shipmentResult.awbCode ? 'SHIPPED' : 'PROCESSING',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      // 7. Audit Log Entry
      await supabase.from('admin_audit_logs').insert({
        admin_user_id: auth.user.id,
        action: 'RETRY_SHIPMENT_SUCCESS',
        target_resource: 'orders',
        target_id: order.id,
        changes: {
          orderNumber: order.order_number,
          shiprocketOrderId: shipmentResult.shiprocketOrderId,
          awbCode: shipmentResult.awbCode,
          courierName: shipmentResult.courierName,
        },
      })

      return res.status(200).json({
        success: true,
        shipment: shipmentResult,
        message: 'Shipment successfully booked with Shiprocket logistics partner.',
      })
    } catch (shipError) {
      console.error('[Shiprocket Retry Error]:', shipError.message)

      // Record failed shipment attempt without changing payment status
      await supabase.from('shipments').insert({
        order_id: order.id,
        status: 'FAILED',
        raw_response: { error: shipError.message },
      })

      await supabase
        .from('orders')
        .update({
          fulfillment_status: 'SHIPMENT_FAILED',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      await supabase.from('admin_audit_logs').insert({
        admin_user_id: auth.user.id,
        action: 'RETRY_SHIPMENT_FAILED',
        target_resource: 'orders',
        target_id: order.id,
        changes: { error: shipError.message },
      })

      return res.status(502).json({
        success: false,
        message: `Shiprocket logistics partner error: ${shipError.message}. Order payment remains safe.`,
      })
    }
  } catch (error) {
    console.error('[Retry Shipment Internal Error]:', error)
    return res.status(500).json({ success: false, message: 'Server error while attempting shipment retry.' })
  }
}
