import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Package,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Truck,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export default function CustomerAuthModal({ isOpen, onClose }) {
  const [session, setSession] = useState(null)
  const [activeTab, setActiveTab] = useState('login') // 'login' | 'register' | 'forgot' | 'orders'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Brand Tokens
  const navy = '#2A1646'
  const coral = '#F95738'
  const cream = '#F5F2EB'
  const creamCard = '#FAF8F3'
  const border = '#E6DFD3'
  const gold = '#D9A441'
  const green = '#5D8C4A'
  const muted = '#71717A'

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      if (currentSession) {
        setActiveTab('orders')
        fetchCustomerOrders(currentSession.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      if (currentSession) {
        setActiveTab('orders')
        fetchCustomerOrders(currentSession.user.id)
      } else {
        setOrders([])
        setActiveTab('login')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCustomerOrders = async (userId) => {
    if (!supabase || !userId) return
    setLoadingOrders(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), shipments(*), payments(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setOrders(data)
      }
    } catch (err) {
      console.warn('[Fetch Customer Orders Error]:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setErrorMessage('Database service is not configured.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) throw error

      setSuccessMessage('Welcome back! Successfully signed in.')
      setActiveTab('orders')
      fetchCustomerOrders(data.user.id)
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setErrorMessage('Database service is not configured.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      })

      if (error) throw error

      if (data.session) {
        setSuccessMessage('Account created successfully!')
        setActiveTab('orders')
      } else {
        setSuccessMessage('Registration successful! Please check your email to verify your account.')
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setErrorMessage('Database service is not configured.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '#/reset-password',
      })

      if (error) throw error

      setSuccessMessage('Password reset instructions have been sent to your email.')
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send password reset email.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!supabase) return
    setLoading(true)
    await supabase.auth.signOut()
    setSession(null)
    setOrders([])
    setActiveTab('login')
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl my-auto"
          style={{ border: `1px solid ${border}`, background: cream }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 text-white" style={{ background: navy }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#D9A441]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base tracking-tight text-white">
                  {session ? 'Customer Account & Orders' : 'Customer Sign In'}
                </h3>
                <p className="text-[11px] text-white/60 font-medium">
                  {session ? session.user.email : 'View your Voltt order history and shipping status'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
            {/* Feedback Banners */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl text-xs flex items-center gap-2 bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl text-xs flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* TAB: Order History (When Authenticated) */}
            {session && activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD3]">
                  <div>
                    <h4 className="font-display font-bold text-lg" style={{ color: navy }}>
                      Your Past Orders
                    </h4>
                    <p className="text-xs text-gray-500">
                      Logged in as {session.user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E6DFD3] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    style={{ color: navy }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: navy }} />
                    <p className="text-xs text-gray-500">Loading your verified order records...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-[#E6DFD3] p-6">
                    <Package className="w-10 h-10 mx-auto text-gray-400" />
                    <h5 className="font-display font-bold text-base" style={{ color: navy }}>No Orders Found</h5>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      You haven't placed any orders with this account yet. When you buy, your orders will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isPaid = order.payment_status === 'PAID'
                      const isShipped = order.fulfillment_status === 'SHIPPED'
                      const shipment = (order.shipments || [])[0]

                      return (
                        <div
                          key={order.id}
                          className="bg-white rounded-2xl border border-[#E6DFD3] p-5 shadow-xs space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E6DFD3]/60 text-xs">
                            <div>
                              <span className="font-mono font-bold text-sm" style={{ color: navy }}>
                                {order.order_number}
                              </span>
                              <span className="text-gray-400 block text-[11px]">
                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  isPaid
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {order.payment_status}
                              </span>

                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  isShipped
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {order.fulfillment_status}
                              </span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-1.5 text-xs text-gray-700">
                            {(order.order_items || []).map((item) => (
                              <div key={item.id} className="flex justify-between items-center">
                                <span>
                                  {item.product_title} × {item.quantity} (Pack of {item.pack_size || 1})
                                </span>
                                <span className="font-mono font-medium">
                                  ₹{((item.total_price_in_paise || 0) / 100).toFixed(0)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Order Total & Tracking */}
                          <div className="pt-2 border-t border-[#E6DFD3]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-gray-900">
                              Total Paid: <span className="font-mono text-sm" style={{ color: navy }}>₹{((order.grand_total_in_paise || 0) / 100).toFixed(0)}</span>
                            </span>

                            {shipment?.tracking_url && (
                              <a
                                href={shipment.tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track on Shiprocket</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Login Form */}
            {!session && activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h4 className="font-display font-black text-2xl uppercase" style={{ color: navy }}>
                    Sign In to Voltt
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your email to view order history and delivery tracking.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arjun@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm bg-white"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: muted }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('forgot'); setErrorMessage(''); setSuccessMessage('') }}
                      className="text-[11px] font-bold text-[#F95738] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm bg-white"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
                  style={{ background: navy }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                  <span>Sign In</span>
                </button>

                <div className="text-center pt-3 border-t border-[#E6DFD3] text-xs text-gray-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage('') }}
                    className="font-bold text-[#F95738] hover:underline cursor-pointer"
                  >
                    Register here
                  </button>
                </div>
              </form>
            )}

            {/* TAB: Register Form */}
            {!session && activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h4 className="font-display font-black text-2xl uppercase" style={{ color: navy }}>
                    Create Account
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Join Voltt to manage delivery addresses and speed through checkout.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                    Password (Min 6 Characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
                  style={{ background: navy }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                  <span>Register Account</span>
                </button>

                <div className="text-center pt-3 border-t border-[#E6DFD3] text-xs text-gray-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage('') }}
                    className="font-bold text-[#F95738] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            )}

            {/* TAB: Forgot Password */}
            {!session && activeTab === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h4 className="font-display font-black text-2xl uppercase" style={{ color: navy }}>
                    Reset Password
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your registered email address and we'll send a password recovery link.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: muted }}>
                    Account Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
                  style={{ background: navy }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>Send Recovery Email</span>
                </button>

                <div className="text-center pt-3 border-t border-[#E6DFD3] text-xs text-gray-500">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage('') }}
                    className="font-bold text-[#F95738] hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
