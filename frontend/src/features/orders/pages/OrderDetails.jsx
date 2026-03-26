import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderDetails, cancelOrder } from '../orderSlice'
import Loader from '../../../components/common/Loader'
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  X,
} from 'lucide-react'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentOrder: order, loading } = useSelector((state) => state.orders)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  
  useEffect(() => {
    dispatch(fetchOrderDetails(id))
  }, [dispatch, id])
  
  const handleCancelOrder = async () => {
    setCancelling(true)
    await dispatch(cancelOrder(id))
    setCancelling(false)
    setShowCancelConfirm(false)
  }
  
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
          <p className="text-red-600 text-xl mb-4">Order not found</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on{' '}
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  order.order_status
                )}`}
              >
                {order.order_status}
              </span>
              
              {canCancel && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={24} />
                Order Items
              </h2>
              
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.product_details?.image ? (
                        <img
                          src={item.product_details.image}
                          alt={item.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📦
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ₹{parseFloat(item.product_price).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{parseFloat(item.subtotal).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={24} />
                Shipping Address
              </h2>
              
              <div className="text-gray-700">
                <p className="font-semibold">{order.full_name}</p>
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.state} {order.zip_code}
                </p>
                <p>{order.country}</p>
                <p className="mt-2">
                  <span className="text-gray-600">Email:</span> {order.email}
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span> {order.phone}
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Summary & Payment */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{parseFloat(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{parseFloat(order.tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {order.shipping_cost > 0
                      ? `₹${parseFloat(order.shipping_cost).toLocaleString()}`
                      : 'FREE'}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{parseFloat(order.total).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                Payment Details
              </h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <p className="font-semibold">{order.payment_method}</p>
                </div>
                <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <p
                    className={`font-semibold ${
                      order.payment_status === 'COMPLETED'
                        ? 'text-green-600'
                        : order.payment_status === 'FAILED'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {order.payment_status}
                  </p>
                </div>
              </div>
            </div>
            
            {order.tracking_number && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck size={24} />
                  Tracking
                </h2>
                
                <div>
                  <span className="text-gray-600 text-sm">Tracking Number:</span>
                  <p className="font-mono font-semibold">{order.tracking_number}</p>
                </div>
              </div>
            )}
            
            {order.notes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                disabled={cancelling}
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails