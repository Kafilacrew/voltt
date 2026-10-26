export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({
    status: 'ok',
    service: 'Voltt Cloud Backend Serverless API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
  })
}
