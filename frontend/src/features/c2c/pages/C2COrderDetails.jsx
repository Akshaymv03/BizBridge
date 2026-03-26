import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchC2COrderDetails, cancelC2COrder } from '../c2cOrderSlice'
import Loader from '../../../components/common/Loader'
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  X,
  User,
  Phone,
  Mail,
} from 'lucide-react'

const C2COrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentOrder: order, loading } = useSelector((state) => state.c2cOrders)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  useEffect(() => {
    dispatch(fetchC2COrderDetails(id))
  }, [dispatch, id])

  const handleCancelOrder = async () => {
    setCancelling(true)
    await dispatch(cancelC2COrder(id))
    setCancelling(false)
    setShowCancelConfirm(false)
  }

  const getStatusStyle = (status) => {
    const styles = {
      PENDING:    'bg-yellow-50 text-yellow-700 border border-yellow-200',
      PROCESSING: 'bg-blue-50 text-blue-700 border border-blue-200',
      SHIPPED:    'bg-purple-50 text-purple-700 border border-purple-200',
      DELIVERED:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
      CANCELLED:  'bg-red-50 text-red-600 border border-red-200',
    }
    return styles[status] || 'bg-gray-100 text-gray-600 border border-gray-200'
  }

  const canCancel = order?.order_status === 'PENDING' || order?.order_status === 'PROCESSING'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader text="Loading order details..." />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Order not found</p>
          <button
            onClick={() => navigate('/c2c/orders')}
            className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/c2c/orders')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition mb-3"
          >
            <ArrowLeft size={16} /> Back to Orders
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Placed on{' '}
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusStyle(order.order_status)}`}>
                {order.order_status}
              </span>
              {canCancel && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — items + address + seller contacts */}
        <div className="lg:col-span-2 space-y-5">

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-emerald-600" /> Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.product_details?.image ? (
                      <img
                        src={item.product_details.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={22} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">{item.product_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-xs text-gray-400">₹{parseFloat(item.product_price).toLocaleString()} each</p>
                  </div>
                  <p className="font-bold text-emerald-700 text-sm shrink-0">
                    ₹{parseFloat(item.subtotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Contacts */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-emerald-600" /> Seller Contacts
            </h2>
            <p className="text-xs text-gray-400 mb-3">
              Reach out to sellers directly to arrange payment & delivery.
            </p>
            <div className="space-y-3">
              {order.items?.map((item) =>
                item.contact_email || item.contact_phone ? (
                  <div
                    key={item.id}
                    className="flex flex-col gap-1 p-3 bg-emerald-50 rounded-xl border border-emerald-100"
                  >
                    <p className="text-sm font-semibold text-gray-800">{item.product_name}</p>
                    {item.contact_email && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail size={12} className="text-emerald-500" /> {item.contact_email}
                      </div>
                    )}
                    {item.contact_phone && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Phone size={12} className="text-emerald-500" /> {item.contact_phone}
                      </div>
                    )}
                  </div>
                ) : null
              )}
              {!order.items?.some((i) => i.contact_email || i.contact_phone) && (
                <p className="text-sm text-gray-400">No seller contact info available.</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" /> Delivery Address
            </h2>
            <div className="text-sm text-gray-700 space-y-0.5">
              <p className="font-semibold">{order.full_name}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.zip_code}</p>
              <p>{order.country}</p>
              <p className="mt-2 text-gray-500">{order.email}</p>
              <p className="text-gray-500">{order.phone}</p>
            </div>
          </div>
        </div>

        {/* Right — summary + payment + tracking + notes */}
        <div className="lg:col-span-1 space-y-5">

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{parseFloat(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span>₹{parseFloat(order.tax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{order.shipping_cost > 0 ? `₹${parseFloat(order.shipping_cost).toLocaleString()}` : 'FREE'}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="text-emerald-700">₹{parseFloat(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-emerald-600" /> Payment
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Method</p>
                <p className="font-semibold text-gray-800">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Status</p>
                <p className={`font-semibold ${
                  order.payment_status === 'COMPLETED' ? 'text-emerald-600'
                  : order.payment_status === 'FAILED'  ? 'text-red-500'
                  : 'text-yellow-600'
                }`}>
                  {order.payment_status}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.tracking_number && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Truck size={16} className="text-emerald-600" /> Tracking
              </h2>
              <p className="text-xs text-gray-400">Tracking Number</p>
              <p className="font-mono font-semibold text-gray-800">{order.tracking_number}</p>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-2">Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
              <button onClick={() => setShowCancelConfirm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default C2COrderDetails