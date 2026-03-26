import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchOrders } from '../orderSlice'
import Loader from '../../../components/common/Loader'
import { Package, Calendar, DollarSign, Eye } from 'lucide-react'

const OrderHistory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading } = useSelector((state) => state.orders)
  
  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])
  
  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-600',
      COMPLETED: 'text-green-600',
      FAILED: 'text-red-600',
      REFUNDED: 'text-blue-600',
    }
    return colors[status] || 'text-gray-600'
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader text="Loading orders..." />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.order_number}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Package size={16} />
                          <span>{order.item_count} items</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          <span className={getPaymentStatusColor(order.payment_status)}>
                            Payment {order.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total & Action */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{parseFloat(order.total).toLocaleString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
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

export default OrderHistory