import React, { useState, useEffect } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  Package,
  Truck,
  CreditCard,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  X,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function AdminDashboard() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Admin login form states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Dashboard Data states
  const [metrics, setMetrics] = useState({
    verifiedRevenue: 0,
    totalOrders: 0,
    paidOrdersCount: 0,
    pendingShipmentsCount: 0,
    failedShipmentsCount: 0,
  })
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [retryLoading, setRetryLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState(null)

  // Brand Tokens
  const navy = '#2A1646'
  const coral = '#F95738'
  const border = '#E6DFD3'
  const gold = '#D9A441'
  const green = '#5D8C4A'
  const cream = '#F5F2EB'

  useEffect(() => {
    checkAdminSession()

    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_OUT' || !currentSession) {
        setSession(null)
        setIsAdmin(false)
        setOrders([])
      } else if (currentSession) {
        setSession(currentSession)
        if (event === 'TOKEN_REFRESHED') {
          await verifyAdminAndFetch(currentSession.access_token, true)
        }
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const getValidAdminToken = async () => {
    if (!supabase) return null
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) return null

      // Check if access token is expired or expiring within 60 seconds
      const isExpiringSoon = !currentSession.expires_at || (currentSession.expires_at * 1000 - Date.now() < 60000)
      if (isExpiringSoon) {
        const { data: { session: refreshedSession }, error: refreshErr } = await supabase.auth.refreshSession()
        if (!refreshErr && refreshedSession) {
          setSession(refreshedSession)
          return refreshedSession.access_token
        }
      }

      setSession(currentSession)
      return currentSession.access_token
    } catch (err) {
      console.error('[Admin Token Refresh Error]:', err)
      return session?.access_token || null
    }
  }

  const checkAdminSession = async () => {
    if (!supabase) {
      setCheckingAuth(false)
      return
    }

    setCheckingAuth(true)
    const token = await getValidAdminToken()

    if (!token) {
      setSession(null)
      setIsAdmin(false)
      setCheckingAuth(false)
      return
    }

    await verifyAdminAndFetch(token)
  }

  const verifyAdminAndFetch = async (token, isRetry = false) => {
    setLoadingOrders(true)
    try {
      const res = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // If token expired (401) and not already retrying, refresh session proactively
      if (res.status === 401 && !isRetry && supabase) {
        try {
          const { data: { session: refreshedSession }, error: refreshErr } = await supabase.auth.refreshSession()
          if (!refreshErr && refreshedSession?.access_token) {
            setSession(refreshedSession)
            return await verifyAdminAndFetch(refreshedSession.access_token, true)
          }
        } catch (_) {
          // Fall through
        }
      }

      const data = await res.json()

      if (res.ok && data.success) {
        setIsAdmin(true)
        setMetrics(data.metrics || {})
        setOrders(data.orders || [])
        setLoginError('')
      } else {
        setIsAdmin(false)
        setLoginError(data.message || 'Access Denied: You do not possess administrator privileges.')
      }
    } catch (err) {
      console.error('[Admin Verify Error]:', err)
      setIsAdmin(false)
      setLoginError('Could not verify administrator session. Ensure server is running.')
    } finally {
      setCheckingAuth(false)
      setLoadingOrders(false)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    if (!supabase) return

    setLoginLoading(true)
    setLoginError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      })

      if (error) throw error

      setSession(data.session)
      await verifyAdminAndFetch(data.session.access_token)
    } catch (err) {
      setLoginError(err.message || 'Invalid administrator login credentials.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
    setOrders([])
  }

  const fetchFilteredOrders = async () => {
    const token = await getValidAdminToken()
    if (!token) return
    setLoadingOrders(true)
    setActionMessage(null)

    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)

      let res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 401 && supabase) {
        const { data: { session: refreshedSession }, error: refreshErr } = await supabase.auth.refreshSession()
        if (!refreshErr && refreshedSession?.access_token) {
          setSession(refreshedSession)
          res = await fetch(`/api/admin/orders?${params.toString()}`, {
            headers: {
              Authorization: `Bearer ${refreshedSession.access_token}`,
            },
          })
        }
      }

      const data = await res.json()

      if (data.success) {
        setOrders(data.orders || [])
        if (data.metrics) setMetrics(data.metrics)
      }
    } catch (err) {
      console.error('[Filter Fetch Error]:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleRetryShipment = async (orderId) => {
    const token = await getValidAdminToken()
    if (!token || !orderId) return

    setRetryLoading(true)
    setActionMessage(null)

    try {
      let res = await fetch('/api/admin/retry-shipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      })

      if (res.status === 401 && supabase) {
        const { data: { session: refreshedSession }, error: refreshErr } = await supabase.auth.refreshSession()
        if (!refreshErr && refreshedSession?.access_token) {
          setSession(refreshedSession)
          res = await fetch('/api/admin/retry-shipment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshedSession.access_token}`,
            },
            body: JSON.stringify({ orderId }),
          })
        }
      }

      const data = await res.json()

      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: 'Shipment successfully booked with Shiprocket!' })
        fetchFilteredOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => ({
            ...prev,
            fulfillment_status: 'SHIPPED',
            shipments: [data.shipment],
          }))
        }
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to retry shipment.' })
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Network error communicating with fulfillment service.' })
    } finally {
      setRetryLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#2A1646]" />
          <p className="text-sm font-bold text-[#2A1646]">Verifying Administrator Authorization...</p>
        </div>
      </div>
    )
  }

  // View: Administrator Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F6F3EC]">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E6DFD3] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#2A1646]/10 flex items-center justify-center mx-auto text-[#2A1646]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-[#2A1646]">
              Voltt Admin Console
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Restricted area for order management, verified revenue, and Shiprocket dispatch.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl text-xs bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@voltt.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm text-[#2A1646]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] outline-none text-sm text-[#2A1646]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-[#2A1646] hover:bg-[#1F0F36] text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Authenticate Administrator</span>
            </button>
          </form>



          <div className="pt-4 border-t border-[#E6DFD3] text-center">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F95738] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // View: Main Admin Console
  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#2A1646]">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E6DFD3] sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2 group">
            <img src="/assets/volt-logo-dark.png" alt="Voltt" className="h-7 w-auto object-contain" />
          </a>
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />
          <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-[#2A1646] hidden sm:inline">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500 font-medium hidden md:inline">
            Admin: <strong className="text-gray-800">{session?.user?.email}</strong>
          </span>
          <a
            href="#"
            className="px-3 py-1.5 rounded-lg border border-[#E6DFD3] text-gray-700 hover:bg-gray-50 font-bold"
          >
            Storefront
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-[#2A1646] text-white font-bold cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards Row (Verified Paid Orders Only) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#E6DFD3] p-5 shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Verified Revenue</p>
            <p className="font-mono font-black text-2xl sm:text-3xl text-emerald-600 mt-1">
              ₹{metrics.verifiedRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">From verified captured payments</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DFD3] p-5 shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Orders</p>
            <p className="font-mono font-black text-2xl sm:text-3xl text-[#2A1646] mt-1">
              {metrics.totalOrders}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">{metrics.paidOrdersCount} Paid Orders</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DFD3] p-5 shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pending Shipments</p>
            <p className="font-mono font-black text-2xl sm:text-3xl text-amber-600 mt-1">
              {metrics.pendingShipmentsCount}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Awaiting Shiprocket AWB</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DFD3] p-5 shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Failed Shipments</p>
            <p className="font-mono font-black text-2xl sm:text-3xl text-red-600 mt-1">
              {metrics.failedShipmentsCount}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Requires admin retry</p>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span className="font-medium">{actionMessage.text}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="font-bold underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E6DFD3] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order #, customer name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchFilteredOrders()}
              className="w-full text-xs outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-[#E6DFD3] rounded-lg px-2.5 py-1.5 bg-white outline-none font-bold"
            >
              <option value="ALL">All Orders</option>
              <option value="PAID">Paid Only</option>
              <option value="PENDING">Payment Pending</option>
              <option value="SHIPPED">Shipped</option>
              <option value="SHIPMENT_FAILED">Shipment Failed</option>
            </select>

            <button
              onClick={fetchFilteredOrders}
              className="px-3 py-1.5 bg-[#2A1646] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
              <span>Apply</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-[#E6DFD3] overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-[#E6DFD3] flex items-center justify-between">
            <h3 className="font-display font-bold text-base uppercase tracking-tight text-[#2A1646]">
              Orders Management ({orders.length})
            </h3>
          </div>

          {loadingOrders ? (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#2A1646]" />
              <p className="text-xs text-gray-500">Querying database records...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-xs">
              No orders matched your search or status filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] text-gray-500 font-display uppercase tracking-wider text-[10px] border-b border-[#E6DFD3]">
                  <tr>
                    <th className="px-6 py-3.5">Order Number</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Items</th>
                    <th className="px-6 py-3.5">Total Amount</th>
                    <th className="px-6 py-3.5">Payment</th>
                    <th className="px-6 py-3.5">Fulfillment</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFD3]/60">
                  {orders.map((ord) => {
                    const isPaid = ord.payment_status === 'PAID'
                    const isShipped = ord.fulfillment_status === 'SHIPPED'
                    const isShipmentFailed = ord.fulfillment_status === 'SHIPMENT_FAILED'
                    const shipment = (ord.shipments || [])[0]

                    return (
                      <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[#2A1646]">
                          {ord.order_number}
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{ord.customer_name}</p>
                          <p className="text-[11px] text-gray-500">{ord.customer_email}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {(ord.order_items || []).map((i) => (
                            <span key={i.id} className="block text-[11px]">
                              {i.product_title} × {i.quantity}
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-[#2A1646]">
                          ₹{((ord.grand_total_in_paise || 0) / 100).toFixed(0)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {ord.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isShipped
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : isShipmentFailed
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {ord.fulfillment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1 bg-white border border-[#E6DFD3] rounded-lg font-bold hover:bg-gray-100 cursor-pointer"
                          >
                            Details
                          </button>

                          {isPaid && isShipmentFailed && (
                            <button
                              onClick={() => handleRetryShipment(ord.id)}
                              disabled={retryLoading}
                              className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 cursor-pointer"
                            >
                              Retry Ship
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E6DFD3] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD3]">
              <div>
                <h4 className="font-display font-black text-lg text-[#2A1646]">
                  Order Details: {selectedOrder.order_number}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Delivery Details */}
            <div className="bg-[#FAF8F3] rounded-2xl p-4 border border-[#E6DFD3] space-y-1.5 text-xs">
              <p className="font-bold uppercase tracking-wider text-gray-500 text-[10px]">Customer &amp; Shipping</p>
              <p className="font-bold text-gray-900">{selectedOrder.customer_name} ({selectedOrder.customer_phone})</p>
              <p className="text-gray-600">{selectedOrder.customer_email}</p>
              <p className="text-gray-700 mt-1">
                {selectedOrder.shipping_address}, {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_pincode}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <p className="font-bold uppercase tracking-wider text-gray-500 text-[10px]">Ordered Line Items</p>
              {(selectedOrder.order_items || []).map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-1 border-gray-100">
                  <span>{item.product_title} × {item.quantity} (Pack of {item.pack_size || 1})</span>
                  <span className="font-mono font-bold">₹{((item.total_price_in_paise || 0) / 100).toFixed(0)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 font-bold">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-sm text-[#2A1646]">
                  ₹{((selectedOrder.grand_total_in_paise || 0) / 100).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Shiprocket Fulfillment Details */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-2 text-xs">
              <p className="font-bold uppercase tracking-wider text-blue-800 text-[10px]">Logistics Status</p>
              <p>Current Fulfillment: <strong className="uppercase">{selectedOrder.fulfillment_status}</strong></p>
              {selectedOrder.shipments && selectedOrder.shipments.length > 0 && (
                <div className="space-y-1">
                  {selectedOrder.shipments.map((s) => (
                    <div key={s.id} className="text-gray-700">
                      <p>Courier: <strong>{s.courier_name || 'Assigned'}</strong></p>
                      {s.awb_code && <p>AWB Code: <strong className="font-mono">{s.awb_code}</strong></p>}
                      {s.tracking_url && (
                        <a
                          href={s.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline mt-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Live Tracking Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E6DFD3]">
              {selectedOrder.payment_status === 'PAID' && ['UNFULFILLED', 'SHIPMENT_FAILED'].includes(selectedOrder.fulfillment_status) ? (
                <button
                  onClick={() => handleRetryShipment(selectedOrder.id)}
                  disabled={retryLoading}
                  className="px-4 py-2 bg-[#2A1646] hover:bg-[#1F0F36] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {retryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span>Retry Shiprocket Booking</span>
                </button>
              ) : (
                <span className="text-[11px] text-gray-400">Shipment already active or order unpaid.</span>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-[#E6DFD3] rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
