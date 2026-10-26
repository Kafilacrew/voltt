import { verifyRazorpayWebhookSignature } from '../_services/razorpay.js'
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js'

// Disable automatic body parsing so exact raw incoming bytes are preserved for HMAC signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBodyBuffer(req) {
  if (Buffer.isBuffer(req.body)) return req.body
  if (req.rawBody && Buffer.isBuffer(req.rawBody)) return req.rawBody
  if (typeof req.rawBody === 'string') return Buffer.from(req.rawBody, 'utf-8')
  if (typeof req.body === 'string') return Buffer.from(req.body, 'utf-8')

  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  if (chunks.length > 0) {
    return Buffer.concat(chunks)
  }
  return Buffer.from(JSON.stringify(req.body || {}), 'utf-8')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const signature = req.headers['x-razorpay-signature']
  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header' })
  }

  const rawBuffer = await getRawBodyBuffer(req)

  // 1. Verify Webhook Signature using exact untouched byte stream
  const isValid = verifyRazorpayWebhookSignature({
    rawBody: rawBuffer,
    signature,
    secret: process.env.RAZORPAY_WEBHOOK_SECRET,
  })

  if (!isValid) {
    console.warn('[Razorpay Webhook]: Invalid webhook signature received.')
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' })
  }

  let event
  try {
    event = JSON.parse(rawBuffer.toString('utf-8'))
  } catch (parseErr) {
    return res.status(400).json({ success: false, message: 'Invalid JSON webhook payload' })
  }
  const eventId = event.event_id || event.id || `evt_${Date.now()}`
  const eventType = event.event

  const supabase = getSupabaseAdmin()

  // 2. Event Deduplication via Supabase
  if (supabase) {
    const { data: existingEvent, error: checkError } = await supabase
      .from('webhook_events')
      .select('id, processed')
      .eq('event_id', eventId)
      .maybeSingle()

    if (existingEvent && existingEvent.processed) {
      console.log(`[Razorpay Webhook]: Event ${eventId} already processed. Acknowledging with 200 OK.`)
      return res.status(200).json({ received: true, deduplicated: true })
    }

    if (!existingEvent) {
      await supabase.from('webhook_events').insert({
        event_id: eventId,
        event_type: eventType,
        provider: 'razorpay',
        payload: event,
        processed: false,
      })
    }
  }

  // 3. Process Event Types
  try {
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity
      const razorpayOrderId = paymentEntity?.order_id
      const razorpayPaymentId = paymentEntity?.id

      if (supabase && razorpayOrderId) {
        // Find matching payment record
        const { data: paymentRecord } = await supabase
          .from('payments')
          .select('order_id, payment_status')
          .eq('razorpay_order_id', razorpayOrderId)
          .maybeSingle()

        if (paymentRecord) {
          // Update Payment status to CAPTURED
          await supabase
            .from('payments')
            .update({
              razorpay_payment_id: razorpayPaymentId,
              payment_status: 'CAPTURED',
              raw_response: paymentEntity,
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', paymentRecord.order_id)

          // Update Order status to PAID (if not already completed)
          await supabase
            .from('orders')
            .update({
              payment_status: 'PAID',
              updated_at: new Date().toISOString(),
            })
            .eq('id', paymentRecord.order_id)
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity
      const razorpayOrderId = paymentEntity?.order_id

      if (supabase && razorpayOrderId) {
        await supabase
          .from('payments')
          .update({
            payment_status: 'FAILED',
            error_code: paymentEntity?.error_code || null,
            error_description: paymentEntity?.error_description || null,
            raw_response: paymentEntity,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', razorpayOrderId)
      }
    }

    // 4. Mark Event as Processed
    if (supabase) {
      await supabase
        .from('webhook_events')
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
        })
        .eq('event_id', eventId)
    }

    return res.status(200).json({ received: true, event: eventType })
  } catch (err) {
    console.error(`[Razorpay Webhook Error on ${eventType}]:`, err)
    if (supabase) {
      await supabase
        .from('webhook_events')
        .update({
          error_message: err.message,
        })
        .eq('event_id', eventId)
    }
    return res.status(500).json({ success: false, message: 'Internal error processing webhook' })
  }
}
