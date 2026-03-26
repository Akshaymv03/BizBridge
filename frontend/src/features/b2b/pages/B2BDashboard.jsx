import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyRFQs, fetchB2BOrders, fetchDashboardStats } from '../b2bSlice'
import { b2bApi } from '../../../services/api'
import Loader from '../../../components/common/Loader'
import {
  FileText,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  BarChart3,
  ArrowUpRight,
  ShoppingBag,
  Truck,
  XCircle,
  AlertCircle,
  RefreshCw,
  CircleDot,
} from 'lucide-react'

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'text-amber-700 bg-amber-50 border-amber-200',   icon: Clock },
  unavailable: { label: 'Unavailable', color: 'text-red-700 bg-red-50 border-red-200',        icon: XCircle},
  responded:  { label: 'Responded', color: 'text-blue-700 bg-blue-50 border-blue-200',       icon: RefreshCw },
  accepted:   { label: 'Accepted',  color: 'text-green-700 bg-green-50 border-green-200',    icon: CheckCircle2 },
  rejected:   { label: 'Rejected',  color: 'text-red-700 bg-red-50 border-red-200',          icon: XCircle },
  cancelled:  { label: 'Cancelled', color: 'text-gray-500 bg-gray-100 border-gray-200',      icon: XCircle },
  processing: { label: 'Processing', color: 'text-blue-700 bg-blue-50 border-blue-200',      icon: CircleDot },
  shipped:    { label: 'Shipped',    color: 'text-indigo-700 bg-indigo-50 border-indigo-200', icon: Truck },
  delivered:  { label: 'Delivered', color: 'text-green-700 bg-green-50 border-green-200',    icon: CheckCircle2 },
}

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}

