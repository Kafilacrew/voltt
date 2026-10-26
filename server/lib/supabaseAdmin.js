import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Privileged Supabase Admin Client (Server-side Only)
 * Uses the Service Role Key to bypass RLS for trusted backend operations
 * (e.g. verifying payments, writing webhook events, recording audit logs).
 * 
 * NEVER expose this client or the service role key to frontend/client code.
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceRoleKey || supabaseServiceRoleKey === 'your_service_role_key_here') {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    supabaseUrl &&
    supabaseServiceRoleKey &&
    supabaseServiceRoleKey !== 'your_service_role_key_here' &&
    supabaseUrl !== 'https://your-project.supabase.co'
  )
}

/**
 * Verify Administrator Token Server-Side
 * Extracts Bearer token, validates with Supabase Auth,
 * and checks the trusted user_roles table for role = 'admin'.
 */
export async function verifyAdminToken(req) {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { error: 'Database service is not configured on the server.', user: null, isAdmin: false }
  }

  const authHeader = req.headers?.authorization || req.headers?.Authorization
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or malformed Authorization header.', user: null, isAdmin: false }
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    return { error: 'Empty session token.', user: null, isAdmin: false }
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return { error: 'Invalid or expired user session.', user: null, isAdmin: false }
    }

    const { data: roleRow, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (roleError || !roleRow || roleRow.role !== 'admin') {
      return { error: 'Forbidden: Account does not possess administrator privileges.', user, isAdmin: false }
    }

    return { error: null, user, isAdmin: true }
  } catch (err) {
    return { error: err.message || 'Authorization check failed.', user: null, isAdmin: false }
  }
}
