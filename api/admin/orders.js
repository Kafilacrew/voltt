import { getSupabaseAdmin, verifyAdminToken } from '../../server/lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
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

  try {
    const page = Math.max(1, parseInt(req.query?.page || req.body?.page || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(req.query?.limit || req.body?.limit || '25', 10)))
    const statusFilter = (req.query?.status || req.body?.status || 'ALL').toUpperCase()
    const rawSearch = (req.query?.search || req.body?.search || '').trim().toLowerCase()
    // Sanitize PostgREST filter reserved delimiters (commas, parentheses, quotes, backslashes, wildcards)
    const cleanSearch = rawSearch.replace(/[,()"'\\%]/g, ' ').trim().replace(/\s+/g, ' ')

    const from = (page - 1) * limit
    const to = from + limit - 1

    // 2. Query Orders with Relations
    let query = supabase
      .from('orders')
      .select('*, order_items(*), payments(*), shipments(*)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (statusFilter === 'PAID') {
      query = query.eq('payment_status', 'PAID')
    } else if (statusFilter === 'PENDING') {
      query = query.eq('payment_status', 'PENDING')
    } else if (statusFilter === 'SHIPPED') {
      query = query.eq('fulfillment_status', 'SHIPPED')
    } else if (statusFilter === 'SHIPMENT_FAILED') {
      query = query.eq('fulfillment_status', 'SHIPMENT_FAILED')
    }

    if (cleanSearch) {
      query = query.or(`order_number.ilike.%${cleanSearch}%,customer_name.ilike.%${cleanSearch}%,customer_email.ilike.%${cleanSearch}%`)
    }

    const { data: orders, count: totalCount, error: ordersError } = await query.range(from, to)

    if (ordersError) {
      console.error('[Admin Orders Fetch Error]:', ordersError)
      return res.status(500).json({ success: false, message: 'Could not retrieve orders.' })
    }

    // 3. Compute Metrics (based strictly on verified PAID orders)
    const { data: allOrdersForMetrics, error: metricsError } = await supabase
      .from('orders')
      .select('payment_status, fulfillment_status, grand_total_in_paise')

    let verifiedRevenueInPaise = 0
    let totalOrders = 0
    let paidOrdersCount = 0
    let pendingShipmentsCount = 0
    let failedShipmentsCount = 0

    if (!metricsError && allOrdersForMetrics) {
      totalOrders = allOrdersForMetrics.length
      allOrdersForMetrics.forEach((ord) => {
        if (ord.payment_status === 'PAID') {
          verifiedRevenueInPaise += ord.grand_total_in_paise || 0
          paidOrdersCount++
          if (['UNFULFILLED', 'PROCESSING'].includes(ord.fulfillment_status)) {
            pendingShipmentsCount++
          } else if (ord.fulfillment_status === 'SHIPMENT_FAILED') {
            failedShipmentsCount++
          }
        }
      })
    }

    return res.status(200).json({
      success: true,
      metrics: {
        verifiedRevenue: verifiedRevenueInPaise / 100, // INR
        totalOrders,
        paidOrdersCount,
        pendingShipmentsCount,
        failedShipmentsCount,
      },
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error('[Admin Orders Error]:', error)
    return res.status(500).json({ success: false, message: 'Internal server error processing orders request.' })
  }
}