const StatCard = ({ label, value, icon: Icon, sub, color = 'blue' }) => {
  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    green:  'bg-green-50 text-green-600 border-green-100',
    amber:  'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

const B2BDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const {
    quotes,
    quotesLoading,
    bulkOrders,
    ordersLoading,
    dashboardStats,
    dashboardLoading,
  } = useSelector((state) => state.b2b)

  // Persist active tab in URL so reload keeps the same tab
  const activeTab = searchParams.get('tab') || 'rfqs'
  const setActiveTab = (tab) => setSearchParams({ tab })

  const [placingOrder, setPlacingOrder] = useState(null)
  const [orderError, setOrderError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    dispatch(fetchMyRFQs())
    dispatch(fetchB2BOrders())
    dispatch(fetchDashboardStats())
  }, [isAuthenticated])

  const handlePlaceOrder = async (rfq) => {
    setPlacingOrder(rfq.id)
    setOrderError(null)
    try {
      await b2bApi.createBulkOrder({
        rfq: rfq.id,
        total_amount: rfq.quoted_price
          ? Number(rfq.quoted_price) * rfq.quantity
          : Number(rfq.target_price) * rfq.quantity,
        notes: `Order placed from accepted RFQ for ${rfq.product_name}`,
      })
      dispatch(fetchB2BOrders())
      dispatch(fetchDashboardStats())
      setActiveTab('orders') // URL updates → survives reload
    } catch (err) {
      setOrderError('Failed to place order. Please try again.')
    } finally {
      setPlacingOrder(null)
    }
  }

  const stats = dashboardStats || {}

  if (dashboardLoading && !dashboardStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">B2B Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
              {user?.company_name ? ` · ${user.company_name}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/b2b/products')}
              className="px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-50 transition"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate('/b2b/rfq')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition"
            >
              <Plus size={16} /> New RFQ
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total RFQs"
            value={stats.total_rfqs ?? quotes.length}
            icon={FileText}
            color="blue"
          />
          <StatCard
            label="Active Orders"
            value={stats.active_orders ?? bulkOrders.filter(o => !['delivered','cancelled'].includes(o.status)).length}
            icon={Package}
            color="green"
          />
          <StatCard
            label="Pending Responses"
            value={stats.pending_rfqs ?? quotes.filter(q => q.status === 'pending').length}
            icon={Clock}
            color="amber"
          />
          <StatCard
            label="Total Spent"
            value={stats.total_spent ? `₹${Number(stats.total_spent).toLocaleString()}` : '—'}
            icon={BarChart3}
            color="purple"
            sub="Across all orders"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 px-4">
            {[
              { key: 'rfqs', label: 'My RFQs', count: quotes.length },
              { key: 'orders', label: 'Bulk Orders', count: bulkOrders.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 -mb-px transition ${
                  activeTab === tab.key
                    ? 'text-blue-700 border-blue-700'
                    : 'text-gray-500 border-transparent hover:text-gray-800'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* RFQs Tab */}
          {activeTab === 'rfqs' && (
            <div>
              {quotesLoading ? (
                <div className="py-10"><Loader text="Loading RFQs..." /></div>
              ) : quotes.length === 0 ? (
                <div className="text-center py-14">
                  <FileText size={40} className="text-gray-300 mx-auto mb-3" strokeWidth={1} />
                  <p className="text-gray-500 font-medium">No RFQs submitted yet</p>
                  <p className="text-gray-400 text-sm mt-1">Find a product and request a quote to get started</p>
                  <button
                    onClick={() => navigate('/b2b/rfq')}
                    className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition mx-auto"
                  >
                    <Plus size={15} /> Submit RFQ
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orderError && (
                    <div className="px-6 py-3 bg-red-50 text-red-600 text-sm border-b border-red-100">
                      {orderError}
                    </div>
                  )}
                  {quotes.map((rfq) => (
                    <div key={rfq.id} className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition group">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {rfq.product_name || `RFQ #${rfq.id}`}
                          </p>
                          <StatusBadge status={rfq.status} />
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>Qty: <strong className="text-gray-700">{rfq.quantity}</strong></span>
                          {rfq.target_price && (
                            <span>Target: <strong className="text-gray-700">₹{Number(rfq.target_price).toLocaleString()}</strong></span>
                          )}
                          {rfq.destination && <span>To: {rfq.destination}</span>}
                          <span>{new Date(rfq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {/* Responded — show quoted price */}
                        {rfq.status === 'responded' && rfq.quoted_price && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-3 py-1">
                            <CheckCircle2 size={13} className="text-green-600" />
                            <span className="text-xs font-semibold text-green-700">
                              Quote received: ₹{Number(rfq.quoted_price).toLocaleString()} / unit
                            </span>
                          </div>
                        )}

                        {/* Accepted — show Place Order CTA */}
                        {rfq.status === 'accepted' && (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
                              <CheckCircle2 size={13} className="text-green-600" />
                              <span className="text-xs font-semibold text-green-700">
                                {rfq.quoted_price
                                  ? `Quoted: ₹${Number(rfq.quoted_price).toLocaleString()} / unit · Total: ₹${(Number(rfq.quoted_price) * rfq.quantity).toLocaleString()}`
                                  : 'Quote accepted — ready to order'}
                              </span>
                            </div>
                            <button
                              onClick={() => handlePlaceOrder(rfq)}
                              disabled={placingOrder === rfq.id}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {placingOrder === rfq.id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Placing...
                                </>
                              ) : (
                                <>
                                  <ShoppingBag size={13} />
                                  Place Order
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/b2b/rfq/${rfq.id}`)}
                        className="text-gray-400 group-hover:text-blue-600 transition shrink-0 mt-1"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div className="py-10"><Loader text="Loading orders..." /></div>
              ) : bulkOrders.length === 0 ? (
                <div className="text-center py-14">
                  <Package size={40} className="text-gray-300 mx-auto mb-3" strokeWidth={1} />
                  <p className="text-gray-500 font-medium">No bulk orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">Orders placed after an accepted quote will appear here</p>
                  <button
                    onClick={() => navigate('/b2b/products')}
                    className="mt-4 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition mx-auto block"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {bulkOrders.map((order) => (
                    <div key={order.id} className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition group">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">Order #{order.id}</p>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>Items: <strong className="text-gray-700">{order.items?.length || '—'}</strong></span>
                          {order.total_amount && (
                            <span>Total: <strong className="text-gray-700">₹{Number(order.total_amount).toLocaleString()}</strong></span>
                          )}
                          {order.created_at && (
                            <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="text-gray-400 group-hover:text-blue-600 transition shrink-0 mt-1"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Submit a New RFQ',
              desc: 'Get quotes from multiple suppliers',
              icon: FileText,
              path: '/b2b/rfq',
              color: 'blue',
            },
            {
              title: 'Browse Products',
              desc: 'Explore bulk-ready catalogue',
              icon: Package,
              path: '/b2b',
              color: 'green',
            },
            {
              title: 'View Analytics',
              desc: 'Track spending and orders',
              icon: TrendingUp,
              path: '/b2b/dashboard',
              color: 'purple',
            },
          ].map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="bg-white border border-gray-200 rounded-2xl p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all group flex items-start gap-4"
            >
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <action.icon size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition">{action.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition ml-auto mt-1 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default B2BDashboard