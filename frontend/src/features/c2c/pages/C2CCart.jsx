import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToC2CCart } from "../c2cCartSlice";
import {
  selectC2CCartItems,
  selectC2CCartTotal,
  removeFromC2CCart,
  updateC2CQuantity,
  clearC2CCart,
} from '../c2cCartSlice'
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  ShieldCheck, User, Package,
} from 'lucide-react'

const CONDITION_LABELS = {
  new:       'New',
  like_new:  'Like New',
  good:      'Good',
  fair:      'Fair',
  for_parts: 'For Parts',
}

const C2CCart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items    = useSelector(selectC2CCartItems)
  const total    = useSelector(selectC2CCartTotal)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <ShoppingCart size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your C2C cart is empty</h2>
        <p className="text-gray-400 text-sm">Browse listings and add items to get started</p>
        <button
          onClick={() => navigate('/c2c')}
          className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition"
        >
          <ArrowLeft size={16} /> Browse Listings
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/c2c')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart size={20} className="text-emerald-600" />
              C2C Cart
              <span className="text-sm font-normal text-gray-400">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            </h1>
          </div>
          <button
            onClick={() => dispatch(clearC2CCart())}
            className="text-xs text-red-400 hover:text-red-600 underline transition"
          >
            Clear cart
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4">

              {/* Image */}
              <div
                onClick={() => navigate(`/c2c/listings/${item.id}`)}
                className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 cursor-pointer"
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={28} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3
                  onClick={() => navigate(`/c2c/listings/${item.id}`)}
                  className="font-semibold text-gray-900 text-sm line-clamp-2 cursor-pointer hover:text-emerald-700 transition mb-1"
                >
                  {item.name}
                </h3>

                {item.condition && (
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    {CONDITION_LABELS[item.condition] || item.condition}
                  </span>
                )}

                {item.seller_name && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <User size={11} /> {item.seller_name}
                  </div>
                )}

                <p className="text-base font-bold text-emerald-700 mt-2">
                  ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">₹{parseFloat(item.price).toLocaleString()} each</p>
              </div>

              {/* Quantity + Remove */}
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={() => dispatch(removeFromC2CCart(item.id))}
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => dispatch(updateC2CQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-emerald-400 hover:text-emerald-600 transition"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateC2CQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    disabled={item.quantity >= item.stock_quantity}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-emerald-400 hover:text-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-6">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate max-w-[140px]">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-800 shrink-0 ml-2">
                    ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-emerald-700">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Prices are negotiable with sellers</p>
            </div>

            <button
              onClick={() => navigate('/c2c/checkout')}
              className="w-full py-3 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/c2c')}
              className="w-full py-2.5 mt-2 border border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition text-sm"
            >
              Continue Browsing
            </button>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-center mt-4">
              <ShieldCheck size={12} className="text-green-500" />
              Always transact in safe public places
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default C2CCart