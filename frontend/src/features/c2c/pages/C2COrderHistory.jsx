import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchC2COrders } from '../c2cOrderSlice'
import Loader from '../../../components/common/Loader'
import { Package, Calendar, Eye, ShoppingBag, User } from 'lucide-react'

const C2COrderHistory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading } = useSelector((state) => state.c2cOrders)

  useEffect(() => {
    dispatch(fetchC2COrders())
  }, [dispatch])

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

  const getPaymentStyle = (status) => {
    const styles = {
      PENDING:   'text-yellow-600',
      COMPLETED: 'text-emerald-600',
      FAILED:    'text-red-500',
      REFUNDED:  'text-blue-600',
    }
    return styles[status] || 'text-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader text="Loading your C2C orders..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={22} className="text-emerald-600" />
            My C2C Orders
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Orders placed through the C2C marketplace</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Package size={30} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">No C2C orders yet</h2>
            <p className="text-gray-400 text-sm mb-6">Browse listings and place your first order</p>
            <button
              onClick={() => navigate('/c2c')}
              className="px-6 py-2.5 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* Left — order info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base font-bold text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusStyle(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={13} />
                        {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
                      </div>
                      {order.notes && (
                        <div className="flex items-center gap-1">
                          <User size={13} />
                          <span className="truncate max-w-[180px]">{order.notes}</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-xs mt-1.5 font-medium ${getPaymentStyle(order.payment_status)}`}>
                      Payment: {order.payment_status}
                    </p>
                  </div>

                  {/* Right — total & action */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-xl font-bold text-emerald-700">
                        ₹{parseFloat(order.total).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/c2c/orders/${order.id}`)}
                      className="p-2.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default C2COrderHistory