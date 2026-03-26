import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectC2CCartItems,
  selectC2CCartTotal,
  clearC2CCart,
} from '../c2cCartSlice'
import api from '../../../services/api'
import { CheckCircle2, AlertCircle, ChevronLeft, ShieldCheck } from 'lucide-react'

const C2CCheckout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items    = useSelector(selectC2CCartItems)
  const total    = useSelector(selectC2CCartTotal)
  const { user } = useSelector((state) => state.auth)

  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState('')

  const [form, setForm] = useState({
    full_name:      user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username || '',
    email:          user?.email || '',
    phone:          user?.phone || '',
    address:        '',
    city:           '',
    state:          '',
    zip_code:       '',
    country:        'India',
    payment_method: 'COD',
    notes:          '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Name is required'
    if (!form.email.trim())     e.email     = 'Email is required'
    if (!form.phone.trim())     e.phone     = 'Phone is required'
    if (!form.address.trim())   e.address   = 'Address is required'
    if (!form.city.trim())      e.city      = 'City is required'
    if (!form.state.trim())     e.state     = 'State is required'
    if (!form.zip_code.trim())  e.zip_code  = 'ZIP code is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setError('')

    try {
      await api.post('/orders/', {
        ...form,
        notes: `C2C order. ${form.notes ? form.notes + ' | ' : ''}Sellers: ${[...new Set(items.map(i => i.seller_name))].join(', ')}`,
        items: items.map(item => ({
          product_id: item.id,
          name:       item.name,
          price:      item.price,
          quantity:   item.quantity,
        })),
      })
      dispatch(clearC2CCart())
      setSuccess(true)
    } catch (err) {
      setError('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !success) {
    navigate('/c2c/cart')
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm mb-5">
            Your C2C order has been recorded. Contact the sellers below to arrange payment and delivery.
          </p>

          {/* Seller Contacts */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-sm font-semibold text-emerald-800 mb-2">Seller Contacts</p>
            {items.map(item =>
              item.contact_email || item.contact_phone ? (
                <div key={item.id} className="text-xs text-gray-600 border-b border-emerald-100 pb-2 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  {item.contact_email && <p>📧 {item.contact_email}</p>}
                  {item.contact_phone && <p>📞 {item.contact_phone}</p>}
                </div>
              ) : null
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/c2c/orders')}
              className="flex-1 py-2.5 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition"
            >
              My Orders
            </button>
            <button
              onClick={() => navigate('/c2c')}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Browse More
            </button>
          </div>
        </div>
      </div>
    )
  }

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/c2c/cart')}
            className="text-gray-500 hover:text-emerald-600 transition"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">C2C Checkout</h1>
            <p className="text-sm text-gray-500">Arrange delivery directly with the seller</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — form */}
            <div className="lg:col-span-2 space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {/* Contact */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Your Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input name="full_name" value={form.full_name} onChange={handleChange} className={inputClass('full_name')} />
                    {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass('email')} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className={inputClass('phone')} />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                    <textarea name="address" rows={2} value={form.address} onChange={handleChange}
                      className={`${inputClass('address')} resize-none`} />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} className={inputClass('city')} />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                    <input name="state" value={form.state} onChange={handleChange} className={inputClass('state')} />
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code *</label>
                    <input name="zip_code" value={form.zip_code} onChange={handleChange} className={inputClass('zip_code')} />
                    {errors.zip_code && <p className="text-xs text-red-500 mt-1">{errors.zip_code}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <input name="country" value={form.country} onChange={handleChange} className={inputClass('country')} />
                  </div>
                </div>
              </div>

              {/* Payment & Notes */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Payment & Notes</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-emerald-200 bg-emerald-50 rounded-xl cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={form.payment_method === 'COD'}
                      onChange={handleChange}
                      className="accent-emerald-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Cash on Delivery / UPI</p>
                      <p className="text-xs text-gray-500">Arrange payment directly with the seller</p>
                    </div>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes for Seller (optional)</label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Any special instructions..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate max-w-[150px]">{item.name} × {item.quantity}</span>
                      <span className="shrink-0 ml-2 font-medium text-gray-800">
                        ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 mb-5">
                  <div className="flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span>
                    <span className="text-emerald-700">₹{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Delivery arranged with seller</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing...</>
                  ) : 'Place Order'}
                </button>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-center mt-4">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  Always transact in safe public places
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default C2CCheckout